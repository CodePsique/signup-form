const express = require("express");
import { Request, Response } from 'express';
const multer = require('multer');
import { Multer } from 'multer';
import * as path from "path";
const cors =  require("cors");
import { PrismaClient } from "@prisma/client";
import * as AWS from 'aws-sdk';
import * as fs from 'fs';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const app = express();
const PORT = 3333;

const prisma = new PrismaClient();

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: 'us-east-2'
});

const s3 = new AWS.S3();

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
    let s3ImageUrl = null;

    if (profileImage) {
      const s3Params = {
        Bucket: 'codepsique-group',
        Key: `images/${profileImage.filename}`,
        Body: fs.createReadStream(profileImage.path),
      };

      await s3.upload(s3Params).promise();

      s3ImageUrl = `https://s3://codepsique-group/${s3Params.Key}`;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        whatsapp,
        expectations,
        discovery,
        availability,
        profileImage: s3ImageUrl,
      },
    });

    console.log("Dados do usuário:", user);

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
      id: id
    }
  });
  if (!user) {
    res.status(404).json({ error: "User not found." });
  } else if (user.profileImage) {
    res.sendFile(user.profileImage, { root: "." });
  } else {
    res.status(404).json({ error: "Image not found." });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  });
  if (!user) {
    res.status(404).json({ error: "User not found." });
  } else {
    res.status(200).json(user);
  }
});

app.listen(
  process.env.PORT ? Number(process.env.PORT) : PORT,
  '0.0.0.0',
  () => {
    console.log(`HTTP Server Running in ${PORT}`);
  }
);
