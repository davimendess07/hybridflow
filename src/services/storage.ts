/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Modalidade, ResumoSemanal, Treino } from '../types/workout.ts';
import { getHojeISO, getIntervaloSemanaAtual, pertenceASemanaAtual } from '../utils/dates.ts';

const STORAGE_KEY = 'hybridflow_treinos_v1';

/**
 * Lê a lista de treinos salvos no localStorage de forma segura.
 */
export function obterTreinos(): Treino[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parseado = JSON.parse(raw);
    if (Array.isArray(parseado)) {
      // Ordenação cronológica decrescente: data mais recente primeiro
      return parseado.sort((a, b) => {
        if (a.data !== b.data) {
          return b.data.localeCompare(a.data);
        }
        return (b.criadoEm || 0) - (a.criadoEm || 0);
      });
    }
    return [];
  } catch (error) {
    console.error('Erro ao ler treinos do localStorage:', error);
    return [];
  }
}

/**
 * Salva a lista inteira de treinos no localStorage.
 */
function persistir(treinos: Treino[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(treinos));
  } catch (error) {
    console.error('Erro ao persistir treinos no localStorage:', error);
  }
}

/**
 * Salva um treino novo ou atualiza um existente (pelo id).
 */
export function salvarTreino(treino: Treino): Treino[] {
  const treinos = obterTreinos();
  const index = treinos.findIndex(t => t.id === treino.id);

  let atualizados: Treino[];
  if (index >= 0) {
    // Atualização de treino existente
    atualizados = [...treinos];
    atualizados[index] = {
      ...treino,
      duracaoMinutos: Number(treino.duracaoMinutos),
      intensidade: Number(treino.intensidade),
    };
  } else {
    // Novo treino
    const novo: Treino = {
      ...treino,
      id: treino.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `tr-${Date.now()}`),
      criadoEm: treino.criadoEm || Date.now(),
      duracaoMinutos: Number(treino.duracaoMinutos),
      intensidade: Number(treino.intensidade),
    };
    atualizados = [novo, ...treinos];
  }

  // Ordenar decrescente
  atualizados.sort((a, b) => {
    if (a.data !== b.data) {
      return b.data.localeCompare(a.data);
    }
    return (b.criadoEm || 0) - (a.criadoEm || 0);
  });

  persistir(atualizados);
  return atualizados;
}

/**
 * Remove um treino do armazenamento pelo ID.
 */
export function excluirTreino(id: string): Treino[] {
  const treinos = obterTreinos();
  const filtrados = treinos.filter(t => t.id !== id);
  persistir(filtrados);
  return filtrados;
}

/**
 * Remove todos os dados do localStorage (útil para testes ou reinício).
 */
export function limparTodosTreinos(): Treino[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar localStorage:', error);
  }
  return [];
}

/**
 * Calcula o resumo da semana atual (quantidade de treinos e minutos por modalidade).
 */
export function calcularResumoSemanal(treinos: Treino[]): ResumoSemanal {
  const { inicio, fim } = getIntervaloSemanaAtual();

  const inicial: Record<Modalidade, { quantidade: number; minutos: number }> = {
    'boxe': { quantidade: 0, minutos: 0 },
    'jiu-jitsu': { quantidade: 0, minutos: 0 },
    'corrida': { quantidade: 0, minutos: 0 },
    'musculacao': { quantidade: 0, minutos: 0 },
  };

  let totalTreinos = 0;
  let totalMinutos = 0;

  treinos.forEach(t => {
    if (pertenceASemanaAtual(t.data)) {
      totalTreinos += 1;
      const minutos = Number(t.duracaoMinutos) || 0;
      totalMinutos += minutos;

      if (inicial[t.modalidade]) {
        inicial[t.modalidade].quantidade += 1;
        inicial[t.modalidade].minutos += minutos;
      }
    }
  });

  return {
    inicioSemana: inicio,
    fimSemana: fim,
    totalTreinos,
    totalMinutos,
    porModalidade: inicial,
  };
}

/**
 * Carrega dados de demonstração cobrindo todas as 4 modalidades,
 * com treinos na semana atual e em semanas passadas para facilitar os testes.
 */
export function carregarDadosDemonstracao(): Treino[] {
  const hoje = getHojeISO();
  
  // Data de 2 dias atrás
  const dOntem = new Date();
  dOntem.setDate(dOntem.getDate() - 2);
  const data2Dias = dOntem.toISOString().split('T')[0];

  // Data de 3 semanas atrás (fora da semana corrente para testar CT07)
  const dAntiga = new Date();
  dAntiga.setDate(dAntiga.getDate() - 21);
  const dataAntiga = dAntiga.toISOString().split('T')[0];

  const demos: Treino[] = [
    {
      id: 'demo-boxe-1',
      modalidade: 'boxe',
      data: hoje,
      duracaoMinutos: 60,
      intensidade: 8,
      observacoes: 'Foco em movimentação de pernas e resposta no contra-golpe.',
      criadoEm: Date.now() - 1000,
      boxe: {
        tipoSessao: 'sparring_duro',
        rounds: 6,
      },
    },
    {
      id: 'demo-jj-1',
      modalidade: 'jiu-jitsu',
      data: hoje,
      duracaoMinutos: 75,
      intensidade: 9,
      observacoes: 'Ajuste no estrangulamento rodado e transição para as costas.',
      criadoEm: Date.now() - 2000,
      jiuJitsu: {
        tipoSessao: 'rola_livre',
        formato: 'gi',
        rounds: 8,
        posicoes: ['passagem', 'costas', 'finalizacao'],
        tecnicaTrabalhada: 'Passagem toreando com pressão no quadril',
      },
    },
    {
      id: 'demo-corrida-1',
      modalidade: 'corrida',
      data: data2Dias,
      duracaoMinutos: 45,
      intensidade: 6,
      observacoes: 'Rodagem leve para soltar as pernas após sparrings.',
      criadoEm: Date.now() - 3000,
      corrida: {
        tipoCorrida: 'regenerativo',
        distanciaKm: 7.2,
      },
    },
    {
      id: 'demo-musc-1',
      modalidade: 'musculacao',
      data: data2Dias,
      duracaoMinutos: 55,
      intensidade: 8,
      observacoes: 'Supino pesado e barra fixa com lastro.',
      criadoEm: Date.now() - 4000,
      musculacao: {
        objetivo: 'forca',
        gruposMusculares: ['Peito', 'Costas', 'Ombros'],
      },
    },
    {
      id: 'demo-antigo-1',
      modalidade: 'corrida',
      data: dataAntiga,
      duracaoMinutos: 90,
      intensidade: 8,
      observacoes: 'Longão de domingo há 3 semanas (fora da semana atual).',
      criadoEm: Date.now() - 5000000,
      corrida: {
        tipoCorrida: 'longao',
        distanciaKm: 16.0,
      },
    },
  ];

  persistir(demos);
  return demos;
}
