/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ErrosValidacao, MusculacaoGrupoMuscular, Treino } from '../types/workout.ts';
import { getHojeISO } from './dates.ts';

export const GRUPOS_MUSCULARES_VALIDOS: readonly MusculacaoGrupoMuscular[] = [
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Braços',
  'Core'
] as const;

/**
 * Valida um objeto de treino antes da persistência.
 * Retorna um mapa de erros por campo. Se o objeto estiver vazio, o treino é válido.
 */
export function validarTreino(treino: Partial<Treino>): ErrosValidacao {
  const erros: ErrosValidacao = {};
  const hoje = getHojeISO();

  // 1. Validação de Modalidade
  if (!treino.modalidade) {
    erros.modalidade = 'Selecione uma modalidade.';
  } else if (!['boxe', 'jiu-jitsu', 'corrida', 'musculacao'].includes(treino.modalidade)) {
    erros.modalidade = 'Modalidade inválida.';
  }

  // 2. Validação da Data (CT09: obrigatória e não pode ser futura)
  if (!treino.data || treino.data.trim() === '') {
    erros.data = 'A data do treino é obrigatória.';
  } else {
    // Validação de formato YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(treino.data)) {
      erros.data = 'Formato de data inválido (use AAAA-MM-DD).';
    } else if (treino.data > hoje) {
      erros.data = 'A data não pode ser futura.';
    }
  }

  // 3. Validação de Duração (CT10: inteiro > 0 e <= 720)
  if (treino.duracaoMinutos === undefined || treino.duracaoMinutos === null || String(treino.duracaoMinutos).trim() === '') {
    erros.duracaoMinutos = 'A duração é obrigatória.';
  } else {
    const duracao = Number(treino.duracaoMinutos);
    if (isNaN(duracao) || !Number.isInteger(duracao)) {
      erros.duracaoMinutos = 'A duração deve ser um número inteiro de minutos.';
    } else if (duracao <= 0) {
      erros.duracaoMinutos = 'A duração deve ser maior que 0 minutos.';
    } else if (duracao > 720) {
      erros.duracaoMinutos = 'A duração máxima permitida é de 720 minutos (12h).';
    }
  }

  // 4. Validação de Intensidade (PSE 1 a 10)
  if (treino.intensidade === undefined || treino.intensidade === null) {
    erros.intensidade = 'A intensidade percebida (1 a 10) é obrigatória.';
  } else {
    const intensidade = Number(treino.intensidade);
    if (isNaN(intensidade) || intensidade < 1 || intensidade > 10) {
      erros.intensidade = 'A intensidade deve ser um valor de 1 a 10.';
    }
  }

  // 5. Validação de Observações
  if (treino.observacoes && treino.observacoes.length > 500) {
    erros.observacoes = 'As observações devem ter no máximo 500 caracteres.';
  }

  // 6. Validações Específicas por Modalidade
  if (treino.modalidade === 'boxe') {
    const boxe = treino.boxe;
    if (!boxe) {
      erros.boxeTipoSessao = 'Informe os detalhes do treino de boxe.';
    } else {
      if (!boxe.tipoSessao) {
        erros.boxeTipoSessao = 'Selecione o tipo de sessão de boxe.';
      } else if (!['tecnica_manopla', 'saco', 'sparring_leve', 'sparring_duro'].includes(boxe.tipoSessao)) {
        erros.boxeTipoSessao = 'Tipo de sessão de boxe inválido.';
      }

      if (boxe.rounds === undefined || boxe.rounds === null || String(boxe.rounds).trim() === '') {
        erros.boxeRounds = 'Informe o número de rounds.';
      } else {
        const rounds = Number(boxe.rounds);
        if (isNaN(rounds) || !Number.isInteger(rounds) || rounds < 1 || rounds > 30) {
          erros.boxeRounds = 'O número de rounds deve ser entre 1 e 30.';
        }
      }
    }
  } else if (treino.modalidade === 'jiu-jitsu') {
    const jj = treino.jiuJitsu;
    if (!jj) {
      erros.jiuJitsuTipoSessao = 'Informe os detalhes do treino de jiu-jitsu.';
    } else {
      if (!jj.tipoSessao) {
        erros.jiuJitsuTipoSessao = 'Selecione o tipo de treino (Drill ou Rola livre).';
      } else if (!['drill', 'rola_livre'].includes(jj.tipoSessao)) {
        erros.jiuJitsuTipoSessao = 'Tipo de sessão de jiu-jitsu inválido.';
      }

      if (!jj.formato) {
        erros.jiuJitsuFormato = 'Selecione Gi (com kimono) ou No-Gi.';
      } else if (!['gi', 'no-gi'].includes(jj.formato)) {
        erros.jiuJitsuFormato = 'Formato inválido.';
      }

      if (jj.rounds === undefined || jj.rounds === null || String(jj.rounds).trim() === '') {
        erros.jiuJitsuRounds = 'Informe o número de rounds.';
      } else {
        const rounds = Number(jj.rounds);
        if (isNaN(rounds) || !Number.isInteger(rounds) || rounds < 1 || rounds > 30) {
          erros.jiuJitsuRounds = 'O número de rounds deve ser entre 1 e 30.';
        }
      }

      if (jj.tecnicaTrabalhada && jj.tecnicaTrabalhada.length > 100) {
        erros.jiuJitsuTecnica = 'A técnica trabalhada deve ter no máximo 100 caracteres.';
      }
    }
  } else if (treino.modalidade === 'corrida') {
    const corrida = treino.corrida;
    if (!corrida) {
      erros.corridaTipo = 'Informe os detalhes da corrida.';
    } else {
      if (!corrida.tipoCorrida) {
        erros.corridaTipo = 'Selecione o tipo de corrida.';
      } else if (!['regenerativo', 'intervalado', 'longao'].includes(corrida.tipoCorrida)) {
        erros.corridaTipo = 'Tipo de corrida inválido.';
      }

      if (corrida.distanciaKm === undefined || corrida.distanciaKm === null || String(corrida.distanciaKm).trim() === '') {
        erros.corridaDistancia = 'Informe a distância percorrida em km.';
      } else {
        const dist = Number(corrida.distanciaKm);
        if (isNaN(dist) || dist <= 0) {
          erros.corridaDistancia = 'A distância deve ser maior que 0 km.';
        } else if (dist > 150) {
          erros.corridaDistancia = 'A distância máxima permitida é de 150 km.';
        }
      }
    }
  } else if (treino.modalidade === 'musculacao') {
    const musc = treino.musculacao;
    if (!musc) {
      erros.musculacaoObjetivo = 'Informe os detalhes da musculação.';
    } else {
      if (!musc.objetivo) {
        erros.musculacaoObjetivo = 'Selecione o objetivo da sessão.';
      } else if (!['hipertrofia', 'forca', 'potencia', 'mobilidade'].includes(musc.objetivo)) {
        erros.musculacaoObjetivo = 'Objetivo inválido.';
      }

      if (!musc.gruposMusculares || musc.gruposMusculares.length === 0) {
        erros.musculacaoGrupos = 'Selecione ao menos um grupo muscular.';
      } else {
        const invalidos = musc.gruposMusculares.filter(
          g => !GRUPOS_MUSCULARES_VALIDOS.includes(g)
        );
        if (invalidos.length > 0) {
          erros.musculacaoGrupos = 'Grupos musculares selecionados inválidos.';
        }
      }
    }
  }

  return erros;
}

export function temErros(erros: ErrosValidacao): boolean {
  return Object.keys(erros).length > 0;
}
