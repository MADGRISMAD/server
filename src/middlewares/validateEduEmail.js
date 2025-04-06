module.exports = (req, res, next) => {
    const { email } = req.body;
    const eduRegex = /^[^\s@]+@[^\s@]+\.edu$/;
  
    if (!eduRegex.test(email)) {
      return res.status(400).json({ message: 'Solo se aceptan correos .edu' });
    }
  
    next();
  };
  