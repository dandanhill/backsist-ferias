import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const saltRounds = 10;

app.use(express.json());

// Rota POST para cadastro de usuário
app.post('/register', async (req, res) => {
  const { matricula, senha, nome, email } = req.body;

  if (!matricula || !senha || !nome || !email) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // Cria o usuário no banco de dados
    const user = await prisma.cadastro.create({
      data: {
        matricula,
        senha: hashedPassword, // Senha criptografada
        nome,
        email,
      },
    });

    res.status(201).json({ message: 'Usuário criado com sucesso!', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o usuário. Tente novamente.' });
  }
});

// Rota POST para login de usuário
app.post('/login', async (req, res) => {
  const { matricula, senha } = req.body;

  if (!matricula || !senha) {
    return res.status(400).json({ error: 'Por favor, forneça matrícula e senha.' });
  }

  try {
    // Procura o usuário no banco de dados pela matrícula
    const user = await prisma.cadastro.findUnique({
      where: { matricula },
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    // Compara a senha fornecida com a senha criptografada no banco
    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Senha incorreta.' });
    }

    // Retorna os dados do usuário autenticado (sem a senha)
    const { senha: userPassword, ...userData } = user;
    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao tentar fazer login. Tente novamente.' });
  }
});

// Inicializando o servidor
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
