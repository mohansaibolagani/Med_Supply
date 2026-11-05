const express = require('express');
const router = express.Router();
const { getDashboard, recordDonation, returnEquipment } = require('../controllers/dashboardController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getDashboard);
router.post('/donations', optionalAuth, recordDonation);
router.patch('/equipment/:id/return', returnEquipment);

module.exports = router;
