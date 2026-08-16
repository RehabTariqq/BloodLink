const BloodDonation = require('../models/BloodDonation');
const BloodUnit = require('../models/BloodUnit');
const BloodRequest = require('../models/BloodRequest');

const getDashboardStats = async (req, res) => {
  try {
    const totalDonors = await require('../models/Donor').countDocuments();
    const availableUnits = await BloodUnit.countDocuments({ status: 'available' });
    const expiringSoon = await BloodUnit.countDocuments({
      status: 'available',
      expiryDate: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });
    const pendingRequests = await BloodRequest.countDocuments({ status: 'pending' });
    const emergencyRequests = await BloodRequest.countDocuments({ urgency: 'emergency', status: { $ne: 'fulfilled' } });
    const donationsThisMonth = await BloodDonation.countDocuments({
      collectionDate: { $gte: new Date(new Date().setDate(1)) }
    });

    res.status(200).json({
      status: 'success',
      data: { totalDonors, availableUnits, expiringSoon, pendingRequests, emergencyRequests, donationsThisMonth }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getDashboardStats };