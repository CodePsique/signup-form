import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';

const app = fastify();

// Habilitar CORS manualmente
app.addHook('onRequest', (req, reply, done) => {
  // Permite todas as origens (não recomendado para produção)
  reply.header('Access-Control-Allow-Origin', '*');
  // Configura outros cabeçalhos CORS conforme necessário
  reply.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  done();
});

const prisma = new PrismaClient();

// Defina o caminho para a pasta onde estão seus arquivos estáticos
const staticFolderPath = path.join(__dirname, 'src'); // Substitua 'public' pelo nome da pasta onde estão seus arquivos estáticos

// Rota para a página inicial (index.html)
app.get('/', (request, reply) => {
  const indexPath = path.join(staticFolderPath, '/src/index.html');

  // Verifique se o arquivo 'index.html' existe e, em seguida, envie-o
  if (fs.existsSync(indexPath)) {
    const fileContent = fs.readFileSync(indexPath, 'utf-8');
    reply.type('text/html').send(fileContent);
  } else {
    reply.status(404).send('File not found');
  }
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
