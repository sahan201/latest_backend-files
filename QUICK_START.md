# 🚀 Quick Start Guide - Essential Backend

## ✅ What's Included (Option C - Essentials)

### Controllers
- ✅ **authController.js** - Register, login, get profile
- ✅ **vehicleController.js** - Add, view, edit, delete vehicles
- ✅ **appointmentController.js** - Create, view, cancel appointments

### Routes
- ✅ **auth.js** - Authentication endpoints
- ✅ **vehicles.js** - Vehicle management endpoints
- ✅ **appointments.js** - Appointment booking endpoints

### Server
- ✅ **server.js** - Main application server

## 🎯 What You Can Test Now

### 1. Authentication ✅
- Register new users (Customer, Mechanic, Manager)
- Login with credentials
- Get user profile

### 2. Vehicles ✅
- Add new vehicles (with duplicate check)
- View all your vehicles
- Update vehicle details
- Delete vehicles

### 3. Appointments ✅
- Book service appointments
- View your appointments
- Check off-peak discounts
- Cancel appointments
- Receive confirmation emails (with PDF)

## ⚙️ Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vehicle-service-db
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 3. Start MongoDB
```bash
# Linux/Mac
sudo systemctl start mongod

# Windows
net start MongoDB

# Or if using MongoDB Compass, just open it
```

### 4. Run the Server
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

You should see:
```
==================================================
🚀 Server running on port 5000
📝 Environment: development
🌐 API URL: http://localhost:5000
==================================================
MongoDB Connected: localhost
```

## 🧪 Testing the API

### Method 1: Using Postman (Recommended)

1. Download Postman: https://www.postman.com/downloads/
2. Import the test collection (see API_TESTING.md)
3. Start testing!

### Method 2: Using cURL

See examples in API_TESTING.md

### Method 3: Using Thunder Client (VS Code)

1. Install Thunder Client extension in VS Code
2. Create requests as shown in API_TESTING.md

## 📝 Test Flow

### Step 1: Register a Customer
```
POST http://localhost:5000/api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Customer"
}
```

### Step 2: Login
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```
**Save the token!** You'll need it for all other requests.

### Step 3: Add a Vehicle
```
POST http://localhost:5000/api/vehicles
Headers: Authorization: Bearer YOUR_TOKEN_HERE
Body: {
  "make": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "vehicleNo": "ABC1234"
}
```

### Step 4: Book an Appointment
```
POST http://localhost:5000/api/appointments
Headers: Authorization: Bearer YOUR_TOKEN_HERE
Body: {
  "vehicleId": "YOUR_VEHICLE_ID",
  "serviceType": "Oil Change",
  "date": "2024-11-20",
  "time": "10:00 AM"
}
```

## ✨ Key Features Working

### 1. Smart Off-Peak Discounts
- Automatically checks if booking date is off-peak day
- Applies 5% discount if eligible
- Shows discount in confirmation email

### 2. Email Notifications
- Sends booking confirmation with PDF attachment
- Professional email template
- Includes all appointment details

### 3. Security
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Vehicle ownership verification

### 4. Validation
- Duplicate vehicle number check
- Time slot conflict detection
- Required field validation
- Authorization checks

## 🔧 Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution:** 
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
sudo systemctl start mongod  # Linux
net start MongoDB             # Windows
```

### Issue: "Email not sending"
**Solution:**
- Enable 2FA on Gmail
- Generate App Password in Google Account settings
- Use App Password (not regular password) in .env

### Issue: "JWT token invalid"
**Solution:**
- Check if JWT_SECRET is set in .env
- Token expires after 30 days (check JWT_EXPIRE)
- Make sure you're using "Bearer TOKEN" format

### Issue: "Port already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change PORT in .env
```

## 📊 What's Next?

After testing the essentials, you can add:

### Phase 2 (Optional):
- Manager functions (assign jobs, manage inventory)
- Mechanic functions (job queue, add parts/labor)
- Feedback system
- PDF reports
- Settings management

Let me know when you want to add these features!

## 📞 Need Help?

If you encounter issues:
1. Check the error logs in terminal
2. Verify MongoDB is running
3. Check .env configuration
4. See API_TESTING.md for detailed examples

Happy coding! 🎉
