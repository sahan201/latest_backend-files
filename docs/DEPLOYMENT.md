# Vehicle Service Center - AWS Production Deployment

## Live URLs
- **Frontend**: https://d3pumtfwk14avv.cloudfront.net
- **Backend API**: https://vehicle-service.duckdns.org
- **GitHub**: https://github.com/sahan201/latest_backend-files/

## Architecture
```
CloudFront (CDN) → S3 (Frontend) → Nginx (Reverse Proxy) → Node.js (Backend) → MongoDB Atlas
```

## Tech Stack
- **Cloud**: AWS (EC2, S3, CloudFront)
- **Server**: Ubuntu 24.04, Nginx, Let's Encrypt SSL
- **Backend**: Node.js, Express, MongoDB, PM2
- **Frontend**: React, Vite
- **DevOps**: Git, SSH, AWS CLI

## Deployment Process

### Backend Deployment
1. Launch EC2 t3.micro instance (Ubuntu 24.04)
2. Install Node.js 20, PM2, Nginx
3. Configure Nginx reverse proxy
4. Set up Let's Encrypt SSL certificate
5. Deploy Node.js app with PM2
6. Configure environment variables

### Frontend Deployment
1. Build React app with Vite
2. Upload to S3 bucket (static website hosting)
3. Create CloudFront distribution
4. Configure error pages for React Router
5. Invalidate cache on updates

## Key Challenges Solved

### 1. Port Conflict (EADDRINUSE)
**Problem**: Port 5000 already in use
**Solution**: `lsof -i :5000` to find process, `kill -9 PID` to terminate

### 2. Mixed Content Error
**Problem**: HTTPS frontend couldn't call HTTP backend
**Solution**: Set up Nginx with SSL certificate, configured reverse proxy

### 3. CORS Error
**Problem**: CloudFront origin blocked by backend
**Solution**: Updated backend CORS to allow CloudFront URL

### 4. 404 Route Not Found
**Problem**: CloudFront serving cached old frontend
**Solution**: Invalidate CloudFront cache after S3 updates

### 5. Trust Proxy Error
**Problem**: Express didn't trust Nginx proxy headers
**Solution**: Added `app.set('trust proxy', true)` in Express config

## Performance
- CloudFront CDN: Global content delivery
- PM2: Auto-restart on crashes
- Nginx: Load balancing ready
- SSL: A+ rating encryption

