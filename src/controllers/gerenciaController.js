import prisma from '../prismaClient.js';

// GET: /gerencias
export const getGerencias = async (req, res) => {
  try {
    const gerencias = await prisma.gerencia.findMany();
    res.json(gerencias);
  } catch (err) {
    console.error('Erro ao buscar gerências:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET: /funcionarios
export const getTodosFuncionarios = async (req, res) => {
  try {
    const funcionarios = await prisma.funcionarios.findMany({
      include: {
        ferias: {
          select: { PERIODO_AQUISITIVO_EM_ABERTO: true },
          orderBy: { PERIODO_AQUISITIVO_EM_ABERTO: 'desc' },
          take: 1,
        },
        gerencia: {
          select: { GERENCIA: true, SIGLA_GERENCIA: true },
        },
      },
    });

    const resultado = funcionarios.map((f) => {
      const ultimaFerias = f.ferias[0];
      return {
        MATRICULA_F: f.MATRICULA_F,
        NOME: f.NOME,
        GERENCIA: f.gerencia?.GERENCIA || '---',
        SIGLA_GERENCIA: f.gerencia?.SIGLA_GERENCIA || '---',
        PERIODO_AQUISITIVO_EM_ABERTO: ultimaFerias?.PERIODO_AQUISITIVO_EM_ABERTO || '---',
      };
    });

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    res.status(500).json({ error: 'Erro ao buscar funcionários.' });
  }
};


export const getFuncionariosComFerias = async (req, res) => {
  const siglaGerencia = req.params.sigla;

  if (!siglaGerencia) {
    return res.status(400).json({ error: 'Sigla da gerência inválida' });
  }

  try {
    const funcionarios = await prisma.funcionarios.findMany({
  include: {
    ferias: {
      select: {
        PERIODO_AQUISITIVO_EM_ABERTO: true,
      }
    },
    gerencia: {
  select: {
    GERENCIA: true,
    SIGLA_GERENCIA: true,
  }
    }
  }
});

    return res.json(
      funcionarios.map((f) => {
        const ultimaFerias = f.ferias[0]; // <- Ponto chave!
        return {
          MATRICULA_F: f.MATRICULA_F,
          NOME: f.NOME,
          GERENCIA: f.gerencia?.GERENCIA || '---',
          SIGLA_GERENCIA: f.SIGLA_GERENCIA,
          PERIODO_AQUISITIVO_EM_ABERTO: ultimaFerias?.PERIODO_AQUISITIVO_EM_ABERTO || '---',
        };
      })
    );
  } catch (error) {
    console.error('Erro ao buscar funcionários com férias:', error);
    return res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
};
// controllers/gerenciaController.js
export const getFuncionariosEmFerias = async (req, res) => {
  const currentYear = new Date().getFullYear().toString(); // ex.: "2025"

  try {
    let gozoFerias = await prisma.ferias_gozo.findMany({
      where: { ANO: currentYear },
      select: {
        MATRICULA_F: true,
        MES: true,
        ANO: true,
        TIPO: true,
        PERIODO_AQUISITIVO: true, // <- ESSENCIAL
      },
      orderBy: {
        MES: 'asc',
      },
    });

    // Se não encontrar nenhum no ano atual, busca do próximo ano
    if (gozoFerias.length === 0) {
      gozoFerias = await prisma.ferias_gozo.findMany({
        where: { ANO: (parseInt(currentYear) + 1).toString() },
        select: {
          MATRICULA_F: true,
          MES: true,
          ANO: true,
          TIPO: true,
          PERIODO_AQUISITIVO: true, // <- também aqui!
        },
        orderBy: {
          MES: 'asc',
        },
      });
    }

    res.json(gozoFerias);
  } catch (error) {
    console.error('Erro ao buscar gozo:', error);
    res.status(500).json({ error: 'Erro ao buscar gozo.' });
  }
};
