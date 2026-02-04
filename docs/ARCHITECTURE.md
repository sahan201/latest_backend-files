1. frontand (react)
   localhost : 3000

2. backend api (node.js + express)

3. mongodb driver + external API

4. mongodb atlas + twilio sms api + email service

***planned aws arch

internet -> Route 53 DNS -> cloudFront (CDN)

-> s3 bucket(react build) 

-> application load (ALB)

-> EC2 (API)

TWILIO SMS API + email service + mongodb atlas


## Components

### Frontend
- **Technology:** React.js
- **Hosting:** AWS S3 (static hosting)
- **CDN:** AWS CloudFront
- **SSL:** AWS Certificate Manager

### Backend
- **Technology:** Node.js + Express
- **Hosting:** AWS EC2 (initially) → AWS ECS (later)
- **Load Balancing:** Application Load Balancer
- **Auto Scaling:** EC2 Auto Scaling Group

### Database
- **Technology:** MongoDB Atlas
- **Hosting:** MongoDB Cloud (already cloud-based!)
- **Backup:** Automated daily backups

### External Services
- **SMS:** Twilio API
- **Email:** NodeMailer / AWS SES (future)

## Data Flow

### User Registration
1. Frontend sends registration data to API
2. API validates and hashes password
3. API stores user in MongoDB
4. API sends welcome SMS via Twilio
5. API returns JWT token
6. Frontend stores token

### Service Booking
1. Customer submits booking form
2. API creates service record
3. API sends confirmation SMS to customer
4. API notifies assigned technician
5. API returns booking confirmation

### Invoice Generation
1. Service completion triggers invoice
2. API generates invoice document
3. API stores invoice in MongoDB
4. API emails PDF to customer
5. API sends SMS notification
