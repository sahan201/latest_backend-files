import transporter from '../config/mail.js';

export const sendEmail = async (to, subject, text, attachments = []) => {
  try {
    const mailOptions = {
      from: `"Vehicle Service Center" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      attachments: attachments,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
};
