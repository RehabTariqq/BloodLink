const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
  issueUnitToRequest
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

const requesterRoles = authorize('doctor', 'nurse', 'bloodBankStaff', 'hospitalAdmin', 'superAdmin');
const staffOnly = authorize('bloodBankStaff', 'hospitalAdmin', 'superAdmin');

router.post('/', protect, requesterRoles, createRequest);
router.get('/', protect, requesterRoles, getRequests);
router.get('/:id', protect, requesterRoles, getRequestById);
router.put('/:id', protect, staffOnly, updateRequestStatus);
router.post('/:id/issue', protect, staffOnly, issueUnitToRequest);

module.exports = router;