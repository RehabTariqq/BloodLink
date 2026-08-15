const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const staffOnly = authorize('bloodBankStaff', 'hospitalAdmin', 'superAdmin');

router.post('/', protect, staffOnly, createDonation);
router.get('/', protect, staffOnly, getDonations);
router.get('/:id', protect, staffOnly, getDonationById);
router.put('/:id', protect, staffOnly, updateDonation);

module.exports = router;