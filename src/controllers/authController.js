import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post('/login', async (req, res) => {
  const { matricula, senha } = req.body;

  if (!matricula || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }

  try {
    const user = await prisma.cadastro.findUnique({
      where: { matricula },
    });

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    // ✅ Sem token aqui!
    return res.status(200).json({
      message: "Login realizado com sucesso.",
      nome: user.nome,
      tipo: user.id_tipo_user,
      matricula: user.matricula,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});
