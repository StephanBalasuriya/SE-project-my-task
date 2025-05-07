module.exports = function(req, res, next) {
    const email = req.user?.emails?.[0]?.value || req.body.email;
    if (!email || !email.endsWith('@gmail.com')) {
      return res.status(403).json({ message: 'Only Gmail addresses are allowed' });
    }
    next();
  };
// This middleware checks if the email is a Gmail address. If not, it sends a 403 response.  