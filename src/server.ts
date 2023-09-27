import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import fastifyCors from 'fastify-cors';
import fastifyStatic from 'fastify-static';
import path from 'path';

const app = fastify();

// Registrar o plugin de CORS
app.register(fastifyCors, {
  origin: '*',
});

const prisma = new PrismaClient();

// Configurar a pasta para servir arquivos estáticos
app.register(fastifyStatic, {
  root: path.join(__dirname, '/src'), // Substitua 'public' pelo nome da pasta onde estão seus arquivos estáticos
  wildcard: false, // Defina como false se você não quiser que arquivos não encontrados disparem uma resposta 404
});

// Rota para a página inicial (index.html)
app.get('/', (request, reply) => {
  // O arquivo 'index.html' será servido automaticamente pela rota raiz devido à configuração do fastify-static.
  // Não é necessário especificar sendFile aqui.
  reply.send();
});

// Suas rotas existentes para o backend
app.get('/users', async (request, reply) => {
  const users = await prisma.user.findMany();
  return { users };
});

app.post('/users', async (request, reply) => {
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

  await prisma.user.create({
    data: {
      name,
      email,
      whatsapp,
      expectations,
      availability,
      discovery,
    },
  });

  return reply.status(201).send();
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`HTTP Server Running on Port ${PORT}`);
});
