const Donor = require('../models/Donor');

// @desc    Create a new donor profile
// @route   POST /api/donors
// @access  Private (donor themself, or staff)
const createDonor = async (req, res) => {
  try {
    const { bloodGroup, dateOfBirth, address, emergencyContact, hospital } = req.body;

    if (!bloodGroup || !dateOfBirth || !address || !address.city) {
      return res.status(400).json({
        status: 'error',
        message: 'Blood group, date of birth, and city are required'
      });
    }

    // Check if a donor profile already exists for this user
    const existingDonor = await Donor.findOne({ user: req.user._id });
    if (existingDonor) {
      return res.status(400).json({
        status: 'error',
        message: 'A donor profile already exists for this user'
      });
    }

    const donor = await Donor.create({
      user: req.user._id,
      hospital: hospital || null,
      bloodGroup,
      dateOfBirth,
      address,
      emergencyContact
    });

    res.status(201).json({
      status: 'success',
      data: donor
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all donors (with basic pagination)
// @route   GET /api/donors
// @access  Private (staff roles only)
const getDonors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.bloodGroup) {
      filter.bloodGroup = req.query.bloodGroup;
    }
    if (req.query.hospital) {
      filter.hospital = req.query.hospital;
    }

    const donors = await Donor.find(filter)
      .populate('user', 'name email phone')
      .populate('hospital', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Donor.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      count: donors.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: donors
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single donor by ID
// @route   GET /api/donors/:id
// @access  Private
const getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('hospital', 'name');

    if (!donor) {
      return res.status(404).json({
        status: 'error',
        message: 'Donor not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: donor
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update donor profile
// @route   PUT /api/donors/:id
// @access  Private
const updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        status: 'error',
        message: 'Donor not found'
      });
    }

    const allowedUpdates = [
      'bloodGroup',
      'address',
      'emergencyContact',
      'eligibilityStatus',
      'accountStatus',
      'lastDonationDate',
      'hospital'
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        donor[field] = req.body[field];
      }
    });

    await donor.save();

    res.status(200).json({
      status: 'success',
      data: donor
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = { createDonor, getDonors, getDonorById, updateDonor };