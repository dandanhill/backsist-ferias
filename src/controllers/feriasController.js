import prisma from '../prismaClient.js';

// Busca os períodos válidos para um usuário (matricula)
export const getPeriodosValidos = async (req, res) => {
  const { matricula } = req.params;

  try {
    const periodos = await prisma.ferias.findMany({
    where: {
     MATRICULA_SEM_PONTO: matricula,
  },
  select: {
    PERIODO_AQUISITIVO_EM_ABERTO: true,
  },
});


const periodosValidos = periodos.filter(p =>
  /^\d{4}\/\d{4}$/.test(p.PERIODO_AQUISITIVO_EM_ABERTO)
);
    return res.json(periodosValidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

// Criar uma nova solicitação de férias
export const criarSolicitacaoFerias = async (req, res) => {
  const {
    matricula,
    periodo_aquisitivo,
    tipo,
    mes,
    ano,
    saldo
  } = req.body;

  if (!matricula || !periodo_aquisitivo || !tipo || !mes || !ano || !saldo) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  try {
    // Verifica se o período existe na tabela ferias
    const feriasExistente = await prisma.ferias.findUnique({
      where: {
        MATRICULA_SEM_PONTO_PERIODO_AQUISITIVO_EM_ABERTO: {
          MATRICULA_SEM_PONTO: matricula,
          PERIODO_AQUISITIVO_EM_ABERTO: periodo_aquisitivo
        }
      }
    });

    if (!feriasExistente) {
      return res.status(404).json({ error: 'Período aquisitivo não encontrado para essa matrícula' });
    }

    const novaSolicitacao = await prisma.solicitacao_ferias.create({
      data: {
        MATRICULA: matricula,
        PERIODO_AQUISITIVO: periodo_aquisitivo,
        TIPO: tipo,
        MES: mes,
        ANO: ano,
        SALDO_DIAS: saldo
      }
    });

    return res.status(201).json(novaSolicitacao);
  } catch (error) {
    console.error('Erro ao criar solicitação de férias:', error);
    return res.status(500).json({ error: 'Erro interno ao criar solicitação' });
  }
};


