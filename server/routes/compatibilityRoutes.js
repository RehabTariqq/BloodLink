const express = require('express');
const router = express.Router();
const { getCompatibility } = require('../controllers/compatibilityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:bloodGroup', protect, getCompatibility);

module.exports = router;