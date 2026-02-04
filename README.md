# Vehicle Service Center Backend

A complete backend system for managing vehicle service appointments, mechanics, inventory, and customer feedback.

Features

### Customer Features
- Register and login
- Add/edit/delete vehicles
- Book service appointments
- Track appointment status
- Cancel appointments
- Submit feedback and ratings

### Mechanic Features
- View assigned jobs
- Start/finish services
- Add parts and labor charges to jobs
- Digital job card system

### Manager Features
- Assign jobs to mechanics
- Manage inventory (CRUD operations)
- Create mechanic accounts
- Generate PDF reports
- View all feedback
- Set off-peak discount days

### System Features
- Role-based access control
- Automated billing with off-peak discounts
- Email notifications with PDF attachments
- PDF generation for invoices and reports
- SMS notifications via Twilio

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (cloud database)
- Gmail account (for email functionality)
- Twilio account (for SMS functionality)

## Installation

1. **Clone or download this project**

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vehicle-service-db
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=30d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Twilio SMS
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Frontend URL (CRITICAL for CORS - Required for AWS deployment)
CLIENT_URL=http://localhost:3000
```

**IMPORTANT - CLIENT_URL:**
- **Local Development:** `http://localhost:3000`
- **AWS Production:** `https://your-cloudfront-domain.cloudfront.net`
- This variable controls CORS. If not set correctly, frontend won't be able to call your API!

**Important**: For Gmail, you need to:
- Enable 2-factor authentication on your Google account
- Generate an "App Password" from Google Account settings
- Use that app password in the EMAIL_PASSWORD field

4. **Run the server**

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Vehicles (Customer only)
- `POST /api/vehicles` - Add vehicle
- `GET /api/vehicles` - Get user's vehicles
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Appointments
- `POST /api/appointments` - Create appointment (Customer)
- `GET /api/appointments` - Get all appointments (Manager/Mechanic)
- `PUT /api/appointments/:id/cancel` - Cancel appointment (Customer)

### Inventory (Manager/Mechanic)
- `GET /api/inventory` - Get all items
- `POST /api/inventory` - Create item (Manager only)
- `PUT /api/inventory/:id` - Update item (Manager only)
- `DELETE /api/inventory/:id` - Delete item (Manager only)

### Manager Routes
- `GET /api/manager/jobs/unassigned` - Get unassigned jobs
- `PUT /api/manager/jobs/assign/:id` - Assign job to mechanic
- `GET /api/manager/mechanics` - Get all mechanics
- `PUT /api/manager/inventory/receive/:id` - Receive stock
- `POST /api/manager/inventory/order/:id` - Order stock

### Mechanic Routes
- `GET /api/mechanic/jobs` - Get assigned jobs
- `PUT /api/mechanic/jobs/start/:id` - Start job
- `PUT /api/mechanic/jobs/finish/:id` - Finish job
- `POST /api/mechanic/jobs/:id/parts` - Add part to job
- `POST /api/mechanic/jobs/:id/labor` - Add labor to job

### Feedback
- `POST /api/feedback` - Submit feedback (Customer)
- `GET /api/feedback` - Get all feedback (Manager)

### Complaints
- `POST /api/complaints` - Submit complaint (Customer)
- `GET /api/complaints` - Get all complaints (Manager)
- `GET /api/complaints/my-complaints` - Get customer's complaints

### Reports (Manager only)
- `GET /api/reports/business-report` - Generate PDF report
- `GET /api/reports/booking-stats` - Get booking statistics by day

### Settings (Manager only)
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

## User Roles

- **Customer**: Can manage vehicles, book appointments, and leave feedback
- **Mechanic**: Can view assigned jobs and manage service work
- **Manager**: Full system access including reports and settings

## AWS Deployment Notes

This backend is designed for AWS deployment:

**Week 3 Deployment:**
- **EC2:** Host the backend API
- **MongoDB Atlas:** Already cloud-based (no changes needed!)
- **Environment Variables:** Set CLIENT_URL to your S3/CloudFront URL

**Example AWS .env:**
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://your-atlas-connection-string
CLIENT_URL=https://d1234567890.cloudfront.net
# ... other variables
```

## Testing Email Functionality

1. Use a Gmail account
2. Enable 2-factor authentication
3. Generate an App Password: Google Account → Security → App passwords
4. Use the app password in your .env file

## Testing SMS Functionality

1. Create Twilio account
2. Get Account SID and Auth Token from Twilio Console
3. Get a Twilio phone number
4. Add credentials to .env file

## Testing the API

You can use tools like:
- Postman
- Thunder Client (VS Code extension)
- cURL commands

## Project Structure

```
vehicle-service-center-backend/
├── config/
│   ├── db.js              # MongoDB connection
│   ├── mail.js            # Email configuration
│   └── env.js             # Environment validation
├── controllers/           # Business logic
├── models/               # Database schemas
├── routes/               # API routes
├── middleware/           # Authentication & authorization
├── utils/                # Helper functions (PDF, email, SMS)
├── docs/                 # Documentation
├── .env.example          # Environment template
├── .gitignore
├── init.js               # Environment validation on startup
├── server.js             # Main server file
└── package.json

```

## Security Features

- Helmet (HTTP headers security)
- CORS (Cross-Origin Resource Sharing)
- Rate Limiting (100 requests per 15 minutes)
- MongoDB Sanitization (NoSQL injection prevention)
- JWT Authentication
- Bcrypt Password Hashing

## Common Issues & Solutions

**CORS Error:**
- Make sure CLIENT_URL in .env matches your frontend URL EXACTLY
- Include protocol (http:// or https://)
- No trailing slash

**Email Not Sending:**
- Verify Gmail App Password is correct
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Make sure 2FA is enabled on Gmail account

**SMS Not Sending:**
- Verify Twilio credentials
- Check phone number format (+1234567890)
- Verify Twilio account has credits

**MongoDB Connection Failed:**
- Check MongoDB Atlas connection string
- Verify IP address is whitelisted in Atlas
- Check username/password in connection string
