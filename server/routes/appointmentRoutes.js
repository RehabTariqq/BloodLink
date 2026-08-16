const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createAppointment);
router.get('/', protect, authorize('bloodBankStaff', 'hospitalAdmin', 'superAdmin'), getAppointments);
router.put('/:id', protect, authorize('bloodBankStaff', 'hospitalAdmin', 'superAdmin'), updateAppointment);

module.exports = router;