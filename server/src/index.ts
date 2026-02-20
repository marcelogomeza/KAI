import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { AIController } from './controllers/AIController';

dotenv.config();

const app = express();
const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
});
const aiController = new AIController();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// -- EXPERTS --
app.get('/api/experts', async (req, res) => {
    try {
        const experts = await prisma.expert.findMany({ include: { user: true } });
        res.json(experts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch experts' });
    }
});

// -- GUIDES --
app.get('/api/guides', async (req, res) => {
    try {
        const guides = await prisma.guide.findMany({
            include: { author: true, tags: true },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(guides);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch guides' });
    }
});

// -- KNOWLEDGE (Recent) --
app.get('/api/knowledge/recent', async (req, res) => {
    try {
        const records = await prisma.knowledgeRecord.findMany({
            include: { tags: true },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch knowledge records' });
    }
});

// -- SEARCH & P&R --
app.get('/api/search', async (req, res) => {
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
        res.status(500).json({ error: 'Search failed' });
    }
});

// -- AI CHAT --
app.post('/api/chat', async (req, res) => {
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
        res.status(500).json({ error: 'AI processing failed' });
    }
});

// -- SERVE STATIC CLIENT --
// Assuming structural deployment where client/dist is placed relative to server/dist
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
