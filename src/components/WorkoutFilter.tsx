/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Modalidade } from '../types/workout.ts';
import { Filter } from 'lucide-react';

interface WorkoutFilterProps {
  filtroAtual: 'todos' | Modalidade;
  onSelecionarFiltro: (filtro: 'todos' | Modalidade) => void;
  contagens: {
    todos: number;
    boxe: number;
    'jiu-jitsu': number;
    corrida: number;
    musculacao: number;
  };
}

export const WorkoutFilter: React.FC<WorkoutFilterProps> = ({
  filtroAtual,
  onSelecionarFiltro,
  contagens,
}) => {
  const opcoes: Array<{
    id: 'todos' | Modalidade;
    label: string;
    corAtiva: string;
  }> = [
    { id: 'todos', label: 'Todos', corAtiva: 'bg-slate-100 text-slate-900 shadow-sm' },
    { id: 'boxe', label: 'Boxe', corAtiva: 'bg-amber-500 text-slate-950 font-semibold shadow-sm' },
    { id: 'jiu-jitsu', label: 'Jiu-Jitsu', corAtiva: 'bg-purple-600 text-white font-semibold shadow-sm' },
    { id: 'corrida', label: 'Corrida', corAtiva: 'bg-emerald-500 text-slate-950 font-semibold shadow-sm' },
    { id: 'musculacao', label: 'Musculação', corAtiva: 'bg-blue-600 text-white font-semibold shadow-sm' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        <span>Filtrar por modalidade:</span>
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto">
        {opcoes.map(opcao => {
          const ativo = filtroAtual === opcao.id;
          const count = contagens[opcao.id] || 0;

          return (
            <button
              key={opcao.id}
              type="button"
              onClick={() => onSelecionarFiltro(opcao.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                ativo
                  ? opcao.corAtiva
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{opcao.label}</span>
              <span
                className={`text-[10px] tabular-nums font-semibold px-1.5 py-0.2 rounded ${
                  ativo ? 'bg-black/20 text-current' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
