import fs from 'fs';
import PDFDocument from 'pdfkit';

/**
 * Generates a booking confirmation PDF
 */
export const generateBookingConfirmationPDF = async (appointment, user, vehicle) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('Vehicle Service Center', { align: 'center' });
      doc
        .fontSize(10)
        .font('Helvetica')
        .text('Booking Confirmation', { align: 'center' })
        .moveDown(2);

      // Booking Info
      doc.fontSize(12).font('Helvetica-Bold').text('Booking Details');
      doc.fontSize(10).font('Helvetica');
      doc.text(`Booking ID: ${appointment._id}`);
      doc.text(`Customer: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.vehicleNo})`);
      doc.text(`Service Type: ${appointment.serviceType}`);
      doc.text(`Date: ${appointment.date}`);
      doc.text(`Time: ${appointment.time}`);
      doc.text(`Status: ${appointment.status}`);
      
      if (appointment.discountEligible) {
        doc.moveDown();
        doc.font('Helvetica-Bold').text('Special Offer: 5% Off-Peak Discount Applied!', { color: 'green' });
      }

      doc.moveDown(2);
      doc.fontSize(10).font('Helvetica-Oblique');
      doc.text('Thank you for choosing our service!', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generates a final invoice PDF
 */
export const generateFinalInvoicePDF = async (appointment) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('Vehicle Service Center', { align: 'center' });
      doc
        .fontSize(16)
        .text('INVOICE', { align: 'center' })
        .moveDown(2);

      // Invoice Info
      doc.fontSize(10).font('Helvetica');
      doc.text(`Invoice #: ${appointment._id}`);
      doc.text(`Date: ${new Date(appointment.finishedAt).toLocaleDateString()}`);
      doc.text(`Customer: ${appointment.customer.name}`);
      doc.text(`Vehicle: ${appointment.vehicle.make} ${appointment.vehicle.model} (${appointment.vehicle.vehicleNo})`);
      doc.moveDown(2);

      // Parts Used
      if (appointment.partsUsed && appointment.partsUsed.length > 0) {
        doc.font('Helvetica-Bold').text('Parts Used:');
        doc.font('Helvetica');
        appointment.partsUsed.forEach(part => {
          doc.text(`  ${part.name} x${part.quantity} - $${(part.salePrice * part.quantity).toFixed(2)}`);
        });
        doc.moveDown();
      }

      // Labor Items
      if (appointment.laborItems && appointment.laborItems.length > 0) {
        doc.font('Helvetica-Bold').text('Labor Charges:');
        doc.font('Helvetica');
        appointment.laborItems.forEach(labor => {
          doc.text(`  ${labor.description} - $${labor.cost.toFixed(2)}`);
        });
        doc.moveDown();
      }

      // Totals
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      
      doc.font('Helvetica-Bold');
      doc.text(`Subtotal: $${appointment.subtotal.toFixed(2)}`, { align: 'right' });
      
      if (appointment.discountEligible) {
        const discount = appointment.subtotal * 0.05;
        doc.text(`Discount (5%): -$${discount.toFixed(2)}`, { align: 'right' });
      }
      
      doc.fontSize(14).text(`TOTAL: $${appointment.finalCost.toFixed(2)}`, { align: 'right' });
      
      doc.moveDown(2);
      doc.fontSize(10).font('Helvetica-Oblique');
      doc.text('Thank you for your business!', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
