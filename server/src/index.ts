console.log('[DEBUG] 1. Starting execution of index.ts');

import express from 'express';
console.log('[DEBUG] 2. Express imported');
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { AIController } from './controllers/AIController';

console.log('[DEBUG] 3. Modules imported');

dotenv.config();
console.log('[DEBUG] 4. dotenv configured. PORT from env:', process.env.PORT);

process.on('uncaughtException', (err) => {
    console.error('[FATAL] Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
console.log('[DEBUG] 5. Express app initialized');

let prisma: PrismaClient | null = null;
let aiController: AIController | null = null;
let dbConnected = false;

// --- EARLY HEALTH CHECK & LOGGING ---
app.use((req, res, next) => {
    console.log(`[REQUEST] ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint - MOVED TO TOP to bypass other middleware
app.get('/api/health', (req, res) => {
    console.log('[HEALTH] Responding to /api/health');
    res.status(200).json({
        status: 'ok',
        timestamp: new Date(),
        database: dbConnected ? 'connected' : 'disconnected',
        env: process.env.NODE_ENV,
        cwd: process.cwd(),
        uptime: process.uptime()
    });
});

const PORT = Number(process.env.PORT) || 3001;
console.log(`[DEBUG] 6. Target PORT identified: ${PORT} (Type: ${typeof PORT})`);

// Standard Middleware
app.use(cors());
app.use(express.json());

// Initialize services safely
async function initializeServices() {
    console.log('[DEBUG] 7. Starting initializeServices');
    try {
        console.log('[DEBUG] 8. Creating PrismaClient');
        prisma = new PrismaClient();
        console.log('[DEBUG] 9. Creating AIController');
        aiController = new AIController();

        // Test connection
        console.log('[DEBUG] 10. Testing DB connection...');
        await prisma.$queryRaw`SELECT 1`;
        dbConnected = true;
        console.log('[✓] Database connection successful');
    } catch (error) {
        console.error('[⚠] Database connection failed:', error);
        dbConnected = false;
        // Don't exit - allow server to start for health checks
    }
}

// Graceful database error handler middleware
app.use((req, res, next) => {
    if (!dbConnected && req.path.startsWith('/api') && req.path !== '/api/health') {
        return res.status(503).json({
            error: 'Database service temporarily unavailable',
            message: 'Waiting for database connection...'
        });
    }
    next();
});

// -- EXPERTS --
app.get('/api/experts', async (req, res) => {
    if (!prisma) {
        return res.status(503).json({ error: 'Service not initialized' });
    }
    try {
        const experts = await prisma.expert.findMany({ include: { user: true } });
        res.json(experts);
    } catch (error) {
        console.error('Error fetching experts:', error);
        res.status(500).json({ error: 'Failed to fetch experts' });
    }
});

// -- GUIDES --
app.get('/api/guides', async (req, res) => {
    if (!prisma) {
        return res.status(503).json({ error: 'Service not initialized' });
    }
    try {
        const guides = await prisma.guide.findMany({
            include: { author: true, tags: true },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(guides);
    } catch (error) {
        console.error('Error fetching guides:', error);
        res.status(500).json({ error: 'Failed to fetch guides' });
    }
});

// -- KNOWLEDGE (Recent) --
app.get('/api/knowledge/recent', async (req, res) => {
    if (!prisma) {
        return res.status(503).json({ error: 'Service not initialized' });
    }
    try {
        const records = await prisma.knowledgeRecord.findMany({
            include: { tags: true },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        res.json(records);
    } catch (error) {
        console.error('Error fetching knowledge records:', error);
        res.status(500).json({ error: 'Failed to fetch knowledge records' });
    }
});

// -- SEARCH --
app.get('/api/search', async (req, res) => {
    if (!prisma) {
        return res.status(503).json({ error: 'Service not initialized' });
    }
    const { q, tags } = req.query;
    try {
        const queryStr = q ? String(q) : '';
        const records = await prisma.knowledgeRecord.findMany({
            where: {
                OR: [
                    { title: { contains: queryStr, mode: 'insensitive' } },
                    { summary: { contains: queryStr, mode: 'insensitive' } },
                ]
            },
            include: { tags: true }
        });
        res.json(records);
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// -- AI CHAT --
app.post('/api/chat', async (req, res) => {
    if (!aiController) {
        return res.status(503).json({ error: 'AI service not initialized' });
    }
    const { prompt, model = 'openai' } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        let responseText = '';
        if (model === 'anthropic') {
            responseText = await aiController.queryAnthropic(prompt);
        } else {
            responseText = await aiController.queryOpenAI(prompt);
        }
        res.json({ response: responseText });
    } catch (error) {
        console.error('Error processing chat:', error);
        res.status(500).json({ error: 'AI processing failed' });
    }
});

// -- SERVE STATIC CLIENT --
const clientDistPath = path.join(process.cwd(), '../client/dist');
app.use(express.static(clientDistPath));

app.get('(.*)', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
});

console.log('[DEBUG] 11. Middleware configured. About to listen...');

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[READY] Server is actually running on port ${PORT}`);
    console.log(`[Ready] Interface: 0.0.0.0`);
    console.log(`[Ready] Local Health: http://localhost:${PORT}/api/health`);
});

server.on('error', (error) => {
    console.error('[FATAL] Server failed to bind or listen:', error);
    process.exit(1);
});

// Initialize services asynchronously
initializeServices().catch((error) => {
    console.error('[ERROR] Failed to initialize services:', error);
});

console.log('[DEBUG] 12. End of index.ts script reached');
