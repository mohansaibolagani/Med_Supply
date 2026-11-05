const express = require('express');
const router = express.Router();
const {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  updateStatus,
  getWhatsAppInquiryLink,
  deleteEquipment
} = require('../controllers/equipmentController');
const { protect, optionalAuth } = require('../middleware/auth');

router.route('/')
  .get(getAllEquipment)
  .post(optionalAuth, createEquipment);

router.route('/:id')
  .get(getEquipmentById)
  .put(protect, updateEquipment)
  .delete(protect, deleteEquipment);

router.patch('/:id/status', updateStatus);
router.get('/:id/whatsapp-link', optionalAuth, getWhatsAppInquiryLink);

module.exports = router;
