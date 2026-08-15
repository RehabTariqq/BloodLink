const mongoose = require('mongoose');

const bloodDonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: [true, 'Donation must be linked to a donor']
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donation must record which staff member logged it']
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
      required: [true, 'Collection date is required'],
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required']
    },
    volumeMl: {
      type: Number,
      default: 450
    },
    screeningStatus: {
      type: String,
      enum: ['pending', 'passed', 'failed'],
      default: 'pending'
    },
    storageLocation: {
      type: String,
      trim: true,
      default: 'Main Storage'
    },
    donationStatus: {
      type: String,
      enum: ['collected', 'processed', 'converted_to_unit', 'discarded'],
      default: 'collected'
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BloodDonation', bloodDonationSchema);