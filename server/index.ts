import express from 'express';
import dotenv from 'dotenv';
import emailRouter from './api/send-bulk-email';
import { cors } from './middleware/cors';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add this before your routes
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    body: req.body
  });
  next();
});

// Use the emailRouter directly
app.use('/api/send-bulk-email', emailRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 