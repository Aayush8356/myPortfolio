# MongoDB Atlas Setup Guide

This guide will walk you through setting up MongoDB Atlas for your portfolio project.

## 📋 Step 1: Create MongoDB Atlas Account

### 1.1 Sign Up
1. Go to [https://mongodb.com](https://mongodb.com)
2. Click **"Try Free"** or **"Sign Up"**
3. Choose one of these options:
   - **Email/Password** (recommended)
   - **Google Account**
   - **GitHub Account**
4. Fill in your details and verify your email

### 1.2 Account Setup
1. Choose **"I'm learning MongoDB"** when asked about your goal
2. Select **"JavaScript"** as your preferred language
3. Choose **"I'm building a web application"**

## 🗄️ Step 2: Create Your First Cluster

### 2.1 Create Cluster
1. Once logged in, you'll see the "Create a deployment" page
2. Choose **"M0 Sandbox"** (FREE tier)
3. **Cloud Provider**: AWS (recommended) or Google Cloud
4. **Region**: Choose closest to your location or users
5. **Cluster Name**: `portfolio-cluster` (or any name you prefer)
6. Click **"Create Deployment"**

⏱️ **Wait**: Cluster creation takes 3-7 minutes

### 2.2 Cluster Configuration
Your cluster will include:
- **RAM**: 512 MB
- **Storage**: 5 GB
- **Shared vCPU**
- **Free forever** (no credit card required)

## 🔐 Step 3: Configure Security

### 3.1 Database User
1. You'll see a "Security Quickstart" modal
2. **Authentication Method**: Username and Password
3. **Username**: `portfolioAdmin` (or your choice)
4. **Password**: Click "Autogenerate Secure Password" or create your own
   - **IMPORTANT**: Copy and save this password securely!
5. Click **"Create User"**

### 3.2 Network Access (IP Whitelist)
1. **Add IP Address**: Choose one option:
   
   **Option A - My Local Environment (Development):**
   - Click "Add My Current IP Address"
   - This allows access from your current location
   
   **Option B - Cloud Access (Production):**
   - Click "Allow Access from Anywhere"
   - IP Address: `0.0.0.0/0`
   - ⚠️ **Note**: Less secure but needed for hosting platforms
   
   **Option C - Specific IPs (Most Secure):**
   - Add specific IPs for your hosting platform
   - Vercel: Multiple IPs (check their docs)
   - Netlify: Multiple IPs (check their docs)

2. Click **"Add Entry"**
3. Click **"Finish and Close"**

## 🔗 Step 4: Get Connection String

### 4.1 Access Connection String
1. Go to your cluster dashboard
2. Click **"Connect"** button
3. Choose **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. Copy the connection string

### 4.2 Connection String Format
Your connection string will look like:
```
mongodb+srv://<username>:<password>@portfolio-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 4.3 Update Connection String
Replace placeholders:
- `<username>`: Your database username
- `<password>`: Your database password
- Add database name: `/portfolio`

**Final format:**
```
mongodb+srv://portfolioAdmin:YOUR_PASSWORD@portfolio-cluster.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

## 📊 Step 5: Database Structure

Your portfolio app will automatically create these collections:
- **users** - Admin authentication
- **projects** - Portfolio projects
- **contacts** - Contact form submissions

### 5.1 Verify Collections (After First Use)
1. Go to **"Browse Collections"** in Atlas
2. Select your database (`portfolio`)
3. You should see collections after running your app

## 🔧 Step 6: Environment Configuration

### 6.1 Update Backend Environment
Create/update `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://portfolioAdmin:YOUR_PASSWORD@portfolio-cluster.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_64_characters_long_for_security
NODE_ENV=development
```

### 6.2 For Production Deployment
Add the same `MONGODB_URI` to your hosting platform's environment variables:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Railway**: Variables tab
- **Heroku**: Config Vars

## 🧪 Step 7: Test Connection

### 7.1 Local Testing
```bash
cd backend
npm run dev
```

Look for: `"Connected to MongoDB"` in console

### 7.2 Create Admin User
```bash
cd backend
npm run seed
```

Should output: `"Admin user created successfully"`

### 7.3 Test API Endpoints
Use browser or Postman:
- `GET http://localhost:5002/api/projects` - Should return empty array
- `POST http://localhost:5002/api/auth/login` - Test admin login

## 📈 Step 8: Monitor Your Database

### 8.1 Atlas Dashboard Features
1. **Metrics**: Database performance
2. **Real-time**: Live connection monitoring  
3. **Collections**: Browse your data
4. **Users**: Manage database users
5. **Network Access**: Manage IP whitelist

### 8.2 Usage Monitoring
Free tier limits:
- **Storage**: 5 GB
- **Data Transfer**: 10 GB/month
- **Connections**: 500 max

## 🚨 Step 9: Security Best Practices

### 9.1 Connection Security
- ✅ Use strong passwords (12+ characters)
- ✅ Enable IP whitelisting when possible
- ✅ Use environment variables (never commit credentials)
- ✅ Rotate passwords periodically

### 9.2 Database Security
- ✅ Create application-specific users
- ✅ Use least privilege access
- ✅ Monitor access logs
- ✅ Enable MongoDB Atlas alerts

## 🔄 Step 10: Backup & Recovery

### 10.1 Automatic Backups
Free tier includes:
- **Point-in-time recovery**: Last 2 days
- **Snapshot frequency**: Every 6 hours
- **Retention**: 2 days

### 10.2 Manual Backup
1. Go to **"Backup"** tab in Atlas
2. Click **"Take Snapshot Now"**
3. Download if needed

## 🛠️ Troubleshooting

### Common Issues:

**Connection Timeout:**
- Check IP whitelist
- Verify username/password
- Check network connectivity

**Authentication Failed:**
- Double-check username/password
- Ensure user has proper database permissions
- Check for special characters in password (URL encode if needed)

**Network Error:**
- Verify connection string format
- Check if cluster is running
- Ensure proper network access configuration

**Database Not Found:**
- Database will be created automatically on first connection
- Ensure database name is specified in connection string

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Options](https://docs.mongodb.com/manual/reference/connection-string/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- [Security Best Practices](https://docs.atlas.mongodb.com/security/)

## ✅ Verification Checklist

Before deployment, ensure:
- [ ] Cluster is created and running
- [ ] Database user is created with strong password
- [ ] IP whitelist is configured properly
- [ ] Connection string is saved securely
- [ ] Environment variables are set
- [ ] Local connection is tested
- [ ] Admin user is created via seed script
- [ ] API endpoints respond correctly

## 🎉 You're Ready!

Your MongoDB Atlas database is now configured and ready for your portfolio deployment. The database will automatically scale with your application and provide reliable cloud storage for your portfolio data.

---

**Next Steps**: Update your hosting platform's environment variables with the MongoDB connection string and deploy your application!