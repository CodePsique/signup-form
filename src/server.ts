import * as express from "express";
import { Request, Response } from 'express';
const multer = require('multer');
import { Multer } from 'multer';
import * as path from "path";
const cors =  require("cors");
import { PrismaClient } from "@prisma/client";

const app = express.default();
const PORT = 3333;

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
    cb(null, path.join(__dirname, "images"));
  },
  filename: (req: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload: Multer = multer({ storage: storage });

app.use(cors());
app.use(express.json());

app.post("/users", upload.single("profileImage"), async (req: Request, res: Response) => {
  const { name, email, whatsapp, expectations, discovery, availability } = req.body;
  const profileImage = req.file;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        whatsapp,
        expectations,
        discovery,
        availability,
        profileImage: profileImage ? `src/images/${profileImage.filename}` : null,
      },
    });

    console.log("Dados do usuário:", user);
    console.log(profileImage);

    res.status(200).json({ message: "Inscrição enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/users/:id/image", async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if(user === null || user === undefined) {
    res.status(404).json({ error: "User not found."})
  } else {
    res.sendFile(user.profileImage as string, { root: "."});
  }
})

app.get("/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if(user === null || user === undefined) {
    res.status(404).json({ error: "User not found."})
  } else {
    res.status(200).json(user);
  }
})

app.listen(
  process.env.PORT ? Number(process.env.PORT) : 3333,
  '0.0.0.0',
  () => {
    console.log('HTTP Server Running');
  }
);
