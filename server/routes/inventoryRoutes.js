const express = require('express');
const router = express.Router();
const {
  createBloodUnit,
  getBloodUnits,
  getInventorySummary,
  updateBloodUnit
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const staffOnly = authorize('bloodBankStaff', 'hospitalAdmin', 'superAdmin');

router.post('/', protect, staffOnly, createBloodUnit);
router.get('/', protect, getBloodUnits);
router.get('/summary', protect, getInventorySummary);
router.put('/:id', protect, staffOnly, updateBloodUnit);

module.exports = router;