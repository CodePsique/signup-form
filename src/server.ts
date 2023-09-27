import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from 'zod';
import cors from '@fastify/cors';
import * as fs from 'fs';
import * as path from 'path';


const app = fastify();
app.register(cors, {
  origin: '*',
});

const prisma = new PrismaClient()

const publicFolderPath = path.join(__dirname, './');

app.get('/', (request, reply) => {
  const indexPath = path.join(publicFolderPath, 'index.html');

  fs.readFile(indexPath, 'utf-8', (err, fileContent) => {
    if (err) {
      reply.status(500).send('Internal Server Error');
      return;
    }
    reply.type('text/html').send(fileContent);
  });
});


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

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
  console.log('HTTP Server Running')
})
