import Complaint from '../models/Complaint.js';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Customer)
export const submitComplaint = async (req, res) => {
  try {
    const { subject, description, appointmentId, priority } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        message: 'Please provide subject and description',
      });
    }

    const complaint = await Complaint.create({
      customer: req.user._id,
      appointment: appointmentId || null,
      subject,
      description,
      priority: priority || 'Medium',
      status: 'Open',
    });

    await complaint.populate('customer', 'name email');
    if (appointmentId) {
      await complaint.populate('appointment', 'serviceType date');
    }

    // Send email notification to manager
    try {
      const emailText = `New Complaint Received

Customer: ${req.user.name}
Email: ${req.user.email}
Subject: ${subject}
Priority: ${priority || 'Medium'}

Description:
${description}

Please login to the system to review and respond.`;

      await sendEmail(
        process.env.MANAGER_EMAIL || process.env.EMAIL_USER,
        'New Customer Complaint',
        emailText
      );
    } catch (emailError) {
      console.error('Failed to send complaint notification email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully. A manager will review it soon.',
      complaint,
    });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all complaints (Manager)
// @route   GET /api/complaints
// @access  Private (Manager)
export const getAllComplaints = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const complaints = await Complaint.find(query)
      .populate('customer', 'name email')
      .populate('appointment', 'serviceType date')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get customer's own complaints
// @route   GET /api/complaints/my-complaints
// @access  Private (Customer)
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ customer: req.user._id })
      .populate('appointment', 'serviceType date')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private (Customer - own complaints, Manager - all)
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('appointment', 'serviceType date')
      .populate('resolvedBy', 'name');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check authorization
    const isOwner = complaint.customer._id.toString() === req.user._id.toString();
    const isManager = req.user.role === 'Manager';

    if (!isOwner && !isManager) {
      return res.status(403).json({
        message: 'Not authorized to view this complaint',
      });
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update complaint status/response
// @route   PUT /api/complaints/:id
// @access  Private (Manager)
export const updateComplaint = async (req, res) => {
  try {
    const { status, response, priority } = req.body;

    const complaint = await Complaint.findById(req.params.id)
      .populate('customer', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (status) complaint.status = status;
    if (response) complaint.response = response;
    if (priority) complaint.priority = priority;

    if (status === 'Resolved' || status === 'Closed') {
      complaint.resolvedBy = req.user._id;
      complaint.resolvedAt = new Date();
    }

    await complaint.save();
    await complaint.populate('resolvedBy', 'name');

    // Send email to customer
    if (response || status === 'Resolved' || status === 'Closed') {
      try {
        const emailText = `Dear ${complaint.customer.name},

Your complaint has been updated:

Subject: ${complaint.subject}
Status: ${complaint.status}

${response ? `Manager Response:\n${response}\n\n` : ''}

Thank you for your feedback. If you have any further concerns, please don't hesitate to reach out.

Best regards,
Vehicle Service Center Management`;

        await sendEmail(
          complaint.customer.email,
          'Complaint Update',
          emailText
        );
      } catch (emailError) {
        console.error('Failed to send complaint update email:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      complaint,
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Manager)
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.deleteOne();

    res.json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get complaint statistics
// @route   GET /api/complaints/stats
// @access  Private (Manager)
export const getComplaintStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const open = await Complaint.countDocuments({ status: 'Open' });
    const inReview = await Complaint.countDocuments({ status: 'In Review' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const closed = await Complaint.countDocuments({ status: 'Closed' });

    const byPriority = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        total,
        byStatus: {
          open,
          inReview,
          resolved,
          closed,
        },
        byPriority: byPriority.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error('Error fetching complaint stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};