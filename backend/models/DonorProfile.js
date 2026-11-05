const mongoose = require('mongoose');

const DonorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  phone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true
  },
  whatsappNumber: {
    type: String,
    trim: true
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
  state: {
    type: String,
    default: 'Andhra Pradesh'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [80.6480, 16.5062] // Default Vijayawada/Guntur region coordinates
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  lastDonationDate: {
    type: Date,
    default: null
  },
  donationCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: String,
    default: 'Red Cross / General Hospital'
  },
  readyForEmergency: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Member 1 specification: MongoDB geospatial & compound index
DonorProfileSchema.index({ location: '2dsphere' });
DonorProfileSchema.index({ bloodGroup: 1, isAvailable: 1, city: 1 });
DonorProfileSchema.index({ district: 1, bloodGroup: 1 });

// Helper virtual to check eligibility (90-day cooldown)
DonorProfileSchema.virtual('isEligible').get(function() {
  if (!this.lastDonationDate) return true;
  const daysDiff = (Date.now() - new Date(this.lastDonationDate).getTime()) / (1000 * 3600 * 24);
  return daysDiff >= 90;
});

DonorProfileSchema.set('toJSON', { virtuals: true });
DonorProfileSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('DonorProfile', DonorProfileSchema);
