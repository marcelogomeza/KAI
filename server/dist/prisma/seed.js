"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Clear existing data (optional, useful for clean resets)
    await prisma.knowledgeRecord.deleteMany();
    await prisma.guide.deleteMany();
    await prisma.expert.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tag.deleteMany();
    console.log('Cleared existing data.');
    // create tags
    const tagReact = await prisma.tag.create({ data: { name: 'React' } });
    const tagNode = await prisma.tag.create({ data: { name: 'Node.js' } });
    const tagAI = await prisma.tag.create({ data: { name: 'AI' } });
    const tagCloud = await prisma.tag.create({ data: { name: 'Cloud' } });
    console.log('Created tags');
    // create users
    const user1 = await prisma.user.create({
        data: {
            email: 'alex.dev@kai.com',
            name: 'Alex Developer',
            role: 'EXPERT',
        }
    });
    const user2 = await prisma.user.create({
        data: {
            email: 'sarah.smith@kai.com',
            name: 'Sarah Smith',
            role: 'EXPERT',
        }
    });
    console.log('Created users');
    // create expert profiles
    await prisma.expert.create({
        data: {
            userId: user1.id,
            skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
            projects: ['KAI Frontend', 'Design System'],
            department: 'Frontend Engineering',
            level: 'Senior',
            contactEmail: 'alex.dev@kai.com'
        }
    });
    await prisma.expert.create({
        data: {
            userId: user2.id,
            skills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker'],
            projects: ['Auth Service', 'Data Pipeline'],
            department: 'Backend Engineering',
            level: 'Staff',
            contactEmail: 'sarah.smith@kai.com'
        }
    });
    console.log('Created experts');
    // create guides
    await prisma.guide.create({
        data: {
            title: 'Frontend Best Practices 2026',
            content: 'A comprehensive guide on styling with Tailwind CSS v4 and building modern UIs with React...',
            version: 'v2.1',
            department: 'Frontend Engineering',
            authorId: user1.id,
            tags: { connect: [{ id: tagReact.id }] }
        }
    });
    await prisma.guide.create({
        data: {
            title: 'Deploying Node.js to Railway',
            content: 'Steps to configure Dockerfile and railway.json for seamless deployments...',
            version: 'v1.0',
            department: 'DevOps',
            authorId: user2.id,
            tags: { connect: [{ id: tagNode.id }, { id: tagCloud.id }] }
        }
    });
    console.log('Created guides');
    // create knowledge record
    await prisma.knowledgeRecord.create({
        data: {
            title: 'AI Controllers Architecture Doc',
            summary: 'Design document for implementing OpenAI and Anthropic connectors via AIController.',
            contentUrl: 'https://docs.google.com/document/d/example123/edit',
            source: 'DRIVE',
            tags: { connect: [{ id: tagAI.id }, { id: tagNode.id }] }
        }
    });
    await prisma.knowledgeRecord.create({
        data: {
            title: 'Q3 Architectural Review',
            summary: 'Recording of the Q3 architecture review meeting with the Staff team.',
            contentUrl: 'https://s3.amazonaws.com/kai-bucket/q3-review.mp4',
            source: 'S3',
            tags: { connect: [{ id: tagCloud.id }] }
        }
    });
    console.log('Created knowledge records');
    console.log('Seed completed successfully 🌱');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