## Security
- HTTPS only (Let's Encrypt certificates)
- Security groups (only 80, 443, 22)
- Environment variables for secrets
- Rate limiting enabled
- CORS configured

## Skills Demonstrated
- AWS cloud architecture
- Linux server administration
- Reverse proxy configuration
- SSL/TLS certificate management
- Production debugging
- CDN optimization
- Process management with PM2

## Lessons Learned
1. Always invalidate CloudFront cache after S3 updates
2. Test locally before deploying to production
3. Check PM2 logs for backend errors
4. Use security groups restrictively
5. Environment variables for configuration
6. Hard refresh browser to bypass cache

---

# AWS Deployment Guide - Vehicle Service Center

Complete step-by-step guide to deploy this application on AWS.

## Prerequisites

- AWS Account (Free Tier eligible)
- Domain or subdomain (I used DuckDNS free service)
- AWS CLI installed and configured
- Basic Linux knowledge

## Part 1: Backend Deployment (EC2)

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose **Ubuntu Server 24.04 LTS**
3. Instance type: **t3.micro** (Free Tier)
4. Create key pair (download .pem file)
5. Security Group:
   - SSH (22) - Your IP only
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
6. Launch instance
7. Allocate Elastic IP and associate with instance

### Step 2: Connect and Install Dependencies
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot (Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
```

### Step 3: Deploy Backend Code
```bash
# Clone your repository (or upload files)
git clone https://github.com/yourusername/vehicle-service-center.git
cd vehicle-service-center/backend

# Install dependencies
npm install

# Create .env file
nano .env
```

**`.env` configuration:**
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=https://your-cloudfront-url.cloudfront.net
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

**Start with PM2:**
```bash
pm2 start server.js --name vehicle-api
pm2 save
pm2 startup  # Follow the command it gives you
```

### Step 4: Configure Nginx Reverse Proxy
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/vehicle-api
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.duckdns.org;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/vehicle-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Set Up SSL Certificate
```bash
# Get Let's Encrypt certificate
sudo certbot --nginx -d your-domain.duckdns.org

# Follow prompts, choose to redirect HTTP to HTTPS
```

**Update server.js to trust proxy:**
```javascript
// Add after: const app = express();
app.set('trust proxy', true);
```

**Restart PM2:**
```bash
pm2 restart vehicle-api
```

---

## Part 2: Frontend Deployment (S3 + CloudFront)

### Step 1: Build Frontend
```bash
# On your local machine
cd frontend

# Create .env
echo "VITE_API_URL=https://your-backend-domain.duckdns.org" > .env

# Build
npm run build
```

### Step 2: Create S3 Bucket

1. AWS Console → S3 → Create Bucket
2. Name: `vehicle-service-frontend` (must be unique)
3. Uncheck "Block all public access"
4. Create bucket

**Enable static website hosting:**
1. Bucket → Properties → Static website hosting → Enable
2. Index document: `index.html`
3. Error document: `index.html`

**Add bucket policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::vehicle-service-frontend/*"
    }
  ]
}
```

### Step 3: Upload Files
```bash
# Upload build files
aws s3 sync dist/ s3://vehicle-service-frontend --delete
```

### Step 4: Create CloudFront Distribution

1. AWS Console → CloudFront → Create Distribution
2. Origin:
   - **Origin domain**: Use S3 **website endpoint** (not bucket)
   - Example: `vehicle-service-frontend.s3-website.eu-north-1.amazonaws.com`
   - **Origin type**: Other (not S3)
3. Default cache behavior:
   - Viewer protocol policy: Redirect HTTP to HTTPS
4. Custom error responses:
   - HTTP error code: 403 → Response page: `/index.html` → HTTP code: 200
   - HTTP error code: 404 → Response page: `/index.html` → HTTP code: 200
5. Create distribution

**Copy CloudFront URL** (e.g., `d1234567890.cloudfront.net`)

### Step 5: Update Backend CORS
```bash
# SSH into EC2
cd ~/vehicle-service-center/backend
nano .env
```

**Update CLIENT_URL:**
```env
CLIENT_URL=https://d1234567890.cloudfront.net
```

**Restart backend:**
```bash
pm2 restart vehicle-api
```

### Step 6: Invalidate CloudFront Cache

**After ANY frontend update:**
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## Verification

### Test Backend
```bash
curl https://your-domain.duckdns.org/api/auth/me
# Should return: {"message":"Not authorized, no token"}
```

### Test Frontend
1. Open: `https://your-cloudfront-url.cloudfront.net`
2. Register a new user
3. Check no CORS errors in Console (F12)

---

## Update Workflow

### Backend Updates
```bash
# SSH into EC2
cd ~/vehicle-service-center/backend
git pull origin main
npm install  # If dependencies changed
pm2 restart vehicle-api
pm2 logs vehicle-api
```

### Frontend Updates
```bash
# Local machine
cd frontend
npm run build
aws s3 sync dist/ s3://vehicle-service-frontend --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## Cost Estimate

- EC2 t3.micro: **Free Tier** (750 hours/month for 12 months)
- S3: **~$0.50/month** (for storage + requests)
- CloudFront: **Free Tier** (1TB data transfer out/month for 12 months)
- Let's Encrypt: **Free**
- DuckDNS: **Free**

**Total: ~$0.50-$2/month** during Free Tier

---

## Common Issues

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [PM2 Documentation](https://pm2.keymetrics.io/)

**Deployed by**: sahan samidhu saluwadana
**Date**: February 14, 2026
**Time Taken**: 1 week