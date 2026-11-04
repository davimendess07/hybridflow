/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Treino } from '../types/workout.ts';
import { formatarDataExtenso, formatarMinutos } from '../utils/dates.ts';
import {
  Flame,
  Activity,
  Footprints,
  Dumbbell,
  Clock,
  Gauge,
  Edit3,
  Trash2,
  Calendar,
  Layers,
  Target,
  Sparkles,
} from 'lucide-react';

interface WorkoutCardProps {
  treino: Treino;
  onEditar: (treino: Treino) => void;
  onExcluir: (treino: Treino) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  treino,
  onEditar,
  onExcluir,
}) => {
  // Configurações visuais por modalidade
  const config = {
    boxe: {
      nome: 'Boxe',
      icone: Flame,
      headerBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      tagColor: 'text-amber-400',
    },
    'jiu-jitsu': {
      nome: 'Jiu-Jitsu',
      icone: Activity,
      headerBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      tagColor: 'text-purple-400',
    },
    corrida: {
      nome: 'Corrida',
      icone: Footprints,
      headerBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      tagColor: 'text-emerald-400',
    },
    musculacao: {
      nome: 'Musculação',
      icone: Dumbbell,
      headerBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      tagColor: 'text-blue-400',
    },
  }[treino.modalidade];

  const Icone = config.icone;

  // Descrição amigável de intensidade
  const getIntensidadeDescricao = (pse: number) => {
    if (pse <= 3) return 'Leve / Regenerativo';
    if (pse <= 6) return 'Moderado';
    if (pse <= 8) return 'Intenso / Duro';
    return 'Exaustão / Máximo';
  };

  // Pace estimado da corrida
  const calcularPace = (minutos: number, km: number) => {
    if (!km || km <= 0) return null;
    const paceDecimal = minutos / km;
    const paceMin = Math.floor(paceDecimal);
    const paceSeg = Math.round((paceDecimal - paceMin) * 60);
    return `${paceMin}'${String(paceSeg).padStart(2, '0')}"/km`;
  };

  // Labels amigáveis para campos específicos
  const formatarTipoBoxe = (tipo: string) => {
    const mapa: Record<string, string> = {
      tecnica_manopla: 'Técnica / Manopla',
      saco: 'Bolsa / Saco de pancada',
      sparring_leve: 'Sparring leve',
      sparring_duro: 'Sparring duro',
    };
    return mapa[tipo] || tipo;
  };

  const formatarObjetivoMusc = (obj: string) => {
    const mapa: Record<string, string> = {
      hipertrofia: 'Hipertrofia',
      forca: 'Força Máxima',
      potencia: 'Potência',
      mobilidade: 'Mobilidade / Estabilidade',
    };
    return mapa[obj] || obj;
  };

  const formatarTipoCorrida = (t: string) => {
    const mapa: Record<string, string> = {
      regenerativo: 'Regenerativo',
      intervalado: 'Intervalado / Tiros',
      longao: 'Longão',
    };
    return mapa[t] || t;
  };

  return (
    <article className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all text-slate-100 shadow-sm flex flex-col justify-between">
      <div>
        {/* Top Header do Card: Modalidade + Data + Botões de Ação */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${config.headerBg}`}>
              <Icone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">
                  {config.nome}
                </span>
                <span className="text-slate-500 text-xs" aria-hidden="true">·</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {formatarDataExtenso(treino.data)}
                </span>
              </div>
            </div>
          </div>

          {/* Ações: Editar e Excluir */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEditar(treino)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Editar este treino"
              aria-label="Editar treino"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onExcluir(treino)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              title="Excluir este treino"
              aria-label="Excluir treino"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Linha de Métricas Comuns: Duração e PSE */}
        <div className="grid grid-cols-2 gap-3 my-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 block leading-none">Duração</span>
              <span className="text-sm font-semibold text-white tabular-nums">
                {treino.duracaoMinutos} min
              </span>
              <span className="text-[10px] text-slate-500 ml-1">
                ({formatarMinutos(treino.duracaoMinutos)})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 block leading-none">Intensidade (PSE)</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-amber-400 tabular-nums">
                  {treino.intensidade}/10
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                  · {getIntensidadeDescricao(treino.intensidade)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Campos Específicos por Modalidade */}
        <div className="space-y-2.5 text-xs text-slate-300">
          {/* Boxe */}
          {treino.modalidade === 'boxe' && treino.boxe && (
            <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tipo de Sessão:</span>
                <span className="font-semibold text-white">
                  {formatarTipoBoxe(treino.boxe.tipoSessao)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Volume de Rounds:</span>
                <span className="font-semibold text-amber-400 tabular-nums">
                  {treino.boxe.rounds} {treino.boxe.rounds === 1 ? 'round' : 'rounds'}
                </span>
              </div>
            </div>
          )}

          {/* Jiu-Jitsu */}
          {treino.modalidade === 'jiu-jitsu' && treino.jiuJitsu && (
            <div className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tipo & Formato:</span>
                <span className="font-semibold text-white">
                  {treino.jiuJitsu.tipoSessao === 'drill' ? 'Drill / Repetição' : 'Rola livre'} ·{' '}
                  <span className="uppercase text-purple-400 font-bold">{treino.jiuJitsu.formato}</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rounds de Rola/Luta:</span>
                <span className="font-semibold text-purple-300 tabular-nums">
                  {treino.jiuJitsu.rounds} {treino.jiuJitsu.rounds === 1 ? 'round' : 'rounds'}
                </span>
              </div>

              {treino.jiuJitsu.posicoes && treino.jiuJitsu.posicoes.length > 0 && (
                <div className="pt-1.5 border-t border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Posições trabalhadas:</span>
                  <div className="flex flex-wrap gap-1 text-[11px] text-purple-300 font-medium">
                    {treino.jiuJitsu.posicoes.map((pos, idx) => (
                      <span key={pos}>
                        {pos.charAt(0).toUpperCase() + pos.slice(1)}
                        {idx < treino.jiuJitsu!.posicoes.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {treino.jiuJitsu.tecnicaTrabalhada && (
                <div className="pt-1.5 border-t border-slate-800/80 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-slate-400">Técnica trabalhada:</span>
                    <p className="text-white font-medium italic">
                      "{treino.jiuJitsu.tecnicaTrabalhada}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Corrida */}
          {treino.modalidade === 'corrida' && treino.corrida && (
            <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tipo de Corrida:</span>
                <span className="font-semibold text-white">
                  {formatarTipoCorrida(treino.corrida.tipoCorrida)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Distância Percorrida:</span>
                <span className="font-bold text-emerald-400 tabular-nums text-sm">
                  {treino.corrida.distanciaKm} km
                </span>
              </div>
              {calcularPace(treino.duracaoMinutos, treino.corrida.distanciaKm) && (
                <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Pace Médio Estimado:</span>
                  <span className="font-mono tabular-nums text-slate-200">
                    {calcularPace(treino.duracaoMinutos, treino.corrida.distanciaKm)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Musculação */}
          {treino.modalidade === 'musculacao' && treino.musculacao && (
            <div className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Objetivo da Sessão:</span>
                <span className="font-semibold text-blue-400">
                  {formatarObjetivoMusc(treino.musculacao.objetivo)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Grupos Musculares:</span>
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-200 font-medium">
                  {treino.musculacao.gruposMusculares.map((grupo, idx) => (
                    <span key={grupo}>
                      {grupo}
                      {idx < treino.musculacao!.gruposMusculares.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Observações livres */}
          {treino.observacoes && (
            <div className="mt-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
              <span className="text-slate-500 font-medium">Notas:</span> {treino.observacoes}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
