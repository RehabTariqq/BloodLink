const Notification = require('../models/Notification');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', count: notifications.length, data: notifications });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ status: 'error', message: 'Notification not found' });
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'error', message: 'Not authorized' });
    }
    notification.read = true;
    await notification.save();
    res.status(200).json({ status: 'success', data: notification });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

module.exports = { getMyNotifications, markAsRead };