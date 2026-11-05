const mongoose = require('mongoose');

const DonationHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  recordType: {
    type: String,
    enum: ['blood_donation', 'equipment_borrowed', 'equipment_lent'],
    required: true
  },
  // Blood donation details
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  unitsGiven: {
    type: Number,
    default: 1
  },
  hospitalOrCamp: {
    type: String,
    required: true
  },
  recipientPatient: {
    type: String,
    default: 'Emergency Case'
  },
  donationDate: {
    type: Date,
    default: Date.now
  },
  nextEligibleDate: {
    type: Date
  },
  // Equipment loan details
  equipmentTitle: {
    type: String
  },
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  },
  borrowedDate: {
    type: Date
  },
  expectedReturnDate: {
    type: Date
  },
  actualReturnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['COMPLETED', 'ACTIVE_LOAN', 'OVERDUE', 'RETURNED'],
    default: 'COMPLETED'
  },
  verifiedByHospital: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

DonationHistorySchema.index({ user: 1, donationDate: -1 });

module.exports = mongoose.model('DonationHistory', DonationHistorySchema);
