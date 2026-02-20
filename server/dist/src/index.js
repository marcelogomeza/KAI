"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const client_1 = require("@prisma/client");
const AIController_1 = require("./controllers/AIController");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const aiController = new AIController_1.AIController();
const PORT = Number(process.env.PORT) || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});
// -- EXPERTS --
app.get('/api/experts', async (req, res) => {
    try {
        const experts = await prisma.expert.findMany({ include: { user: true } });
        res.json(experts);
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
        }
        else {
            responseText = await aiController.queryOpenAI(prompt);
        }
        res.json({ response: responseText });
    }
    catch (error) {
        res.status(500).json({ error: 'AI processing failed' });
    }
});
// -- SERVE STATIC CLIENT --
// Assuming structural deployment where client/dist is placed relative to server/dist
// In the Docker container, we are in /app/server/dist, and the client is in /app/client/dist
const clientDistPath = path_1.default.join(__dirname, '../../client/dist');
app.use(express_1.default.static(clientDistPath));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(clientDistPath, 'index.html'));
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
