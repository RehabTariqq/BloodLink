const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('bloodBankStaff', 'hospitalAdmin', 'superAdmin'), getDashboardStats);

module.exports = router;