const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Request must specify who created it']
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, 'Blood group is required']
    },
    unitsRequired: {
      type: Number,
      required: [true, 'Number of units required'],
      min: [1, 'At least 1 unit is required']
    },
    unitsFulfilled: {
      type: Number,
      default: 0
    },
    urgency: {
      type: String,
      enum: ['routine', 'urgent', 'emergency'],
      default: 'routine'
    },
    department: {
      type: String,
      trim: true
    },
    requiredDate: {
      type: Date,
      required: [true, 'Required date is needed']
    },
    notes: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: [
        'pending',
        'under_review',
        'approved',
        'partially_fulfilled',
        'ready',
        'fulfilled',
        'rejected',
        'cancelled'
      ],
      default: 'pending'
    },
    issuedUnits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodUnit'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);