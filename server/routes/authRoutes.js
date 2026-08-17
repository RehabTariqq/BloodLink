const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-password', protect, verifyPassword);

module.exports = router;