import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const PORT = 3333;

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post('/users', async (req: Request, res: Response) => {
  const { name, email, whatsapp, idea, currentPhase } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        whatsapp,
        idea,
        currentPhase,
      },
    });

    console.log('Dados do usuário:', user);

    res.status(200).json({ message: 'Enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/users/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user) {
    res.status(404).json({ error: 'User not found.' });
  } else {
    res.status(200).json(user);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP Server Running in ${PORT}`);
});
