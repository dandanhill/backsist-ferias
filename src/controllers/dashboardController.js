import { makeTypedQueryFactory } from '@prisma/client/runtime/library';
import prisma from '../prismaClient.js'; // lembre-se do `.js` se estiver usando ESModules

// Total de funcionários
export const getTotalFuncionarios = async (req, res) => {
  try {
    const total = await prisma.funcionarios.count();
    res.json({ total });
  } catch (error) {
    console.error("Erro ao buscar total de funcionários:", error);
    res.status(500).json({ error: 'Erro ao buscar total de funcionários' });
  }
};

// Férias no mês atual

export const getFeriasMesAtual = async (req, res) => {
  try {
    const meses = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    const dataAtual = new Date();
    const nomeMesAtual = meses[dataAtual.getMonth()]; // Ex: "junho"

    const total = await prisma.ferias.count({
      where: {
        PERIODO_AQUISITIVO_EM_ABERTO: {
          equals: nomeMesAtual // sem mode
        }
      }
    });

    res.json({ total });
  } catch (error) {
    console.error("Erro ao buscar férias do mês atual:", error);
    res.status(500).json({ error: 'Erro ao buscar férias do mês atual' });
  }
};




// Férias agendadas
export const getFeriasAgendadas = async (req, res) => {
  try {
    const total = await prisma.ferias.count({
      where: {
        PERIODO_AQUISITIVO_EM_ABERTO: "a completar"
      }
    });

    res.json({ total });
  } catch (error) {
    console.error("Erro ao buscar férias agendadas:", error);
    res.status(500).json({ error: 'Erro ao buscar férias agendadas' });
  }
};
// Solicitações de férias em aberto
export const getFeriasSolicitadas = async (req, res) => {
  const meses = [
    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
  ];
  try {
    const total = await prisma.solicitacao_ferias.count({
      where: {
        MES: {
          in: meses,
        },
      },
    });

    res.status(200).json({ total });
  } catch (error) {
    console.error('Erro ao buscar solicitações de férias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
