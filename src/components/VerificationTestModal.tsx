/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle2, ShieldCheck, Play, Trash2, RefreshCw } from 'lucide-react';

interface VerificationTestModalProps {
  aberto: boolean;
  onFechar: () => void;
  onCarregarDemos: () => void;
  onLimparDados: () => void;
  onAbrirNovoTreino: () => void;
}

export const VerificationTestModal: React.FC<VerificationTestModalProps> = ({
  aberto,
  onFechar,
  onCarregarDemos,
  onLimparDados,
  onAbrirNovoTreino,
}) => {
  if (!aberto) return null;

  const criterios = [
    {
      id: 'CT01',
      titulo: 'Cadastro de treino de Boxe com sucesso',
      acoes: 'Preencher data de hoje, 60 min, intensidade 8, Boxe, "Sparring duro", 6 rounds. Submeter.',
      resultado: 'Treino adicionado ao feed e resumo semanal contabiliza +1 treino e +60 min em Boxe.',
    },
    {
      id: 'CT02',
      titulo: 'Validação de campos condicionais (Jiu-Jitsu)',
      acoes: 'Trocar modalidade para Jiu-jitsu. Apagar o campo de rounds e tentar salvar.',
      resultado: 'Bloqueia submissão e exibe erro destacado no campo de rounds.',
    },
    {
      id: 'CT03',
      titulo: 'Persistência após reload',
      acoes: 'Cadastrar treinos e recarregar a página (F5 ou refresh do navegador).',
      resultado: 'Todos os registros e o resumo semanal são restaurados do localStorage sem perdas.',
    },
    {
      id: 'CT04',
      titulo: 'Edição de registro',
      acoes: 'Clicar em "Editar" no card de treino, modificar campos (ex: distância/tempo) e salvar.',
      resultado: 'O card é atualizado na hora e o resumo semanal recalcula os minutos.',
    },
    {
      id: 'CT05',
      titulo: 'Exclusão com confirmação',
      acoes: 'Clicar na lixeira do card. Cancelar no diálogo (mantém o treino). Depois confirmar a exclusão.',
      resultado: 'Treino é removido da lista e seus minutos são subtraídos do resumo da semana.',
    },
    {
      id: 'CT06',
      titulo: 'Filtragem por modalidade',
      acoes: 'Alternar entre os filtros "Boxe", "Jiu-Jitsu", "Corrida", "Musculação" e "Todos".',
      resultado: 'O feed exibe estritamente os treinos da modalidade ativa com contagem correta.',
    },
    {
      id: 'CT07',
      titulo: 'Isolamento da semana atual no Resumo',
      acoes: 'Verificar se treinos de semanas passadas (disponíveis nos dados de exemplo) aparecem no feed, mas NÃO somam no Resumo Semanal.',
      resultado: 'Apenas treinos de segunda a domingo da semana vigente são computados no topo.',
    },
    {
      id: 'CT08',
      titulo: 'Estado vazio (Empty State)',
      acoes: 'Usar o botão "Limpar Dados" abaixo para zerar o armazenamento.',
      resultado: 'Exibição da tela inicial vazia amigável com botão para começar o primeiro treino.',
    },
    {
      id: 'CT09',
      titulo: 'Bloqueio de data futura',
      acoes: 'Tentar registrar um treino informando uma data futura (ou digitando manualmente uma data após hoje).',
      resultado: 'O sistema bloqueia o envio e exibe "A data não pode ser futura".',
    },
    {
      id: 'CT10',
      titulo: 'Bloqueio de duração inválida (0 e 721 minutos)',
      acoes: 'Tentar salvar com duração 0 min, depois com 721 min.',
      resultado: 'O sistema bloqueia em ambos os casos indicando duração > 0 e teto de 720 min.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl my-6 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Critérios de Teste de Aceitação (CT01 a CT10)
              </h2>
              <p className="text-xs text-slate-400">
                Guia de verificação prática das regras do HybridFlow v1
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ações rápidas de suporte a testes */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <span className="text-slate-400 font-medium">Utilitários para validação rápida:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onCarregarDemos();
                onFechar();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 font-medium transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Carregar Dados Demonstrativos</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onLimparDados();
                onFechar();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Zerar Dados (Testar CT08)</span>
            </button>
          </div>
        </div>

        {/* Lista de Critérios de Teste */}
        <div className="p-5 overflow-y-auto space-y-3 divide-y divide-slate-800/80">
          {criterios.map(ct => (
            <div key={ct.id} className="pt-3 first:pt-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  {ct.id}
                </span>
                <h4 className="text-sm font-semibold text-white">
                  {ct.titulo}
                </h4>
              </div>
              <p className="text-xs text-slate-300 ml-1">
                <span className="text-slate-400 font-medium">Ação:</span> {ct.acoes}
              </p>
              <p className="text-xs text-emerald-400/90 ml-1 mt-0.5 flex items-start gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                <span><strong className="text-emerald-300 font-semibold">Resultado esperado:</strong> {ct.resultado}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onFechar}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
