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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

import documentsRoutes from './modules/documents/documents.routes';
import usersRoutes from './modules/users/users.routes';
import rolesRoutes from './modules/roles/roles.routes';
import orgStructureRoutes from './modules/org-structure/org-structure.routes';
import settingsRoutes from './modules/settings/settings.routes';
import { initMinio } from './storage/minio';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/org-structure', orgStructureRoutes);
app.use('/api/settings', settingsRoutes);

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
