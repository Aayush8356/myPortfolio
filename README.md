# Modern Portfolio with Admin Panel

A full-stack portfolio application built with React, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

### Frontend
- **Modern Design**: Clean, responsive UI using Tailwind CSS and ShadcnUI components
- **Dark/Light Mode**: Toggle between themes with persistent storage
- **Dynamic Clock**: macOS-style clock with color changes based on time of day
- **Smooth Scrolling**: Navigation between sections
- **Resume Preview/Download**: Built-in PDF viewer and download functionality

### Portfolio Sections
- **Hero**: Eye-catching landing section with call-to-action buttons
- **About**: Personal information and skills showcase
- **Projects**: Dynamic project gallery with technology tags
- **Contact**: Contact form with backend integration
- **Fun Centre**: Interactive mini-games (Tic-tac-toe, Memory game)

### Admin Panel
- **Secure Authentication**: JWT-based admin login system
- **Project Management**: Add, edit, delete, and feature projects
- **Contact Management**: View and manage contact form submissions
- **Real-time Updates**: Changes reflect immediately on the portfolio

### Backend
- **RESTful API**: Express.js server with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **CORS**: Configured for frontend-backend communication

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- ShadcnUI Components
- Lucide React Icons

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio-aayush
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Create admin user
   npm run seed
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # If Tailwind issues occur, run:
   rm -rf node_modules package-lock.json
   npm install
   
   # Start development server
   npm start
   ```

4. **MongoDB Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in `backend/.env`
   - Default: `mongodb://localhost:27017/portfolio`

### Troubleshooting

#### Tailwind CSS Issues
If Tailwind styles aren't working:

1. **Check Configuration**: Ensure `tailwind.config.js` and `postcss.config.js` are in the frontend directory
2. **Clean Install**: 
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```
3. **Verify Build**: Run `npm run build` to check if CSS is generated properly
4. **Version Check**: Ensure Tailwind v3.x is installed (not v4)

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### Default Admin Credentials

After running `npm run seed`:
- **Email**: username
- **Password**: admin password

## Usage

### Running the Application

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

3. **Access the Application**:
   - Portfolio: http://localhost:3000
   - Admin Panel: Click "Admin" in footer or press `Ctrl+Alt+A`

### Admin Features

- **Access Admin Panel**: Use the admin button in footer or keyboard shortcut `Ctrl+Alt+A`
- **Manage Projects**: Add, edit, delete, and feature projects
- **View Messages**: Read and manage contact form submissions
- **Logout**: Use the logout button or press `Ctrl+Alt+A` while logged in

### Customization

1. **Update Personal Information**:
   - Edit `frontend/src/components/Hero.tsx` for main heading
   - Edit `frontend/src/components/About.tsx` for personal details
   - Edit `frontend/src/components/Contact.tsx` for contact information

2. **Add Your Resume**:
   - Replace `frontend/public/resume.pdf` with your actual resume

3. **Customize Styling**:
   - Modify `frontend/src/index.css` for global styles
   - Update Tailwind configuration in `tailwind.config.js`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (admin only)
- `PUT /api/contact/:id/read` - Mark message as read (admin only)
- `DELETE /api/contact/:id` - Delete message (admin only)

## Production Deployment

### Backend Deployment
1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Use PM2 or similar for process management
4. Configure reverse proxy (nginx)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Serve static files with nginx or similar
3. Configure API endpoints for production

### Database
- Use MongoDB Atlas for cloud hosting
- Set up proper database indexes
- Configure backup strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For questions or issues:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

---

**Happy coding!** 🚀
