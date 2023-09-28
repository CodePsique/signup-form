import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from 'zod';
import cors from '@fastify/cors';
import multer from 'fastify-multer';
import * as path from 'path';

declare module 'fastify' {
  interface FastifyRequest {
    file: {
      filename: string;
    };
  }
}

const app = fastify();
app.register(cors, {
  origin: '*',
});

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  },
});

const upload = multer({ storage });

app.get('/users', async () => {
  const users = await prisma.user.findMany();

  return { users };
});


app.post('/users', { preHandler: upload.single('profile') }, async (request, reply) => {
  try {
    const createUsersSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      whatsapp: z.string(),
      expectations: z.string(),
      availability: z.string(),
      discovery: z.string(),
    });

    const { 
      name,
      email,
      whatsapp,
      expectations,
      availability,
      discovery,
    } = createUsersSchema.parse(request.body);


    const profileImage = request.file.filename;

    await prisma.user.create({
      data: {
        name,
        email,
        whatsapp,
        expectations,
        availability,
        discovery,
        profileImage,
      },
    });

    reply.status(201).send();
  } catch (error) {
    if (error instanceof Error) {
      reply.status(500).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Erro desconhecido.' });
    }
  }
});

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
  console.log('HTTP Server Running');
});
