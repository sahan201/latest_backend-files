// init.js - Load environment variables before anything else
// init.js
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

import dotenv from 'dotenv';
dotenv.config();

console.log('Environment variables loaded');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Loaded' : 'Missing');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Loaded' : 'Missing');