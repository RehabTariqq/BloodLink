const express = require('express');
const router = express.Router();
const {
  createDonor,
  getDonors,
  getDonorById,
  updateDonor,
  deleteDonor
} = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/authMiddleware');

const staffOnly = authorize('bloodBankStaff', 'hospitalAdmin', 'superAdmin');

router.post('/', protect, createDonor);
router.get('/', protect, getDonors);
router.get('/:id', protect, getDonorById);
router.put('/:id', protect, updateDonor);
router.delete('/:id', protect, staffOnly, deleteDonor);

module.exports = router;