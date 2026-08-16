const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', default: null },
    slotDate: { type: Date, required: true },
    slotTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'completed', 'cancelled', 'no_show'],
      default: 'pending'
    },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);