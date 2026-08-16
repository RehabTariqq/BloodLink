const Appointment = require('../models/Appointment');

const createAppointment = async (req, res) => {
  try {
    const { donor, slotDate, slotTime, hospital, notes } = req.body;
    if (!donor || !slotDate || !slotTime) {
      return res.status(400).json({ status: 'error', message: 'Donor, slotDate, and slotTime are required' });
    }
    const appointment = await Appointment.create({ donor, slotDate, slotTime, hospital: hospital || null, notes });
    res.status(201).json({ status: 'success', data: appointment });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter)
      .populate({ path: 'donor', populate: { path: 'user', select: 'name email' } })
      .skip(skip).limit(limit).sort({ slotDate: 1 });

    const total = await Appointment.countDocuments(filter);
    res.status(200).json({ status: 'success', count: appointments.length, total, page, totalPages: Math.ceil(total / limit), data: appointments });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ status: 'error', message: 'Appointment not found' });

    const allowed = ['status', 'slotDate', 'slotTime', 'notes'];
    allowed.forEach((f) => { if (req.body[f] !== undefined) appointment[f] = req.body[f]; });
    await appointment.save();

    res.status(200).json({ status: 'success', data: appointment });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

module.exports = { createAppointment, getAppointments, updateAppointment };