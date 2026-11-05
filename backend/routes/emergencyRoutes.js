const express = require('express');
const router = express.Router();
const {
  getEmergencyFeed,
  getEmergencyById,
  createEmergencyRequest,
  resolveEmergencyRequest,
  getWhatsAppActionLink
} = require('../controllers/emergencyController');
const { optionalAuth } = require('../middleware/auth');

router.route('/')
  .get(getEmergencyFeed)
  .post(optionalAuth, createEmergencyRequest);

router.route('/:id')
  .get(getEmergencyById);

router.patch('/:id/resolve', resolveEmergencyRequest);
router.get('/:id/whatsapp-action', getWhatsAppActionLink);

module.exports = router;
