const Notification = require('../models/Notification');
const BloodDonation = require('../models/BloodDonation');
const Donor = require('../models/Donor');
require('../models/Hospital');

// @desc    Record a new blood donation
// @route   POST /api/donations
// @access  Private (bloodBankStaff, hospitalAdmin, superAdmin)
const createDonation = async (req, res) => {
  try {
    const {
      donor,
      hospital,
      bloodGroup,
      bloodBagId,
      collectionDate,
      expiryDate,
      volumeMl,
      storageLocation,
      notes
    } = req.body;

  if (!donor || !bloodGroup || !bloodBagId || !expiryDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Donor, blood group, blood bag ID, and expiry date are required'
      });
    }

    // Confirm the donor actually exists
    const donorExists = await Donor.findById(donor);
    if (!donorExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Donor not found'
      });
    }

    const donation = await BloodDonation.create({
      donor,
      hospital: hospital || null,
      recordedBy: req.user._id,
      bloodGroup,
      bloodBagId,
      collectionDate,
      expiryDate,
      volumeMl,
      storageLocation,
      notes
    });

    // Update the donor's last donation date
    donorExists.lastDonationDate = donation.collectionDate;
    await donorExists.save();

    res.status(201).json({
      status: 'success',
      data: donation
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'A donation with this blood bag ID already exists'
      });
    }
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all donations (paginated, filterable)
// @route   GET /api/donations
// @access  Private (staff roles only)
const getDonations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

   
    const filter = {};
    if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;
    if (req.query.hospital) filter.hospital = req.query.hospital;
    if (req.query.screeningStatus) filter.screeningStatus = req.query.screeningStatus;
    if (req.query.donationStatus) filter.donationStatus = req.query.donationStatus;
    if (req.query.donor) filter.donor = req.query.donor;

    const donations = await BloodDonation.find(filter)
      .populate({ path: 'donor', populate: { path: 'user', select: 'name email' } })
      .populate('hospital', 'name')
      .populate('recordedBy', 'name role')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await BloodDonation.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      count: donations.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: donations
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Private
const getDonationById = async (req, res) => {
  try {
    const donation = await BloodDonation.findById(req.params.id)
      .populate({ path: 'donor', populate: { path: 'user', select: 'name email' } })
      .populate('hospital', 'name')
      .populate('recordedBy', 'name role');

    if (!donation) {
      return res.status(404).json({
        status: 'error',
        message: 'Donation not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update donation (mainly for screening status updates)
// @route   PUT /api/donations/:id
// @access  Private (staff roles only)
const updateDonation = async (req, res) => {
  try {
    const donation = await BloodDonation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        status: 'error',
        message: 'Donation not found'
      });
    }

    const allowedUpdates = [
      'screeningStatus',
      'donationStatus',
      'storageLocation',
      'notes',
      'expiryDate'
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        donation[field] = req.body[field];
      }
    });

    await donation.save();
if (req.body.screeningStatus) {
      const populatedDonor = await require('../models/Donor').findById(donation.donor);
      if (populatedDonor?.user) {
        await Notification.create({
          user: populatedDonor.user,
          type: 'system',
          title: 'Donation Screening Update',
          message: `Your donation (Bag ${donation.bloodBagId}) screening result: ${req.body.screeningStatus}.`
        });
      }
    }
    res.status(200).json({
      status: 'success',
      data: donation
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = { createDonation, getDonations, getDonationById, updateDonation };
