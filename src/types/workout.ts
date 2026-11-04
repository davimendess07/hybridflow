/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Modalidade = 'boxe' | 'jiu-jitsu' | 'corrida' | 'musculacao';

export type BoxeTipoSessao = 'tecnica_manopla' | 'saco' | 'sparring_leve' | 'sparring_duro';

export type JiuJitsuTipoSessao = 'drill' | 'rola_livre';
export type JiuJitsuFormato = 'gi' | 'no-gi';
export type JiuJitsuPosicao = 'guarda' | 'passagem' | 'costas' | 'finalizacao';

export type CorridaTipo = 'regenerativo' | 'intervalado' | 'longao';

export type MusculacaoObjetivo = 'hipertrofia' | 'forca' | 'potencia' | 'mobilidade';
export type MusculacaoGrupoMuscular = 'Peito' | 'Costas' | 'Pernas' | 'Ombros' | 'Braços' | 'Core';

export interface DadosBoxe {
  tipoSessao: BoxeTipoSessao;
  rounds: number;
}

export interface DadosJiuJitsu {
  tipoSessao: JiuJitsuTipoSessao;
  formato: JiuJitsuFormato;
  rounds: number;
  posicoes: JiuJitsuPosicao[];
  tecnicaTrabalhada?: string;
}

export interface DadosCorrida {
  tipoCorrida: CorridaTipo;
  distanciaKm: number;
}

export interface DadosMusculacao {
  objetivo: MusculacaoObjetivo;
  gruposMusculares: MusculacaoGrupoMuscular[];
}

export interface Treino {
  id: string;
  modalidade: Modalidade;
  data: string; // Formato YYYY-MM-DD
  duracaoMinutos: number; // Inteiro 1..720
  intensidade: number; // 1..10
  observacoes?: string;
  criadoEm: number; // Timestamp Unix
  
  // Dados específicos da modalidade
  boxe?: DadosBoxe;
  jiuJitsu?: DadosJiuJitsu;
  corrida?: DadosCorrida;
  musculacao?: DadosMusculacao;
}

export interface ResumoModalidade {
  quantidade: number;
  minutos: number;
}

export interface ResumoSemanal {
  inicioSemana: string;
  fimSemana: string;
  totalTreinos: number;
  totalMinutos: number;
  porModalidade: Record<Modalidade, ResumoModalidade>;
}

export interface ErrosValidacao {
  modalidade?: string;
  data?: string;
  duracaoMinutos?: string;
  intensidade?: string;
  observacoes?: string;
  // Boxe
  boxeTipoSessao?: string;
  boxeRounds?: string;
  // Jiu-jitsu
  jiuJitsuTipoSessao?: string;
  jiuJitsuFormato?: string;
  jiuJitsuRounds?: string;
  jiuJitsuTecnica?: string;
  // Corrida
  corridaTipo?: string;
  corridaDistancia?: string;
  // Musculação
  musculacaoObjetivo?: string;
  musculacaoGrupos?: string;
  // Erro genérico
  geral?: string;
}
