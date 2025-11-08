import dotenv from 'dotenv';
dotenv.config();

console.log('\n📋 Environment Variables Test:');
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT FOUND');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Found' : '❌ NOT FOUND');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Found' : '❌ NOT FOUND');