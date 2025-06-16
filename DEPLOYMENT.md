# Portfolio Deployment Guide

This guide will help you deploy your full-stack portfolio to GitHub and various hosting platforms.

## 📋 Pre-deployment Checklist

### 1. Update API URLs in Frontend
Before deploying, update the API URLs in your React components to point to your deployed backend:

**Files to update:**
- `frontend/src/components/Projects.tsx` (line 27)
- `frontend/src/components/Contact.tsx` (line 27)

Replace `http://localhost:5002/api` with your deployed backend URL.

### 2. Environment Variables
Ensure you have the following environment variables set:

**Backend (.env):**
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

**Note:** For file uploads to persist in production, you need to set up Vercel Blob storage and provide the `BLOB_READ_WRITE_TOKEN`. Without this token, uploads will fall back to local storage (which doesn't persist in serverless environments).

### 3. Vercel Blob Setup (Required for File Uploads)
To enable persistent file uploads in production:

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to "Storage" tab
4. Create a new Blob store
5. Copy the `BLOB_READ_WRITE_TOKEN` from the store settings
6. Add it to your environment variables in Vercel

**Alternative Storage Options:**
- AWS S3: Replace Vercel Blob with S3 SDK
- Cloudinary: Use for image optimization and storage
- Google Cloud Storage: Enterprise-grade file storage

## 🚀 Deployment Options

### Option 1: Deploy to Vercel (Recommended)

#### Backend Deployment:
1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm install -g vercel`
3. Navigate to backend folder: `cd backend`
4. Run: `vercel`
5. Follow the prompts and set environment variables in Vercel dashboard

#### Frontend Deployment:
1. Update API URLs in frontend to point to your Vercel backend
2. Navigate to frontend folder: `cd frontend`
3. Run: `vercel`
4. Follow the prompts

### Option 2: Deploy to Netlify + Railway

#### Backend (Railway):
1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the backend folder
4. Set environment variables in Railway dashboard
5. Deploy

#### Frontend (Netlify):
1. Create account at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `frontend/build`
5. Update `netlify.toml` with your Railway backend URL

### Option 3: Deploy to Heroku

#### Backend:
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-portfolio-api`
3. Set environment variables: `heroku config:set MONGODB_URI=your_uri`
4. Deploy: `git push heroku main`

#### Frontend:
1. Build the app: `npm run build`
2. Deploy to Netlify or Vercel

## 🗃️ Database Setup

### MongoDB Atlas (Recommended):
1. Create account at [mongodb.com](https://mongodb.com)
2. Create a new cluster
3. Get connection string
4. Add to your environment variables
5. Whitelist your deployment platform IPs

### Local MongoDB:
- Not recommended for production
- Use MongoDB Atlas or other cloud providers

## 📱 GitHub Repository Setup

### 1. Initialize Git Repository:
```bash
cd portfolio-aayush
git init
git add .
git commit -m "Initial commit: Full-stack portfolio with dark theme"
```

### 2. Create GitHub Repository:
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it "portfolio" or "full-stack-portfolio"
4. Don't initialize with README (you already have files)
5. Copy the repository URL

### 3. Connect Local to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## ⚠️ DEPLOYMENT FIX - RENDER CONFIGURATION

### Current Issue: Status 127 Error on Render

The backend deployment on Render is failing because it's trying to run `npm run dev` (which uses nodemon) instead of production commands.

### Fix for Render Dashboard:

**In your Render service settings, configure:**

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm start
```

**Environment Variables:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/portfolio
JWT_SECRET=your_super_secret_jwt_key_here
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
PORT=10000
```

**Health Check Path:**
```
/health
```

### Package.json Updates Applied:
- Moved TypeScript and type definitions to production dependencies
- Added `postinstall` script that runs build automatically
- Fixed main entry point to `dist/index.js`

## 🔧 Environment Configuration

### Frontend Environment Variables:
Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_ENV=production
```

### Backend Environment Variables:
Ensure these are set in your hosting platform:
```
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/portfolio
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.com
```

## 🔒 Security Considerations

1. **Never commit .env files** - They're in .gitignore
2. **Use strong JWT secrets** - Generate random 64+ character strings
3. **Whitelist domains** - Configure CORS properly
4. **Database security** - Use MongoDB Atlas with IP whitelisting
5. **Environment variables** - Set securely in hosting platforms

## 📝 Post-Deployment Steps

1. **Test all functionality**:
   - User registration/login
   - Project CRUD operations
   - Contact form submission
   - Admin panel access

2. **Update README.md** with:
   - Live demo links
   - Screenshots
   - Installation instructions
   - API documentation

3. **Monitor performance**:
   - Check loading times
   - Monitor API response times
   - Set up error tracking

## 🛠️ Troubleshooting

### Common Issues:

**CORS Errors:**
- Update CORS configuration in backend
- Add frontend URL to allowed origins

**API Connection Issues:**
- Verify backend URL in frontend
- Check environment variables
- Ensure backend is deployed and running

**Database Connection:**
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Railway Documentation](https://docs.railway.app)

## 🎉 Congratulations!

Once deployed, your portfolio will be live and accessible to the world! Don't forget to:
- Share the live URL on your resume
- Add it to your LinkedIn profile
- Include it in job applications
- Keep it updated with new projects

---

**Need help?** Check the deployment logs on your hosting platform or refer to their documentation for platform-specific guidance.