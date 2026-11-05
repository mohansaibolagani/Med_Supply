const DonorProfile = require('../models/DonorProfile');
const mockStore = require('../data/mockStore');
const { getDBStatus } = require('../config/db');

// @desc    Get all donors with blood group & location filtering (Geospatial index enabled)
// @route   GET /api/donors
exports.getDonors = async (req, res, next) => {
  try {
    const { bloodGroup, city, district, isAvailable, lng, lat, maxKm = 50, search } = req.query;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const query = {};

      if (bloodGroup && bloodGroup !== 'all') {
        query.bloodGroup = bloodGroup.toUpperCase();
      }

      if (city) {
        query.city = { $regex: city, $options: 'i' };
      }

      if (district) {
        query.district = { $regex: district, $options: 'i' };
      }

      if (isAvailable !== undefined) {
        query.isAvailable = isAvailable === 'true';
      }

      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { district: { $regex: search, $options: 'i' } },
          { bloodGroup: { $regex: search, $options: 'i' } }
        ];
      }

      // Geospatial $near query if coordinates provided (Member 1 specification)
      if (lng && lat) {
        query.location = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: parseInt(maxKm) * 1000 // Convert km to meters
          }
        };
      }

      const donors = await DonorProfile.find(query).sort({ isAvailable: -1, donationCount: -1 });
      return res.json({
        success: true,
        count: donors.length,
        dataSource: 'MongoDB (Indexed & Geospatial)',
        data: donors
      });
    } else {
      const donors = mockStore.getDonors({ bloodGroup, city, district, isAvailable, search });
      return res.json({
        success: true,
        count: donors.length,
        dataSource: 'In-Memory Store',
        data: donors
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donor by ID
// @route   GET /api/donors/:id
exports.getDonorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const donor = await DonorProfile.findById(id);
      if (!donor) return res.status(404).json({ success: false, message: 'Donor not found.' });
      return res.json({ success: true, data: donor });
    } else {
      const donor = mockStore.getDonorById(id);
      if (!donor) return res.status(404).json({ success: false, message: 'Donor not found.' });
      return res.json({ success: true, data: donor });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Register as a blood donor
// @route   POST /api/donors
exports.createDonor = async (req, res, next) => {
  try {
    const {
      fullName,
      bloodGroup,
      phone,
      whatsappNumber,
      city,
      district,
      state,
      lastDonationDate,
      readyForEmergency,
      notes,
      coordinates
    } = req.body;

    if (!fullName || !bloodGroup || !phone || !city || !district) {
      return res.status(400).json({ success: false, message: 'Missing required donor registration fields.' });
    }

    const dbStatus = getDBStatus();

    const payload = {
      fullName,
      bloodGroup: bloodGroup.toUpperCase(),
      phone,
      whatsappNumber: whatsappNumber || phone.replace(/[^0-9]/g, ''),
      city,
      district,
      state: state || 'Andhra Pradesh',
      lastDonationDate: lastDonationDate || null,
      readyForEmergency: readyForEmergency !== false,
      notes: notes || '',
      isAvailable: true,
      location: {
        type: 'Point',
        coordinates: coordinates || [80.6480, 16.5062]
      },
      user: req.user ? req.user._id : null
    };

    if (dbStatus.connected) {
      const donor = await DonorProfile.create(payload);
      return res.status(201).json({ success: true, message: 'Donor profile registered successfully.', data: donor });
    } else {
      const donor = mockStore.addDonor(payload);
      return res.status(201).json({ success: true, message: 'Donor profile registered successfully.', data: donor });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update donor profile (e.g. availability or last donation date)
// @route   PUT /api/donors/:id
exports.updateDonor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const donor = await DonorProfile.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!donor) return res.status(404).json({ success: false, message: 'Donor not found.' });
      return res.json({ success: true, message: 'Donor profile updated.', data: donor });
    } else {
      const donor = mockStore.updateDonor(id, req.body);
      if (!donor) return res.status(404).json({ success: false, message: 'Donor not found.' });
      return res.json({ success: true, message: 'Donor profile updated.', data: donor });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle donor availability status
// @route   PATCH /api/donors/:id/toggle-availability
exports.toggleAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const donor = await DonorProfile.findById(id);
      if (!donor) return res.status(404).json({ success: false, message: 'Donor not found.' });

      donor.isAvailable = !donor.isAvailable;
      await donor.save();
      return res.json({ success: true, message: `Availability status set to ${donor.isAvailable ? 'AVAILABLE' : 'OFFLINE'}.`, data: donor });
    } else {
      const donor = mockStore.toggleDonorAvailability(id);
      if (!donor) return res.status(404).json({ success: false, message: 'Donor not found.' });
      return res.json({ success: true, message: `Availability status set to ${donor.isAvailable ? 'AVAILABLE' : 'OFFLINE'}.`, data: donor });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate eligibility cooldown for donation (90 days interval rule)
// @route   GET /api/donors/:id/eligibility
exports.checkEligibility = async (req, res, next) => {
  try {
    const { id } = req.params;
    let donor;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      donor = await DonorProfile.findById(id);
    } else {
      donor = mockStore.getDonorById(id);
    }

    if (!donor) return res.status(404).json({ success: false, message: 'Donor not found.' });

    if (!donor.lastDonationDate) {
      return res.json({
        success: true,
        isEligible: true,
        daysSinceLastDonation: null,
        daysRemaining: 0,
        nextEligibleDate: 'Immediately eligible',
        message: 'No previous donation on record. Eligible to donate immediately!'
      });
    }

    const lastDate = new Date(donor.lastDonationDate);
    const now = new Date();
    const msDiff = now - lastDate;
    const daysSince = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    const cooldownDays = 90;
    const isEligible = daysSince >= cooldownDays;
    const daysRemaining = isEligible ? 0 : cooldownDays - daysSince;

    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + cooldownDays);

    return res.json({
      success: true,
      isEligible,
      daysSinceLastDonation: daysSince,
      daysRemaining,
      nextEligibleDate: nextDate.toISOString().split('T')[0],
      message: isEligible
        ? 'Eligible to donate. Cooldown period completed!'
        : `In cooldown period. ${daysRemaining} days remaining before next eligible donation.`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete donor profile
// @route   DELETE /api/donors/:id
exports.deleteDonor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const donor = await DonorProfile.findByIdAndDelete(id);
      if (!donor) return res.status(404).json({ success: false, message: 'Donor not found.' });
      return res.json({ success: true, message: 'Donor profile removed.' });
    } else {
      const ok = mockStore.deleteDonor(id);
      if (!ok) return res.status(404).json({ success: false, message: 'Donor not found.' });
      return res.json({ success: true, message: 'Donor profile removed.' });
    }
  } catch (error) {
    next(error);
  }
};
