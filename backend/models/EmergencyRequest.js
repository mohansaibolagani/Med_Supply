const mongoose = require('mongoose');

const EmergencyRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  requestType: {
    type: String,
    enum: ['blood', 'equipment'],
    required: [true, 'Request type is required']
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  hospitalName: {
    type: String,
    required: [true, 'Hospital/Diagnostic Center name is required'],
    trim: true
  },
  doctorInCharge: {
    type: String,
    default: ''
  },
  // For blood requests
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
    default: null
  },
  unitsRequired: {
    type: Number,
    default: 1
  },
  // For equipment requests
  equipmentCategory: {
    type: String,
    default: null
  },
  urgencyLevel: {
    type: String,
    enum: ['CRITICAL', 'HIGH', 'MODERATE'],
    default: 'HIGH'
  },
  requiredWithinHours: {
    type: Number,
    default: 4
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
  hospitalAddress: {
    type: String,
    default: ''
  },
  attendantName: {
    type: String,
    required: [true, 'Attendant name is required']
  },
  attendantPhone: {
    type: String,
    required: [true, 'Attendant contact phone is required']
  },
  whatsappNumber: {
    type: String,
    required: [true, 'WhatsApp contact number is required']
  },
  verificationStatus: {
    type: String,
    enum: ['VERIFIED_HOSPITAL', 'COMMUNITY_VERIFIED', 'PENDING_VERIFICATION'],
    default: 'PENDING_VERIFICATION'
  },
  verifiedBy: {
    type: String,
    default: ''
  },
  verificationNotes: {
    type: String,
    default: ''
  },
  medicalSummary: {
    type: String,
    required: [true, 'Brief medical situation summary is required']
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'FULFILLED', 'EXPIRED'],
    default: 'ACTIVE'
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  responsesCount: {
    type: Number,
    default: 0
  },
  whatsappBroadcastSent: {
    type: Boolean,
    default: false
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [80.6480, 16.5062]
    }
  }
}, { timestamps: true });

EmergencyRequestSchema.index({ location: '2dsphere' });
EmergencyRequestSchema.index({ status: 1, urgencyLevel: 1, createdAt: -1 });
EmergencyRequestSchema.index({ city: 1, bloodGroup: 1 });
EmergencyRequestSchema.index({ district: 1, requestType: 1 });

module.exports = mongoose.model('EmergencyRequest', EmergencyRequestSchema);
