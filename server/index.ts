import express from 'express';
import dotenv from 'dotenv';
import emailRouter from './api/send-bulk-email';
import { cors } from './middleware/cors';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use the emailRouter directly
app.use('/api/send-bulk-email', emailRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 