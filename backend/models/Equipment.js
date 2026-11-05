const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  ownerName: {
    type: String,
    required: [true, 'Owner/Center name is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Equipment title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'oxygen_concentrator',
      'wheelchair',
      'cpap_bipap',
      'hospital_bed',
      'suction_machine',
      'nebulizer',
      'pulse_oximeter',
      'other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  condition: {
    type: String,
    enum: ['Brand New', 'Sanitized & Certified', 'Gently Used', 'Good Working Condition'],
    default: 'Sanitized & Certified'
  },
  rentalRatePerDay: {
    type: Number,
    default: 0
  },
  rentalRatePerMonth: {
    type: Number,
    default: 0
  },
  securityDeposit: {
    type: Number,
    default: 0
  },
  rentalTerms: {
    type: String,
    default: 'Valid Government ID required. Free emergency support for underprivileged patients.'
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'rented', 'maintenance'],
    default: 'available'
  },
  isFreeEmergency: {
    type: Boolean,
    default: false
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [80.6480, 16.5062]
    }
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required']
  },
  whatsappNumber: {
    type: String
  },
  reservedBy: {
    type: String,
    default: null
  },
  reservedUntil: {
    type: Date,
    default: null
  },
  expectedReturnDate: {
    type: Date,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  verifiedBy: {
    type: String,
    default: 'Community Diagnostic Center'
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

EquipmentSchema.index({ location: '2dsphere' });
EquipmentSchema.index({ category: 1, status: 1, city: 1 });
EquipmentSchema.index({ district: 1, status: 1 });

module.exports = mongoose.model('Equipment', EquipmentSchema);
