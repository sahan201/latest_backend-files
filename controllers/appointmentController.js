import Appointment from '../models/Appointment.js';
import Vehicle from '../models/Vehicle.js';
import { checkOffPeakDay } from '../utils/checkOffPeak.js';
import { sendEmail } from '../utils/sendEmail.js';
import { generateBookingConfirmationPDF } from '../utils/pdfGenerator.js';

/**
 * @desc    Create a new appointment
 * @route   POST /api/appointments
 * @access  Private (Customer)
 */
export const createAppointment = async (req, res) => {
  try {
    const { vehicleId, serviceType, date, time } = req.body;
    const customerId = req.user._id;

    // Validation
    if (!vehicleId || !serviceType || !date || !time) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: vehicleId, serviceType, date, time' 
      });
    }

    // Verify the vehicle belongs to the customer
    const vehicle = await Vehicle.findOne({ 
      _id: vehicleId, 
      customer: customerId 
    });

    if (!vehicle) {
      return res.status(404).json({ 
        message: 'Vehicle not found or does not belong to you' 
      });
    }

    // Check for slot conflicts
    const existingAppointment = await Appointment.findOne({ 
      date, 
      time, 
      status: { $ne: 'Cancelled' } 
    });

    if (existingAppointment) {
      return res.status(409).json({ 
        message: 'This time slot is already booked. Please choose another time.' 
      });
    }

    // Check for off-peak discount eligibility
    const isDiscountEligible = await checkOffPeakDay(date);

    // Create the appointment
    const appointment = new Appointment({
      customer: customerId,
      vehicle: vehicleId,
      serviceType,
      date,
      time,
      discountEligible: isDiscountEligible,
      status: 'Scheduled',
    });

    const savedAppointment = await appointment.save();

    // Populate for email
    await savedAppointment.populate('customer', 'name email');
    await savedAppointment.populate('vehicle', 'make model vehicleNo');

    // Generate PDF and send confirmation email
    try {
      const pdfBuffer = await generateBookingConfirmationPDF(
        savedAppointment, 
        req.user, 
        vehicle
      );

      const emailText = `Dear ${req.user.name},

Your service appointment has been confirmed!

Details:
- Vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.vehicleNo})
- Service: ${serviceType}
- Date: ${date}
- Time: ${time}
- Booking ID: ${savedAppointment._id}
${isDiscountEligible ? '\n🎉 Special Offer: 5% off-peak discount applied!' : ''}

Please find your booking confirmation attached.

Thank you for choosing our service center!`;

      await sendEmail(
        req.user.email,
        'Service Appointment Confirmed',
        emailText,
        [{
          filename: `booking-${savedAppointment._id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }]
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment: savedAppointment,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error while creating appointment' });
  }
};

/**
 * @desc    Get all appointments for the logged-in customer
 * @route   GET /api/appointments/my-appointments
 * @access  Private (Customer)
 */
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ customer: req.user._id })
      .populate('vehicle', 'make model vehicleNo')
      .populate('assignedMechanic', 'name email')
      .sort({ date: -1, time: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get a single appointment by ID
 * @route   GET /api/appointments/:id
 * @access  Private (Customer, Manager, Mechanic)
 */
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('vehicle', 'make model vehicleNo')
      .populate('assignedMechanic', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    const isCustomer = appointment.customer._id.toString() === req.user._id.toString();
    const isMechanic = appointment.assignedMechanic && 
                       appointment.assignedMechanic._id.toString() === req.user._id.toString();
    const isManager = req.user.role === 'Manager';

    if (!isCustomer && !isMechanic && !isManager) {
      return res.status(403).json({ 
        message: 'Not authorized to view this appointment' 
      });
    }

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all appointments (for Manager/Mechanic view)
 * @route   GET /api/appointments
 * @access  Private (Manager, Mechanic)
 */
export const getAllAppointments = async (req, res) => {
  try {
    let query = {};

    // If mechanic, only show their assigned appointments
    if (req.user.role === 'Mechanic') {
      query.assignedMechanic = req.user._id;
    }

    const appointments = await Appointment.find(query)
      .populate('customer', 'name email')
      .populate('vehicle', 'make model vehicleNo')
      .populate('assignedMechanic', 'name email')
      .sort({ date: -1, time: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Cancel an appointment
 * @route   PUT /api/appointments/:id/cancel
 * @access  Private (Customer)
 */
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Security check: Ensure the appointment belongs to the user
    if (appointment.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to cancel this appointment' 
      });
    }

    // Check if appointment can be cancelled
    if (appointment.status === 'Completed') {
      return res.status(400).json({ 
        message: 'Cannot cancel a completed appointment' 
      });
    }

    if (appointment.status === 'Cancelled') {
      return res.status(400).json({ 
        message: 'Appointment is already cancelled' 
      });
    }

    if (appointment.status === 'In Progress') {
      return res.status(400).json({ 
        message: 'Cannot cancel an appointment that is in progress' 
      });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.json({ 
      success: true,
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
