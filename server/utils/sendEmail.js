const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  }
});

module.exports = async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Nodemailer error:', error);
    throw error;
  }
};
// This function sends an email using the nodemailer package. It uses Gmail as the service and requires the sender's email and password to be set in environment variables. The function takes the recipient's email, subject, and text as parameters and sends the email.
// It returns a promise that resolves when the email is sent or rejects if there is an error.