# 📋 Quick Reference Card

## 🚀 Setup (5 minutes)

```bash
# 1. Install
npm install

# 2. Configure .env (edit these values)
MONGO_URI=mongodb://localhost:27017/vehicle-service-db
JWT_SECRET=your_secret_key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# 3. Start MongoDB
mongod

# 4. Run server
npm run dev
```

## 🔑 Test Flow

### 1. Register
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "test123",
  "role": "Customer"
}
```

### 2. Login (Get Token)
```bash
POST /api/auth/login
{
  "email": "john@test.com",
  "password": "test123"
}
# Save the token!
```

### 3. Add Vehicle
```bash
POST /api/vehicles
Headers: Authorization: Bearer YOUR_TOKEN
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2020,
  "vehicleNo": "ABC123"
}
# Save the vehicleId!
```

### 4. Book Appointment
```bash
POST /api/appointments
Headers: Authorization: Bearer YOUR_TOKEN
{
  "vehicleId": "YOUR_VEHICLE_ID",
  "serviceType": "Oil Change",
  "date": "2024-11-20",
  "time": "10:00 AM"
}
```

## 📝 All Endpoints

### Auth (No token needed)
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get profile (token required)

### Vehicles (Customer only, token required)
- POST `/api/vehicles` - Add vehicle
- GET `/api/vehicles` - Get all my vehicles
- GET `/api/vehicles/:id` - Get one vehicle
- PUT `/api/vehicles/:id` - Update vehicle
- DELETE `/api/vehicles/:id` - Delete vehicle

### Appointments (Token required)
- POST `/api/appointments` - Create (Customer)
- GET `/api/appointments/my-appointments` - My appointments (Customer)
- GET `/api/appointments/:id` - Get one
- GET `/api/appointments` - Get all (Manager/Mechanic)
- PUT `/api/appointments/:id/cancel` - Cancel (Customer)

## 🔧 Troubleshooting

### MongoDB not connecting?
```bash
# Start MongoDB
sudo systemctl start mongod  # Linux
net start MongoDB            # Windows
```

### Email not working?
1. Enable 2FA on Gmail
2. Generate App Password
3. Use App Password in .env

### Token expired?
- Re-login to get new token
- Token lasts 30 days

### Port in use?
```bash
# Change PORT in .env
PORT=3000
```

## 📚 Documentation

- `README.md` - Full documentation
- `QUICK_START.md` - Detailed setup
- `API_TESTING.md` - API examples
- `COMPLETE.md` - What's done

## ✅ Features Working

- [x] User registration & login
- [x] JWT authentication
- [x] Vehicle CRUD
- [x] Appointment booking
- [x] Off-peak discounts
- [x] Email notifications
- [x] PDF attachments
- [x] Role-based access

## 🎯 User Roles

- **Customer**: Add vehicles, book appointments
- **Mechanic**: View assigned jobs (Phase 2)
- **Manager**: Full access (Phase 2)

## 💡 Pro Tips

1. Use Postman for easy testing
2. Save tokens for reuse
3. Check terminal for errors
4. Verify MongoDB is running
5. Use correct Authorization header format

## 📞 Help

- Error 401: Check your token
- Error 403: Wrong role
- Error 404: Wrong ID or route
- Error 500: Check server logs

---

**Ready to test?** Open Postman and start with `/api/auth/register`!
