import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

import documentsRoutes from './modules/documents/documents.routes';
import { initMinio } from './storage/minio';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentsRoutes);

// Base health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, async () => {
    try {
        await initMinio();
        console.log(`KAI Backend MVP running on port ${PORT}`);
    } catch (error) {
        console.error('Failed to initialize Storage:', error);
    }
});
