import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from 'zod';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import * as fs from 'fs';
import util from 'util';
import { pipeline } from 'stream';

const app = fastify();
app.register(cors, {
  origin: '*',
});

app.register(multipart);

const pump = util.promisify(pipeline);

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
    discovery: z.string(),
    profileImage: z.string()
  });

  const upload = await request.file();
  if (!upload) {
    return reply.status(400).send({message: 'File is required.'});
  }

  await pump(upload.file, fs.createWriteStream(`./uploads/${upload.filename}`));
  
  const { 
    name,
    email,
    whatsapp,
    expectations,
    availability,
    discovery,
  } = createUsersSchema.parse(request.body);

  await prisma.user.create({
    data: {
      name,
      email,
      whatsapp,
      expectations,
      availability,
      discovery,
      profileImage: `./uploads/${upload.filename}`,
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
