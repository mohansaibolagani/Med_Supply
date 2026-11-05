const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medsupply_db',
  JWT_SECRET: process.env.JWT_SECRET || 'medsupply_super_secret_jwt_key_2026_class_project',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN || '',
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  SMS_GATEWAY_API_KEY: process.env.SMS_GATEWAY_API_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
};
