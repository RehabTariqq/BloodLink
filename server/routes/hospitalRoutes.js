const express = require('express');
const router = express.Router();
const {
  createHospital,
  getHospitals,
  getHospitalById,
  updateHospital
} = require('../controllers/hospitalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('hospitalAdmin', 'superAdmin'), createHospital);
router.get('/', protect, authorize('superAdmin'), getHospitals);
router.get('/:id', protect, getHospitalById);
router.put('/:id', protect, authorize('superAdmin'), updateHospital);

module.exports = router;