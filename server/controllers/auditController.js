const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find()
      .populate('user', 'name role')
      .skip(skip).limit(limit).sort({ createdAt: -1 });

    const total = await AuditLog.countDocuments();
    res.status(200).json({ status: 'success', count: logs.length, total, page, totalPages: Math.ceil(total / limit), data: logs });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getAuditLogs };