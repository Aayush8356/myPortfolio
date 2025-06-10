import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Use memory storage for Vercel Blob upload
const storage = multer.memoryStorage();

// Configure storage for project images - also use memory storage
const projectImageStorage = multer.memoryStorage();

// File filter for PDFs only
const fileFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// File filter for project images (common image formats)
const imageFileFilter = (_req: any, file: any, cb: any) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

export const uploadResume = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

export const uploadProjectImage = multer({
  storage: projectImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Fallback to local storage for development
const uploadsDir = path.join(__dirname, '../../uploads');
const projectImagesDir = path.join(uploadsDir, 'projects');

// Ensure uploads directory exists in development
if (process.env.NODE_ENV !== 'production') {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(projectImagesDir)) {
    fs.mkdirSync(projectImagesDir, { recursive: true });
  }
}