import PDFDocument from 'pdfkit';
import Appointment from '../models/Appointment.js';
import Inventory from '../models/Inventory.js';
import Feedback from '../models/Feedback.js';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';

// @desc    Generate business report PDF
// @route   GET /api/reports/business-report
// @access  Private (Manager)
export const generateBusinessReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Fetch data
    const appointments = await Appointment.find(dateFilter)
      .populate('customer', 'name email')
      .populate('vehicle', 'make model vehicleNo')
      .populate('assignedMechanic', 'name');

    const completedAppointments = appointments.filter(a => a.status === 'Completed');
    
    // Calculate revenue
    const totalRevenue = completedAppointments.reduce((sum, apt) => {
      return sum + (apt.finalCost || 0);
    }, 0);

    const totalPartsRevenue = completedAppointments.reduce((sum, apt) => {
      const partsTotal = apt.partsUsed.reduce((pSum, part) => {
        return pSum + (part.quantity * part.salePrice);
      }, 0);
      return sum + partsTotal;
    }, 0);

    const totalLaborRevenue = completedAppointments.reduce((sum, apt) => {
      const laborTotal = apt.laborItems.reduce((lSum, labor) => {
        return lSum + labor.cost;
      }, 0);
      return sum + laborTotal;
    }, 0);

    // Get statistics
    const totalAppointments = appointments.length;
    const completedCount = completedAppointments.length;
    const cancelledCount = appointments.filter(a => a.status === 'Cancelled').length;
    const inProgressCount = appointments.filter(a => a.status === 'In Progress').length;

    // Service type breakdown
    const serviceTypes = {};
    appointments.forEach(apt => {
      serviceTypes[apt.serviceType] = (serviceTypes[apt.serviceType] || 0) + 1;
    });

    // Inventory status
    const inventory = await Inventory.find();
    const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockThreshold);
    const totalInventoryValue = inventory.reduce((sum, item) => {
      return sum + (item.quantity * item.costPrice);
    }, 0);

    // Feedback stats
    const feedbacks = await Feedback.find(dateFilter);
    const avgRating = feedbacks.length > 0
      ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length
      : 0;

    // Complaints stats
    const complaints = await Complaint.find(dateFilter);
    const openComplaints = complaints.filter(c => c.status === 'Open').length;

    // Generate PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=business-report-${Date.now()}.pdf`);
    
    doc.pipe(res);

    // Title
    doc.fontSize(24).font('Helvetica-Bold').text('Business Report', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('Vehicle Service Center', { align: 'center' });
    
    if (startDate && endDate) {
      doc.text(`Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`, { align: 'center' });
    } else {
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    }
    
    doc.moveDown(2);

    // Revenue Section
    doc.fontSize(16).font('Helvetica-Bold').text('Financial Summary');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`);
    doc.text(`Parts Revenue: $${totalPartsRevenue.toFixed(2)}`);
    doc.text(`Labor Revenue: $${totalLaborRevenue.toFixed(2)}`);
    doc.text(`Inventory Value: $${totalInventoryValue.toFixed(2)}`);
    doc.moveDown();

    // Appointments Section
    doc.fontSize(16).font('Helvetica-Bold').text('Appointment Statistics');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total Appointments: ${totalAppointments}`);
    doc.text(`Completed: ${completedCount}`);
    doc.text(`In Progress: ${inProgressCount}`);
    doc.text(`Cancelled: ${cancelledCount}`);
    doc.text(`Completion Rate: ${totalAppointments > 0 ? ((completedCount / totalAppointments) * 100).toFixed(1) : 0}%`);
    doc.moveDown();

    // Service Types
    doc.fontSize(16).font('Helvetica-Bold').text('Popular Services');
    doc.fontSize(11).font('Helvetica');
    Object.entries(serviceTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([service, count]) => {
        doc.text(`${service}: ${count} bookings`);
      });
    doc.moveDown();

    // Inventory Status
    doc.fontSize(16).font('Helvetica-Bold').text('Inventory Status');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total Items: ${inventory.length}`);
    doc.text(`Low Stock Items: ${lowStockItems.length}`);
    if (lowStockItems.length > 0) {
      doc.text('Items needing restock:');
      lowStockItems.forEach(item => {
        doc.text(`  • ${item.name}: ${item.quantity} ${item.unit} remaining`, { indent: 20 });
      });
    }
    doc.moveDown();

    // Customer Satisfaction
    doc.fontSize(16).font('Helvetica-Bold').text('Customer Satisfaction');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Average Rating: ${avgRating.toFixed(2)}/5.0 (${feedbacks.length} reviews)`);
    doc.text(`Total Complaints: ${complaints.length}`);
    doc.text(`Open Complaints: ${openComplaints}`);
    doc.moveDown(2);

    // Top Performing Mechanics (if applicable)
    if (completedAppointments.length > 0) {
      const mechanicStats = {};
      completedAppointments.forEach(apt => {
        if (apt.assignedMechanic) {
          const mechId = apt.assignedMechanic._id.toString();
          if (!mechanicStats[mechId]) {
            mechanicStats[mechId] = {
              name: apt.assignedMechanic.name,
              count: 0,
              revenue: 0,
            };
          }
          mechanicStats[mechId].count++;
          mechanicStats[mechId].revenue += apt.finalCost || 0;
        }
      });

      doc.fontSize(16).font('Helvetica-Bold').text('Top Performing Mechanics');
      doc.fontSize(11).font('Helvetica');
      Object.values(mechanicStats)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .forEach(mech => {
          doc.text(`${mech.name}: ${mech.count} jobs completed, $${mech.revenue.toFixed(2)} revenue`);
        });
    }

    doc.end();
  } catch (error) {
    console.error('Error generating business report:', error);
    res.status(500).json({ message: 'Server error generating report' });
  }
};

