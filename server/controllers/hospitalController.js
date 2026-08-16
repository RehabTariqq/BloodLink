const Hospital = require('../models/Hospital');

// @desc    Register a new hospital
// @route   POST /api/hospitals
// @access  Private (hospitalAdmin, superAdmin)
const createHospital = async (req, res) => {
  try {
    const { name, registrationNumber, email, phone, address } = req.body;

    if (!name || !registrationNumber || !email || !phone || !address?.city) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, registration number, email, phone, and city are required'
      });
    }

    const existing = await Hospital.findOne({
      $or: [{ email }, { registrationNumber }]
    });

    if (existing) {
      return res.status(400).json({
        status: 'error',
        message: 'A hospital with this email or registration number already exists'
      });
    }

    const hospital = await Hospital.create({
      name,
      registrationNumber,
      email,
      phone,
      address
    });

    // Link the creating user to this new hospital
    req.user.hospital = hospital._id;
    await req.user.save();

    res.status(201).json({
      status: 'success',
      data: hospital
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Private (superAdmin only, to approve/manage)
const getHospitals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const hospitals = await Hospital.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Hospital.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      count: hospitals.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: hospitals
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single hospital by ID
// @route   GET /api/hospitals/:id
// @access  Private
const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        status: 'error',
        message: 'Hospital not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: hospital
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update hospital status (approve/suspend) or details
// @route   PUT /api/hospitals/:id
// @access  Private (superAdmin only)
const updateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        status: 'error',
        message: 'Hospital not found'
      });
    }

    const allowedUpdates = ['name', 'phone', 'address', 'status', 'licenseDocumentUrl'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        hospital[field] = req.body[field];
      }
    });

    await hospital.save();

    res.status(200).json({
      status: 'success',
      data: hospital
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = { createHospital, getHospitals, getHospitalById, updateHospital };