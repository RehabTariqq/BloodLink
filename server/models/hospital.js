const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Hospital email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true, required: [true, 'City is required'] },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: 'Pakistan' },
      postalCode: { type: String, trim: true }
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'pending'
    },
    licenseDocumentUrl: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Hospital', hospitalSchema);