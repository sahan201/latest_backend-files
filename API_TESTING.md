# 🧪 API Testing Guide

Complete guide to test all available endpoints with examples.

## 📋 Base URL

```
http://localhost:5000
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 1️⃣ AUTHENTICATION ENDPOINTS

### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Customer"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "673abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Customer"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "673abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Customer"
  }
}
```

### Get My Profile
```http
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "673abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Customer",
    "createdAt": "2024-11-08T10:00:00.000Z"
  }
}
```

---

## 2️⃣ VEHICLE ENDPOINTS

### Add New Vehicle
```http
POST /api/vehicles
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "make": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "vehicleNo": "ABC1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle added successfully",
  "vehicle": {
    "_id": "673def456...",
    "customer": "673abc123...",
    "make": "Toyota",
    "model": "Corolla",
    "year": 2020,
    "vehicleNo": "ABC1234",
    "createdAt": "2024-11-08T10:30:00.000Z"
  }
}
```

### Get All My Vehicles
```http
GET /api/vehicles
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "vehicles": [
    {
      "_id": "673def456...",
      "make": "Toyota",
      "model": "Corolla",
      "year": 2020,
      "vehicleNo": "ABC1234"
    },
    {
      "_id": "673def789...",
      "make": "Honda",
      "model": "Civic",
      "year": 2019,
      "vehicleNo": "XYZ5678"
    }
  ]
}
```

### Get Single Vehicle
```http
GET /api/vehicles/673def456...
Authorization: Bearer YOUR_TOKEN_HERE
```

### Update Vehicle
```http
PUT /api/vehicles/673def456...
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "make": "Toyota",
  "model": "Camry",
  "year": 2021,
  "vehicleNo": "ABC1234"
}
```

### Delete Vehicle
```http
DELETE /api/vehicles/673def456...
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle removed successfully"
}
```

---

## 3️⃣ APPOINTMENT ENDPOINTS

### Create New Appointment
```http
POST /api/appointments
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "vehicleId": "673def456...",
  "serviceType": "Oil Change",
  "date": "2024-11-20",
  "time": "10:00 AM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "appointment": {
    "_id": "673ghi789...",
    "customer": {
      "_id": "673abc123...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "vehicle": {
      "_id": "673def456...",
      "make": "Toyota",
      "model": "Corolla",
      "vehicleNo": "ABC1234"
    },
    "serviceType": "Oil Change",
    "date": "2024-11-20",
    "time": "10:00 AM",
    "status": "Scheduled",
    "discountEligible": false,
    "createdAt": "2024-11-08T11:00:00.000Z"
  }
}
```

**Note:** You'll also receive a confirmation email with PDF attachment!

### Get My Appointments
```http
GET /api/appointments/my-appointments
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "appointments": [
    {
      "_id": "673ghi789...",
      "vehicle": {
        "make": "Toyota",
        "model": "Corolla",
        "vehicleNo": "ABC1234"
      },
      "serviceType": "Oil Change",
      "date": "2024-11-20",
      "time": "10:00 AM",
      "status": "Scheduled",
      "discountEligible": false
    }
  ]
}
```

### Get Single Appointment
```http
GET /api/appointments/673ghi789...
Authorization: Bearer YOUR_TOKEN_HERE
```

### Cancel Appointment
```http
PUT /api/appointments/673ghi789.../cancel
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "appointment": {
    "_id": "673ghi789...",
    "status": "Cancelled"
  }
}
```

### Get All Appointments (Manager/Mechanic Only)
```http
GET /api/appointments
Authorization: Bearer MANAGER_OR_MECHANIC_TOKEN
```

---

## 🧪 POSTMAN COLLECTION

### Import This Collection

1. Open Postman
2. Click "Import"
3. Copy and paste this JSON:

```json
{
  "info": {
    "name": "Vehicle Service Center API",
    "description": "Essential endpoints for testing",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\",\n  \"role\": \"Customer\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Get Profile",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/auth/me",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "me"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🐚 cURL Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Customer"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Add Vehicle (Replace TOKEN)
```bash
curl -X POST http://localhost:5000/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "make": "Toyota",
    "model": "Corolla",
    "year": 2020,
    "vehicleNo": "ABC1234"
  }'
```

### Create Appointment (Replace TOKEN and VEHICLE_ID)
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "vehicleId": "YOUR_VEHICLE_ID",
    "serviceType": "Oil Change",
    "date": "2024-11-20",
    "time": "10:00 AM"
  }'
```

---

## 🎯 Test Scenarios

### Scenario 1: New Customer Journey
1. Register as Customer
2. Login (save token)
3. Add vehicle
4. Book appointment
5. Check email for confirmation
6. View my appointments
7. Cancel appointment

### Scenario 2: Off-Peak Discount Test
1. Create appointment for Monday (off-peak day)
2. Check response - `discountEligible: true`
3. Create appointment for Friday (regular day)
4. Check response - `discountEligible: false`

### Scenario 3: Security Tests
1. Try to add vehicle without token → Should fail (401)
2. Try to view another user's vehicle → Should fail (403)
3. Register with existing email → Should fail (400)
4. Login with wrong password → Should fail (401)

---

## ✅ Expected Status Codes

- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (not authorized for this resource)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Server Error

---

## 📝 Notes

- Always save your token after login
- Tokens expire after 30 days
- Vehicle numbers are automatically converted to uppercase
- Time slot conflicts are automatically checked
- Email notifications are sent for new appointments
- PDFs are attached to confirmation emails

Happy Testing! 🎉
