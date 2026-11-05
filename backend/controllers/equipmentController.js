const Equipment = require('../models/Equipment');
const mockStore = require('../data/mockStore');
const whatsappService = require('../services/whatsappService');
const { getDBStatus } = require('../config/db');

// @desc    Get equipment list with filters (category, city, district, status)
// @route   GET /api/equipment
exports.getAllEquipment = async (req, res, next) => {
  try {
    const { category, city, district, status, isFreeEmergency, search, lng, lat, maxKm = 50 } = req.query;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const query = {};

      if (category && category !== 'all') {
        query.category = category;
      }

      if (city) {
        query.city = { $regex: city, $options: 'i' };
      }

      if (district) {
        query.district = { $regex: district, $options: 'i' };
      }

      if (status && status !== 'all') {
        query.status = status;
      }

      if (isFreeEmergency !== undefined) {
        query.isFreeEmergency = isFreeEmergency === 'true';
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { ownerName: { $regex: search, $options: 'i' } }
        ];
      }

      if (lng && lat) {
        query.location = {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: parseInt(maxKm) * 1000
          }
        };
      }

      const equipment = await Equipment.find(query).sort({ status: 1, createdAt: -1 });
      return res.json({
        success: true,
        count: equipment.length,
        dataSource: 'MongoDB (Indexed & Geospatial)',
        data: equipment
      });
    } else {
      const equipment = mockStore.getEquipment({ category, city, district, status, isFreeEmergency, search });
      return res.json({
        success: true,
        count: equipment.length,
        dataSource: 'In-Memory Store',
        data: equipment
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single equipment details
// @route   GET /api/equipment/:id
exports.getEquipmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const eq = await Equipment.findById(id);
      if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found.' });
      return res.json({ success: true, data: eq });
    } else {
      const eq = mockStore.getEquipmentById(id);
      if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found.' });
      return res.json({ success: true, data: eq });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    List new medical equipment for rental/emergency loan
// @route   POST /api/equipment
exports.createEquipment = async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      condition,
      rentalRatePerDay,
      rentalRatePerMonth,
      securityDeposit,
      rentalTerms,
      isFreeEmergency,
      city,
      district,
      address,
      contactPhone,
      whatsappNumber,
      ownerName,
      imageUrl,
      coordinates
    } = req.body;

    if (!title || !category || !description || !city || !district || !contactPhone) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const payload = {
      title,
      category,
      description,
      condition: condition || 'Sanitized & Certified',
      rentalRatePerDay: Number(rentalRatePerDay) || 0,
      rentalRatePerMonth: Number(rentalRatePerMonth) || 0,
      securityDeposit: Number(securityDeposit) || 0,
      rentalTerms: rentalTerms || 'Standard identity verification required.',
      isFreeEmergency: Boolean(isFreeEmergency),
      city,
      district,
      address: address || '',
      contactPhone,
      whatsappNumber: whatsappNumber || contactPhone.replace(/[^0-9]/g, ''),
      ownerName: ownerName || (req.user ? req.user.name : 'Community Provider'),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&auto=format&fit=crop&q=80',
      owner: req.user ? req.user._id : null,
      status: 'available',
      location: {
        type: 'Point',
        coordinates: coordinates || [80.6480, 16.5062]
      }
    };

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const equipment = await Equipment.create(payload);
      return res.status(201).json({ success: true, message: 'Medical equipment listed successfully.', data: equipment });
    } else {
      const equipment = mockStore.addEquipment(payload);
      return res.status(201).json({ success: true, message: 'Medical equipment listed successfully.', data: equipment });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update equipment details and rental terms
// @route   PUT /api/equipment/:id
exports.updateEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const eq = await Equipment.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found.' });
      return res.json({ success: true, message: 'Equipment details updated.', data: eq });
    } else {
      const eq = mockStore.updateEquipment(id, req.body);
      if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found.' });
      return res.json({ success: true, message: 'Equipment details updated.', data: eq });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update equipment availability status (mark reserved/rented/available)
// @route   PATCH /api/equipment/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reservedBy, expectedReturnDate } = req.body;

    if (!['available', 'reserved', 'rented', 'maintenance'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const updateData = { status };
      if (reservedBy !== undefined) updateData.reservedBy = reservedBy;
      if (expectedReturnDate !== undefined) updateData.expectedReturnDate = expectedReturnDate;
      if (status === 'available') {
        updateData.reservedBy = null;
        updateData.expectedReturnDate = null;
      }

      const eq = await Equipment.findByIdAndUpdate(id, updateData, { new: true });
      if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found.' });
      return res.json({ success: true, message: `Equipment status marked as ${status.toUpperCase()}.`, data: eq });
    } else {
      const eq = mockStore.toggleEquipmentStatus(id, status, { reservedBy, expectedReturnDate });
      if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found.' });
      return res.json({ success: true, message: `Equipment status marked as ${status.toUpperCase()}.`, data: eq });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Generate WhatsApp booking action link
// @route   GET /api/equipment/:id/whatsapp-link
exports.getWhatsAppInquiryLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    let eq;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      eq = await Equipment.findById(id);
    } else {
      eq = mockStore.getEquipmentById(id);
    }

    if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found.' });

    const link = whatsappService.generateEquipmentInquiryLink(
      eq.whatsappNumber || eq.contactPhone,
      eq,
      req.user || {}
    );

    return res.json({ success: true, whatsappLink: link });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete equipment listing
// @route   DELETE /api/equipment/:id
exports.deleteEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const eq = await Equipment.findByIdAndDelete(id);
      if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found.' });
      return res.json({ success: true, message: 'Equipment listing removed.' });
    } else {
      const ok = mockStore.deleteEquipment(id);
      if (!ok) return res.status(404).json({ success: false, message: 'Equipment not found.' });
      return res.json({ success: true, message: 'Equipment listing removed.' });
    }
  } catch (error) {
    next(error);
  }
};
