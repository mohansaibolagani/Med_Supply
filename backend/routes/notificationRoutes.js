const express = require('express');
const router = express.Router();
const { getBroadcastLogs, testDispatch, getOpsHealth } = require('../controllers/notificationController');

router.get('/broadcast-logs', getBroadcastLogs);
router.post('/test-dispatch', testDispatch);
router.get('/ops-health', getOpsHealth);

module.exports = router;
