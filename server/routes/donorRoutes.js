const express = require('express');
const router = express.Router();
const {
  createDonor,
  getDonors,
  getDonorById,
  updateDonor
} = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createDonor);
router.get('/', protect, getDonors);
router.get('/:id', protect, getDonorById);
router.put('/:id', protect, updateDonor);

module.exports = router;