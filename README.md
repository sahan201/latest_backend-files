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

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Gmail account (for email functionality)

## Installation

1. **Clone or download this project**

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Edit the `.env` file with your settings:

```env
PORT=5000
MONGO_URI=""
JWT_SECRET=""
JWT_EXPIRE=30d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=""
```

**Important**: For Gmail, you need to:
- Enable 2-factor authentication on your Google account
- Generate an "App Password" from Google Account settings
- Use that app password in the EMAIL_PASSWORD field

4. **Start MongoDB**

Make sure MongoDB is running on your system:
```bash
# On Linux/Mac
sudo systemctl start mongod

# On Windows
net start MongoDB
```

5. **Run the server**

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `your-url`

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

### Reports (Manager only)
- `GET /api/reports/generate?start=YYYY-MM-DD&end=YYYY-MM-DD` - Generate PDF report
- `GET /api/reports/booking-stats` - Get booking statistics by day

### Settings (Manager only)
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

## User Roles

- **Customer**: Can manage vehicles, book appointments, and leave feedback
- **Mechanic**: Can view assigned jobs and manage service work
- **Manager**: Full system access including reports and settings

## Testing Email Functionality

1. Use a Gmail account
2. Enable 2-factor authentication
3. Generate an App Password: Google Account → Security → App passwords
4. Use the app password in your .env file

## Testing the API

You can use tools like:
- Postman
- Thunder Client (VS Code extension)
- cURL commands


