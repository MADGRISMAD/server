const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, verifyEmail } = require('../controllers/user.controller');
const validateEduEmail = require('../middlewares/validateEduEmail');
const protect = require('../middlewares/auth');

router.post('/register', validateEduEmail, registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe); 
router.get('/verify/:token', verifyEmail);


module.exports = router;
