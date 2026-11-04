/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Dumbbell, ShieldCheck, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onNovoTreino: () => void;
  onAbrirTestes: () => void;
  totalTreinosGerais: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNovoTreino,
  onAbrirTestes,
  totalTreinosGerais,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-rose-950/30">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>HybridFlow</span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Boxe · Jiu-Jitsu · Corrida · Musculação
            </p>
          </div>
        </div>

        {/* Action Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onAbrirTestes}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors cursor-pointer min-h-[40px]"
            title="Verificar Critérios de Teste CT01 a CT10"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Critérios de Teste</span>
            <span className="md:hidden">Testes</span>
          </button>

          <button
            type="button"
            onClick={onNovoTreino}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 rounded-lg shadow-md shadow-rose-950/20 active:scale-[0.98] transition-all cursor-pointer min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Treino</span>
          </button>
        </div>
      </div>
    </header>
  );
};
