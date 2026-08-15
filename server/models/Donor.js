const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor must be linked to a user account']
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, 'Blood group is required']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true, required: [true, 'City is required'] },
      country: { type: String, trim: true, default: 'Pakistan' }
    },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relation: { type: String, trim: true }
    },
    lastDonationDate: {
      type: Date,
      default: null
    },
    eligibilityStatus: {
      type: String,
      enum: ['eligible', 'not_eligible', 'pending_review'],
      default: 'eligible'
    },
    accountStatus: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Donor', donorSchema);