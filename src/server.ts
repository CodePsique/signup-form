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

const publicFolderPath = path.join(__dirname, 'src');

app.get('/', (request, reply) => {
  const indexPath = path.join(publicFolderPath, 'index.html');
  
  // Leia o conteúdo do arquivo
  fs.readFile(indexPath, 'utf-8', (err, fileContent) => {
    if (err) {
      // Se ocorrer um erro ao ler o arquivo, envie uma resposta de erro
      reply.status(500).send('Internal Server Error');
      return;
    }

    // Envie o conteúdo do arquivo HTML como resposta
    reply.type('text/html').send(fileContent);
  });
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

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
  console.log('HTTP Server Running')
})