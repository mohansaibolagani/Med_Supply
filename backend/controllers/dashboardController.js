const DonationHistory = require('../models/DonationHistory');
const Equipment = require('../models/Equipment');
const EmergencyRequest = require('../models/EmergencyRequest');
const DonorProfile = require('../models/DonorProfile');
const mockStore = require('../data/mockStore');
const { getDBStatus } = require('../config/db');

// @desc    Get dashboard tracking data (past donations, equipment return dates, verified donor history)
// @route   GET /api/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const donationHistory = await DonationHistory.find().sort({ donationDate: -1 });
      const activeLoans = await Equipment.find({ status: { $in: ['rented', 'reserved'] } });
      const activeRequests = await EmergencyRequest.countDocuments({ status: 'ACTIVE' });
      const criticalCases = await EmergencyRequest.countDocuments({ status: 'ACTIVE', urgencyLevel: 'CRITICAL' });
      const availableEquipment = await Equipment.countDocuments({ status: 'available' });
      const readyDonors = await DonorProfile.countDocuments({ isAvailable: true });

      return res.json({
        success: true,
        dataSource: 'MongoDB',
        data: {
          donationHistory,
          activeLoans,
          summaryStats: {
            totalDonations: donationHistory.filter(d => d.recordType === 'blood_donation').length,
            activeRequests,
            criticalCases,
            availableEquipment,
            readyDonors
          }
        }
      });
    } else {
      const data = mockStore.getDashboardData();
      return res.json({
        success: true,
        dataSource: 'In-Memory Store',
        data
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Log a new past donation or equipment record
// @route   POST /api/dashboard/donations
exports.recordDonation = async (req, res, next) => {
  try {
    const {
      recordType,
      bloodGroup,
      unitsGiven,
      hospitalOrCamp,
      recipientPatient,
      donationDate,
      equipmentTitle,
      expectedReturnDate,
      notes
    } = req.body;

    const payload = {
      recordType: recordType || 'blood_donation',
      bloodGroup,
      unitsGiven: unitsGiven || 1,
      hospitalOrCamp: hospitalOrCamp || 'Community Blood Center',
      recipientPatient: recipientPatient || 'Emergency ICU Patient',
      donationDate: donationDate || new Date(),
      equipmentTitle,
      expectedReturnDate,
      status: recordType === 'equipment_lent' ? 'ACTIVE_LOAN' : 'COMPLETED',
      verifiedByHospital: true,
      notes: notes || '',
      user: req.user ? req.user._id : null
    };

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const record = await DonationHistory.create(payload);
      return res.status(201).json({ success: true, message: 'Record added to dashboard history.', data: record });
    } else {
      const record = mockStore.addDonationRecord(payload);
      return res.status(201).json({ success: true, message: 'Record added to dashboard history.', data: record });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Mark equipment as returned
// @route   PATCH /api/dashboard/equipment/:id/return
exports.returnEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const eq = await Equipment.findByIdAndUpdate(
        id,
        {
          status: 'available',
          reservedBy: null,
          expectedReturnDate: null
        },
        { new: true }
      );
      if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found.' });
      return res.json({ success: true, message: 'Equipment marked as RETURNED and now AVAILABLE for next patient.', data: eq });
    } else {
      const eq = mockStore.toggleEquipmentStatus(id, 'available', { reservedBy: null, expectedReturnDate: null });
      if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found.' });
      return res.json({ success: true, message: 'Equipment marked as RETURNED and now AVAILABLE for next patient.', data: eq });
    }
  } catch (error) {
    next(error);
  }
};
