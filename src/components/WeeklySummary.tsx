/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ResumoSemanal, Modalidade } from '../types/workout.ts';
import { formatarMinutos } from '../utils/dates.ts';
import { Flame, Activity, Footprints, Dumbbell, Clock, Layers } from 'lucide-react';

interface WeeklySummaryProps {
  resumo: ResumoSemanal;
  onFiltrarModalidade?: (m: Modalidade) => void;
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  resumo,
  onFiltrarModalidade,
}) => {
  const { totalTreinos, totalMinutos, porModalidade, inicioSemana, fimSemana } = resumo;

  // Formatando o intervalo da semana
  const formatarDataSimples = (iso: string) => {
    if (!iso) return '';
    const [, m, d] = iso.split('-');
    return `${d}/${m}`;
  };

  const modalidadesConfig: Array<{
    key: Modalidade;
    label: string;
    icone: React.ComponentType<{ className?: string }>;
    accentColor: string;
    barColor: string;
    textColor: string;
    borderHover: string;
  }> = [
    {
      key: 'boxe',
      label: 'Boxe',
      icone: Flame,
      accentColor: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
      barColor: 'bg-amber-500',
      textColor: 'text-amber-400',
      borderHover: 'hover:border-amber-500/60',
    },
    {
      key: 'jiu-jitsu',
      label: 'Jiu-Jitsu',
      icone: Activity,
      accentColor: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30',
      barColor: 'bg-purple-500',
      textColor: 'text-purple-400',
      borderHover: 'hover:border-purple-500/60',
    },
    {
      key: 'corrida',
      label: 'Corrida',
      icone: Footprints,
      accentColor: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
      barColor: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      borderHover: 'hover:border-emerald-500/60',
    },
    {
      key: 'musculacao',
      label: 'Musculação',
      icone: Dumbbell,
      accentColor: 'from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/30',
      barColor: 'bg-blue-500',
      textColor: 'text-blue-400',
      borderHover: 'hover:border-blue-500/60',
    },
  ];

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 text-slate-100 shadow-sm">
      {/* Top Header do Resumo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Resumo da Semana Atual
            </h2>
            <span className="text-xs text-slate-400">
              ({formatarDataSimples(inicioSemana)} a {formatarDataSimples(fimSemana)})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Controle integrado de volume e tempo das suas 4 modalidades concorrentes.
          </p>
        </div>

        {/* Totais Gerais */}
        <div className="flex items-center gap-4 text-xs sm:text-sm self-start sm:self-auto bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Treinos:</span>
            <span className="font-bold text-white tabular-nums">{totalTreinos}</span>
          </div>
          <span className="text-slate-700" aria-hidden="true">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Tempo:</span>
            <span className="font-bold text-white tabular-nums">{formatarMinutos(totalMinutos)}</span>
            <span className="text-[11px] text-slate-500 tabular-nums">({totalMinutos}m)</span>
          </div>
        </div>
      </div>

      {/* Grid de Modalidades */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
        {modalidadesConfig.map(mod => {
          const stats = porModalidade[mod.key] || { quantidade: 0, minutos: 0 };
          const Icone = mod.icone;
          const pct = totalMinutos > 0 ? Math.round((stats.minutos / totalMinutos) * 100) : 0;

          return (
            <button
              key={mod.key}
              type="button"
              onClick={() => onFiltrarModalidade && onFiltrarModalidade(mod.key)}
              className={`text-left p-3.5 sm:p-4 rounded-xl bg-slate-950/50 border border-slate-800 transition-all ${mod.borderHover} cursor-pointer group`}
              title={`Clique para filtrar treinos de ${mod.label}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                  {mod.label}
                </span>
                <div className={`p-1.5 rounded-lg border bg-gradient-to-br ${mod.accentColor}`}>
                  <Icone className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">
                    {stats.quantidade}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">
                    {stats.quantidade === 1 ? 'treino' : 'treinos'}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-semibold tabular-nums ${mod.textColor}`}>
                    {stats.minutos}m
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {formatarMinutos(stats.minutos)}
                  </span>
                </div>
              </div>

              {/* Mini barra de percentual */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Participação</span>
                <span className="font-medium text-slate-300 tabular-nums">{pct}% do tempo</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Barra de Distribuição Visual do Tempo */}
      {totalMinutos > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Distribuição de carga na semana</span>
            <span className="tabular-nums">{totalMinutos} minutos acumulados</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex gap-0.5 p-0.5">
            {modalidadesConfig.map(mod => {
              const stats = porModalidade[mod.key] || { minutos: 0 };
              const percent = totalMinutos > 0 ? (stats.minutos / totalMinutos) * 100 : 0;
              if (percent <= 0) return null;
              return (
                <div
                  key={mod.key}
                  style={{ width: `${percent}%` }}
                  className={`h-full ${mod.barColor} rounded-sm transition-all duration-300`}
                  title={`${mod.label}: ${stats.minutos} min (${Math.round(percent)}%)`}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
