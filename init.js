// init.js - Load environment variables before anything else
import dotenv from 'dotenv';
dotenv.config();

console.log('Environment variables loaded');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Loaded' : 'Missing');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Loaded' : 'Missing');