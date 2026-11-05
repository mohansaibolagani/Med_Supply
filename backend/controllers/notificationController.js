const whatsappService = require('../services/whatsappService');
const { getDBStatus } = require('../config/db');
const config = require('../config/config');

// @desc    Get WhatsApp broadcast dispatch history logs
// @route   GET /api/notifications/broadcast-logs
exports.getBroadcastLogs = (req, res) => {
  res.json({
    success: true,
    count: whatsappService.getBroadcastLogs().length,
    logs: whatsappService.getBroadcastLogs()
  });
};

// @desc    Test WhatsApp / SMS gateway simulation
// @route   POST /api/notifications/test-dispatch
exports.testDispatch = async (req, res, next) => {
  try {
    const { phone, message, type = 'emergency_test' } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Recipient phone number is required.' });

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message || '🚨 Test alert from MedSupply Verification & Ops Gateway.');
    const directLink = `https://wa.me/${cleanPhone}?text=${encoded}`;

    return res.json({
      success: true,
      message: 'Dispatch processed through MedSupply Ops Gateway.',
      provider: config.WHATSAPP_API_TOKEN ? 'Meta WhatsApp Cloud API' : 'Direct Action Hook + Simulator Engine',
      directLink,
      dispatchedPayload: {
        to: cleanPhone,
        timestamp: new Date().toISOString(),
        channel: 'WhatsApp Web / Mobile API',
        contentPreview: message
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    System health & Member 3 ops status
// @route   GET /api/notifications/ops-health
exports.getOpsHealth = (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    success: true,
    service: 'MedSupply Unified Healthcare Exchange',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    database: dbStatus,
    gateway: {
      whatsappConfigured: Boolean(config.WHATSAPP_API_TOKEN),
      mode: config.WHATSAPP_API_TOKEN ? 'Live Meta Cloud API' : 'Simulated Sandbox & Direct Action Hooks',
      smsGatewayConfigured: Boolean(config.SMS_GATEWAY_API_KEY)
    },
    workloadSplit: {
      member1: 'Backend REST API, MongoDB Geospatial/Index, Auth Middleware',
      member2: 'React Responsive UI, Emergency Feed, Status Toggles, Modals',
      member3: 'WhatsApp/SMS Action Hooks, DB Seed Script, Docker Deployment, Documentation'
    }
  });
};
