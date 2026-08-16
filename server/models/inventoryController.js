const BloodUnit = require('../models/BloodUnit');
const BloodDonation = require('../models/BloodDonation');

const createBloodUnit = async (req, res) => {
  try {
    const { donation, storageLocation } = req.body;

    if (!donation) {
      return res.status(400).json({
        status: 'error',
        message: 'Donation ID is required'
      });
    }

    const donationRecord = await BloodDonation.findById(donation);
    if (!donationRecord) {
      return res.status(404).json({
        status: 'error',
        message: 'Donation not found'
      });
    }

    if (donationRecord.screeningStatus !== 'passed') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot create a blood unit from a donation that has not passed screening'
      });
    }

    const existingUnit = await BloodUnit.findOne({ donation });
    if (existingUnit) {
      return res.status(400).json({
        status: 'error',
        message: 'A blood unit already exists for this donation'
      });
    }

    const bloodUnit = await BloodUnit.create({
      donation: donationRecord._id,
      hospital: donationRecord.hospital,
      bloodGroup: donationRecord.bloodGroup,
      bloodBagId: donationRecord.bloodBagId,
      collectionDate: donationRecord.collectionDate,
      expiryDate: donationRecord.expiryDate,
      storageLocation: storageLocation || donationRecord.storageLocation,
      status: 'available'
    });

    donationRecord.donationStatus = 'converted_to_unit';
    await donationRecord.save();

    res.status(201).json({
      status: 'success',
      data: bloodUnit
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

const getBloodUnits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.hospital) filter.hospital = req.query.hospital;

    const units = await BloodUnit.find(filter)
      .populate('donation', 'bloodBagId collectionDate')
      .populate('hospital', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ expiryDate: 1 });

    const total = await BloodUnit.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      count: units.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: units
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getInventorySummary = async (req, res) => {
  try {
    const summary = await BloodUnit.aggregate([
      { $match: { status: 'available' } },
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateBloodUnit = async (req, res) => {
  try {
    const unit = await BloodUnit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({
        status: 'error',
        message: 'Blood unit not found'
      });
    }

    const allowedUpdates = ['status', 'storageLocation', 'issuedTo', 'issuedDate'];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        unit[field] = req.body[field];
      }
    });

    await unit.save();

    res.status(200).json({
      status: 'success',
      data: unit
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = { createBloodUnit, getBloodUnits, getInventorySummary, updateBloodUnit };