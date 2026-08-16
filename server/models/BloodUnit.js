const mongoose = require('mongoose');

const bloodUnitSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodDonation',
      required: [true, 'Blood unit must be linked to a donation']
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
    bloodBagId: {
      type: String,
      required: [true, 'Blood bag ID is required'],
      unique: true,
      trim: true
    },
    collectionDate: {
      type: Date,
      required: [true, 'Collection date is required']
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required']
    },
    storageLocation: {
      type: String,
      trim: true,
      default: 'Main Storage'
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'issued', 'expired', 'quarantined', 'discarded'],
      default: 'quarantined'
    },
    issuedTo: {
      type: String,
      trim: true,
      default: null
    },
    issuedDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BloodUnit', bloodUnitSchema);