// @desc    Get booking statistics
// @route   GET /api/reports/booking-stats
// @access  Private (Manager)
export const getBookingStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    if (period === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const appointments = await Appointment.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const stats = {
      total: appointments.length,
      completed: appointments.filter(a => a.status === 'Completed').length,
      cancelled: appointments.filter(a => a.status === 'Cancelled').length,
      inProgress: appointments.filter(a => a.status === 'In Progress').length,
      scheduled: appointments.filter(a => a.status === 'Scheduled').length,
      revenue: appointments
        .filter(a => a.status === 'Completed')
        .reduce((sum, apt) => sum + (apt.finalCost || 0), 0),
    };

    res.json({
      success: true,
      period,
      stats,
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get revenue report
// @route   GET /api/reports/revenue
// @access  Private (Manager)
export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = { status: 'Completed' };
    if (startDate && endDate) {
      dateFilter.finishedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const completedAppointments = await Appointment.find(dateFilter);

    const dailyRevenue = {};
    
    completedAppointments.forEach(apt => {
      const date = apt.finishedAt.toISOString().split('T')[0];
      if (!dailyRevenue[date]) {
        dailyRevenue[date] = 0;
      }
      dailyRevenue[date] += apt.finalCost || 0;
    });

    const totalRevenue = Object.values(dailyRevenue).reduce((sum, val) => sum + val, 0);

    res.json({
      success: true,
      totalRevenue,
      dailyRevenue,
      appointmentCount: completedAppointments.length,
    });
  } catch (error) {
    console.error('Error fetching revenue report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get inventory report
// @route   GET /api/reports/inventory
// @access  Private (Manager)
export const getInventoryReport = async (req, res) => {
  try {
    const inventory = await Inventory.find();

    const totalValue = inventory.reduce((sum, item) => {
      return sum + (item.quantity * item.costPrice);
    }, 0);

    const totalSaleValue = inventory.reduce((sum, item) => {
      return sum + (item.quantity * item.salePrice);
    }, 0);

    const lowStock = inventory.filter(item => item.quantity <= item.lowStockThreshold);

    const stats = {
      totalItems: inventory.length,
      totalCostValue: totalValue,
      totalSaleValue: totalSaleValue,
      potentialProfit: totalSaleValue - totalValue,
      lowStockCount: lowStock.length,
      lowStockItems: lowStock.map(item => ({
        name: item.name,
        quantity: item.quantity,
        threshold: item.lowStockThreshold,
      })),
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching inventory report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};