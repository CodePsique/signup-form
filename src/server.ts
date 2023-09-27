import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { promises as fsPromises } from 'fs';
import path from 'path';
import { z } from 'zod';
import cors from '@fastify/cors';

const app = fastify();
app.register(cors, {
  origin: '*',
});

const prisma = new PrismaClient()

app.get('/users', async () => {
  const users = await prisma.user.findMany();

  return { users };
})

app.post('/users', async (request, reply) => {
  const createUsersSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    whatsapp: z.string(),
    expectations: z.string(),
    availability: z.string(),
    discovery: z.string()
  });

  const { 
    name,
    email,
    whatsapp,
    expectations,
    availability,
    discovery 
  } = createUsersSchema.parse(request.body);

  await prisma.user.create({
    data: {
      name,
      email,
      whatsapp,
      expectations,
      availability,
      discovery
    }
  });

  return reply.status(201).send();
})

app.get('/', async (request, reply) => {
  try {
    const htmlContent = await fsPromises.readFile(path.join(__dirname, 'src', 'index.html'), 'utf8');
    reply.type('text/html').send(htmlContent);
  } catch (error) {
    console.error('Erro ao ler arquivo HTML:', error);
    reply.status(500).send('Erro interno do servidor');
  }
});

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
  console.log('HTTP Server Running')
})
