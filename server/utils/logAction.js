const AuditLog = require('../models/AuditLog');

const logAction = async (userId, action, targetType, targetId, details) => {
  try {
    await AuditLog.create({ user: userId, action, targetType, targetId, details });
  } catch (error) {
    console.error('Audit log failed:', error.message);
  }
};

module.exports = logAction;