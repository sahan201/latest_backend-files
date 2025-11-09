import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send SMS using Twilio
 * @param {string} to - Recipient phone number (E.164 format: +94771234567)
 * @param {string} message - SMS message content
 */
export const sendSMS = async (to, message) => {
  try {
    // Validate phone number format
    if (!to.startsWith('+')) {
      throw new Error('Phone number must be in E.164 format (e.g., +94771234567)');
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    console.log(`✅ SMS sent successfully to ${to}`);
    console.log(`Message SID: ${result.sid}`);
    
    return {
      success: true,
      messageSid: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error(`❌ SMS sending failed to ${to}:`, error.message);
    throw error;
  }
};

/**
 * Send inventory order SMS to hardware store
 * @param {string} phoneNumber - Hardware store phone number
 * @param {object} orderDetails - Order details
 */
export const sendInventoryOrderSMS = async (phoneNumber, orderDetails) => {
  const { itemName, currentStock, orderQuantity, unit, orderId, managerName } = orderDetails;

  const message = `🔧 INVENTORY ORDER - Vehicle Service Center

Item: ${itemName}
Current Stock: ${currentStock} ${unit}
Order Quantity: ${orderQuantity} ${unit}
Order ID: #${orderId}

Ordered by: ${managerName}

Please prepare this order for pickup/delivery.

Contact: ${process.env.EMAIL_USER || 'service@vehiclecenter.com'}`;

  return await sendSMS(phoneNumber, message);
};