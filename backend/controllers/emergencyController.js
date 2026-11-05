const EmergencyRequest = require('../models/EmergencyRequest');
const DonorProfile = require('../models/DonorProfile');
const mockStore = require('../data/mockStore');
const whatsappService = require('../services/whatsappService');
const { getDBStatus } = require('../config/db');

// @desc    Get live emergency feed with urgency and location filters
// @route   GET /api/emergency
exports.getEmergencyFeed = async (req, res, next) => {
  try {
    const { status = 'ACTIVE', urgencyLevel, requestType, bloodGroup, city, district } = req.query;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const query = {};

      if (status && status !== 'all') {
        query.status = status;
      }

      if (urgencyLevel && urgencyLevel !== 'all') {
        query.urgencyLevel = urgencyLevel;
      }

      if (requestType && requestType !== 'all') {
        query.requestType = requestType;
      }

      if (bloodGroup && bloodGroup !== 'all') {
        query.bloodGroup = bloodGroup.toUpperCase();
      }

      if (city) {
        query.city = { $regex: city, $options: 'i' };
      }

      if (district) {
        query.district = { $regex: district, $options: 'i' };
      }

      const requests = await EmergencyRequest.find(query).sort({
        urgencyLevel: 1, // CRITICAL then HIGH then MODERATE
        createdAt: -1
      });

      return res.json({
        success: true,
        count: requests.length,
        dataSource: 'MongoDB (Indexed)',
        data: requests
      });
    } else {
      const requests = mockStore.getEmergencyRequests({
        status,
        urgencyLevel,
        requestType,
        bloodGroup,
        city,
        district
      });

      return res.json({
        success: true,
        count: requests.length,
        dataSource: 'In-Memory Store',
        data: requests
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single emergency request
// @route   GET /api/emergency/:id
exports.getEmergencyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const item = await EmergencyRequest.findById(id);
      if (!item) return res.status(404).json({ success: false, message: 'Emergency request not found.' });
      return res.json({ success: true, data: item });
    } else {
      const item = mockStore.getEmergencyRequestById(id);
      if (!item) return res.status(404).json({ success: false, message: 'Emergency request not found.' });
      return res.json({ success: true, data: item });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Post a new emergency SOS request
// @route   POST /api/emergency
exports.createEmergencyRequest = async (req, res, next) => {
  try {
    const {
      requestType,
      patientName,
      hospitalName,
      doctorInCharge,
      bloodGroup,
      unitsRequired,
      equipmentCategory,
      urgencyLevel,
      requiredWithinHours,
      city,
      district,
      hospitalAddress,
      attendantName,
      attendantPhone,
      whatsappNumber,
      medicalSummary,
      verificationStatus,
      verifiedBy,
      coordinates
    } = req.body;

    if (!requestType || !patientName || !hospitalName || !attendantName || !attendantPhone || !city || !district || !medicalSummary) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory emergency details.' });
    }

    const payload = {
      requestType,
      patientName,
      hospitalName,
      doctorInCharge: doctorInCharge || 'Trauma Care Duty',
      bloodGroup: requestType === 'blood' ? bloodGroup : null,
      unitsRequired: Number(unitsRequired) || 1,
      equipmentCategory: requestType === 'equipment' ? equipmentCategory : null,
      urgencyLevel: urgencyLevel || 'HIGH',
      requiredWithinHours: Number(requiredWithinHours) || 4,
      city,
      district,
      hospitalAddress: hospitalAddress || '',
      attendantName,
      attendantPhone,
      whatsappNumber: whatsappNumber || attendantPhone.replace(/[^0-9]/g, ''),
      medicalSummary,
      verificationStatus: verificationStatus || 'COMMUNITY_VERIFIED',
      verifiedBy: verifiedBy || (req.user && req.user.role === 'hospital' ? req.user.name : 'Community Emergency Desk'),
      requester: req.user ? req.user._id : null,
      status: 'ACTIVE',
      whatsappBroadcastSent: true,
      location: {
        type: 'Point',
        coordinates: coordinates || [80.6480, 16.5062]
      }
    };

    const dbStatus = getDBStatus();
    let createdRequest;

    if (dbStatus.connected) {
      createdRequest = await EmergencyRequest.create(payload);

      // Query nearby matching donors for broadcast simulation
      let nearbyDonors = [];
      if (requestType === 'blood') {
        nearbyDonors = await DonorProfile.find({
          bloodGroup: bloodGroup.toUpperCase(),
          isAvailable: true,
          city: { $regex: city, $options: 'i' }
        }).limit(10);
      }
      await whatsappService.broadcastEmergencyAlert(createdRequest, nearbyDonors);
    } else {
      createdRequest = mockStore.addEmergencyRequest(payload);
      const matchingDonors = mockStore.getDonors({
        bloodGroup: requestType === 'blood' ? bloodGroup : undefined,
        city,
        isAvailable: true
      });
      await whatsappService.broadcastEmergencyAlert(createdRequest, matchingDonors);
    }

    // Generate WhatsApp action link for instant outreach
    const whatsappLink = whatsappService.generateEmergencyLink(
      createdRequest.whatsappNumber || createdRequest.attendantPhone,
      {
        type: createdRequest.requestType,
        patientName: createdRequest.patientName,
        bloodGroup: createdRequest.bloodGroup,
        unitsRequired: createdRequest.unitsRequired,
        equipmentTitle: createdRequest.equipmentCategory,
        hospitalName: createdRequest.hospitalName,
        city: createdRequest.city,
        district: createdRequest.district,
        doctorInCharge: createdRequest.doctorInCharge,
        urgencyLevel: createdRequest.urgencyLevel,
        requiredWithinHours: createdRequest.requiredWithinHours,
        attendantPhone: createdRequest.attendantPhone,
        medicalSummary: createdRequest.medicalSummary
      }
    );

    return res.status(201).json({
      success: true,
      message: '🚨 Emergency SOS broadcast posted and dispatched to nearby volunteer network!',
      data: createdRequest,
      whatsappDirectLink: whatsappLink
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark emergency request as fulfilled
// @route   PATCH /api/emergency/:id/resolve
exports.resolveEmergencyRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const item = await EmergencyRequest.findByIdAndUpdate(
        id,
        { status: 'FULFILLED', resolvedAt: new Date() },
        { new: true }
      );
      if (!item) return res.status(404).json({ success: false, message: 'Request not found.' });
      return res.json({ success: true, message: 'Emergency request marked as fulfilled.', data: item });
    } else {
      const item = mockStore.resolveEmergencyRequest(id);
      if (!item) return res.status(404).json({ success: false, message: 'Request not found.' });
      return res.json({ success: true, message: 'Emergency request marked as fulfilled.', data: item });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get pre-filled WhatsApp action link for direct donor response
// @route   GET /api/emergency/:id/whatsapp-action
exports.getWhatsAppActionLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    let item;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      item = await EmergencyRequest.findById(id);
    } else {
      item = mockStore.getEmergencyRequestById(id);
    }

    if (!item) return res.status(404).json({ success: false, message: 'Emergency request not found.' });

    const link = whatsappService.generateEmergencyLink(
      item.whatsappNumber || item.attendantPhone,
      {
        type: item.requestType,
        patientName: item.patientName,
        bloodGroup: item.bloodGroup,
        unitsRequired: item.unitsRequired,
        equipmentTitle: item.equipmentCategory,
        hospitalName: item.hospitalName,
        city: item.city,
        district: item.district,
        doctorInCharge: item.doctorInCharge,
        urgencyLevel: item.urgencyLevel,
        requiredWithinHours: item.requiredWithinHours,
        attendantPhone: item.attendantPhone,
        medicalSummary: item.medicalSummary
      }
    );

    return res.json({ success: true, whatsappLink: link });
  } catch (error) {
    next(error);
  }
};
