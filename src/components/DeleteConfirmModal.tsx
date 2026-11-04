/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Treino } from '../types/workout.ts';
import { formatarDataExtenso } from '../utils/dates.ts';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  aberto: boolean;
  treino: Treino | null;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  aberto,
  treino,
  onCancelar,
  onConfirmar,
}) => {
  if (!aberto || !treino) return null;

  const nomeModalidade = {
    boxe: 'Boxe',
    'jiu-jitsu': 'Jiu-Jitsu',
    corrida: 'Corrida',
    musculacao: 'Musculação',
  }[treino.modalidade];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md text-slate-100 shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white">
              Excluir este treino?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Esta ação removerá o registro e atualizará o resumo semanal.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Detalhes do item a ser excluído */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Modalidade:</span>
            <span className="font-semibold text-white">{nomeModalidade}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Data:</span>
            <span className="text-slate-200">{formatarDataExtenso(treino.data)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Duração:</span>
            <span className="font-semibold text-white">{treino.duracaoMinutos} min</span>
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer min-h-[44px]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md shadow-rose-950/30 transition-all cursor-pointer min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirmar Exclusão</span>
          </button>
        </div>
      </div>
    </div>
  );
};
