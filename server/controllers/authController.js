const sendEmail = require('../utils/sendEmail');

exports.manualLogin = async (req, res) => {
  const { email } = req.body;

  if (!email.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Only Gmail addresses are allowed' });
  }

  try {
    await sendEmail(email, 'Login Notification', `Login detected at ${new Date().toLocaleString()}`);
    res.json({ message: 'Login successful and email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send email' });
  }
};

exports.googleCallback = async (req, res) => {
  const email = req.user?.emails[0]?.value;

  if (!email.endsWith('@gmail.com')) {
    return res.status(403).send('Only Gmail is allowed');
  }

  try {
    await sendEmail(email, 'Google Login', `Google login detected at ${new Date().toLocaleString()}`);
  } catch (e) {
    console.error('Email send failed:', e);
  }

  res.redirect('http://localhost:3000/success');
};
