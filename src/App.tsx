/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Treino, Modalidade } from './types/workout.ts';
import {
  obterTreinos,
  salvarTreino,
  excluirTreino,
  limparTodosTreinos,
  carregarDadosDemonstracao,
  calcularResumoSemanal,
} from './services/storage.ts';
import { Header } from './components/Header.tsx';
import { WeeklySummary } from './components/WeeklySummary.tsx';
import { WorkoutFilter } from './components/WorkoutFilter.tsx';
import { WorkoutCard } from './components/WorkoutCard.tsx';
import { WorkoutFormModal } from './components/WorkoutFormModal.tsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.tsx';
import { VerificationTestModal } from './components/VerificationTestModal.tsx';
import {
  Plus,
  Dumbbell,
  Sparkles,
  CheckCircle2,
  Trash2,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

export default function App() {
  // Lista de treinos obtida do localStorage
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  // Filtro de modalidade
  const [filtroModalidade, setFiltroModalidade] = useState<'todos' | Modalidade>('todos');

  // Controle de Modais
  const [formAberto, setFormAberto] = useState<boolean>(false);
  const [treinoEmEdicao, setTreinoEmEdicao] = useState<Treino | null>(null);

  const [confirmarExclusaoAberto, setConfirmarExclusaoAberto] = useState<boolean>(false);
  const [treinoParaExcluir, setTreinoParaExcluir] = useState<Treino | null>(null);

  const [modalTestesAberto, setModalTestesAberto] = useState<boolean>(false);

  // Notificação temporária de feedback
  const [mensagemFeedback, setMensagemFeedback] = useState<string | null>(null);

  const dispararFeedback = (msg: string) => {
    setMensagemFeedback(msg);
    setTimeout(() => {
      setMensagemFeedback(null);
    }, 3500);
  };

  // Carregar dados no mount
  useEffect(() => {
    const carregados = obterTreinos();
    setTreinos(carregados);
    setCarregando(false);
  }, []);

  // Resumo da semana atual calculado em tempo real
  const resumoSemanal = useMemo(() => {
    return calcularResumoSemanal(treinos);
  }, [treinos]);

  // Contagens para os botões de filtro
  const contagensFiltro = useMemo(() => {
    return {
      todos: treinos.length,
      boxe: treinos.filter(t => t.modalidade === 'boxe').length,
      'jiu-jitsu': treinos.filter(t => t.modalidade === 'jiu-jitsu').length,
      corrida: treinos.filter(t => t.modalidade === 'corrida').length,
      musculacao: treinos.filter(t => t.modalidade === 'musculacao').length,
    };
  }, [treinos]);

  // Treinos filtrados para exibição
  const treinosFiltrados = useMemo(() => {
    if (filtroModalidade === 'todos') {
      return treinos;
    }
    return treinos.filter(t => t.modalidade === filtroModalidade);
  }, [treinos, filtroModalidade]);

  // Handler para salvar (criação ou edição)
  const handleSalvarTreino = (treino: Treino) => {
    const eraEdicao = Boolean(treinoEmEdicao);
    const atualizados = salvarTreino(treino);
    setTreinos(atualizados);
    setFormAberto(false);
    setTreinoEmEdicao(null);
    dispararFeedback(eraEdicao ? 'Treino atualizado com sucesso!' : 'Treino registrado com sucesso!');
  };

  // Iniciar criação
  const handleNovoTreino = () => {
    setTreinoEmEdicao(null);
    setFormAberto(true);
  };

  // Iniciar edição
  const handleEditarTreino = (treino: Treino) => {
    setTreinoEmEdicao(treino);
    setFormAberto(true);
  };

  // Iniciar exclusão (abre confirmação CT05)
  const handleSolicitarExclusao = (treino: Treino) => {
    setTreinoParaExcluir(treino);
    setConfirmarExclusaoAberto(true);
  };

  // Confirmar exclusão
  const handleConfirmarExclusao = () => {
    if (treinoParaExcluir) {
      const atualizados = excluirTreino(treinoParaExcluir.id);
      setTreinos(atualizados);
      dispararFeedback('Treino excluído com sucesso.');
    }
    setConfirmarExclusaoAberto(false);
    setTreinoParaExcluir(null);
  };

  // Cancelar exclusão (CT05: mantém o treino intacto)
  const handleCancelarExclusao = () => {
    setConfirmarExclusaoAberto(false);
    setTreinoParaExcluir(null);
  };

  // Utilitários de demonstração e testes
  const handleCarregarDemos = () => {
    const demos = carregarDadosDemonstracao();
    setTreinos(demos);
    setFiltroModalidade('todos');
    dispararFeedback('Dados demonstrativos carregados nas 4 modalidades.');
  };

  const handleLimparDados = () => {
    const vazios = limparTodosTreinos();
    setTreinos(vazios);
    setFiltroModalidade('todos');
    dispararFeedback('Dados zerados. Aplicação em estado inicial.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast de Feedback */}
      {mensagemFeedback && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{mensagemFeedback}</span>
        </div>
      )}

      {/* Header Principal */}
      <Header
        onNovoTreino={handleNovoTreino}
        onAbrirTestes={() => setModalTestesAberto(true)}
        totalTreinosGerais={treinos.length}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Resumo da Semana Atual (RF06) */}
        <WeeklySummary
          resumo={resumoSemanal}
          onFiltrarModalidade={(m) => setFiltroModalidade(m)}
        />

        {/* Barra de Filtros e Cabeçalho do Feed de Treinos */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Histórico de Treinos
              </h2>
              <p className="text-xs text-slate-400">
                Visualização cronológica com filtros dedicados por modalidade.
              </p>
            </div>

            {/* Ações secundárias quando há registros */}
            {treinos.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleLimparDados}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg border border-slate-800/80 transition-colors cursor-pointer"
                  title="Limpar todos os treinos para testar Estado Vazio (CT08)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar registros</span>
                </button>
              </div>
            )}
          </div>

          {/* Filtros por Modalidade (RF05) */}
          <WorkoutFilter
            filtroAtual={filtroModalidade}
            onSelecionarFiltro={(f) => setFiltroModalidade(f)}
            contagens={contagensFiltro}
          />
        </div>

        {/* Feed de Treinos ou Estado Vazio */}
        {carregando ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Carregando seus treinos...
          </div>
        ) : treinosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {treinosFiltrados.map((treino) => (
              <WorkoutCard
                key={treino.id}
                treino={treino}
                onEditar={handleEditarTreino}
                onExcluir={handleSolicitarExclusao}
              />
            ))}
          </div>
        ) : (
          /* Estado Vazio (Empty State - CT08) */
          <div className="py-16 px-6 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {filtroModalidade === 'todos'
                  ? 'Nenhum treino registrado ainda'
                  : `Nenhum treino de ${filtroModalidade} encontrado`}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {filtroModalidade === 'todos'
                  ? 'Comece registrando sua primeira sessão de boxe, jiu-jitsu, corrida ou musculação para alimentar seu resumo semanal.'
                  : `Você ainda não possui treinos cadastrados nesta modalidade. Clique em "Novo Treino" para registrar.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleNovoTreino}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 rounded-xl shadow-md transition-all cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Primeiro Treino</span>
              </button>

              {filtroModalidade === 'todos' && treinos.length === 0 && (
                <button
                  type="button"
                  onClick={handleCarregarDemos}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors cursor-pointer min-h-[44px]"
                >
                  <RefreshCw className="w-4 h-4 text-indigo-400" />
                  <span>Carregar Exemplos Prontos</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Rodapé Silencioso e Neutro */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">HybridFlow</span>
            <span aria-hidden="true">·</span>
            <span>Atletas Híbridos</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>Boxe</span>
            <span aria-hidden="true">/</span>
            <span>Jiu-Jitsu</span>
            <span aria-hidden="true">/</span>
            <span>Corrida</span>
            <span aria-hidden="true">/</span>
            <span>Musculação</span>
          </div>
        </div>
      </footer>

      {/* Modal de Formulário (Criação / Edição) */}
      <WorkoutFormModal
        aberto={formAberto}
        treinoEmEdicao={treinoEmEdicao}
        onFechar={() => {
          setFormAberto(false);
          setTreinoEmEdicao(null);
        }}
        onSalvar={handleSalvarTreino}
      />

      {/* Modal de Confirmação de Exclusão (CT05) */}
      <DeleteConfirmModal
        aberto={confirmarExclusaoAberto}
        treino={treinoParaExcluir}
        onCancelar={handleCancelarExclusao}
        onConfirmar={handleConfirmarExclusao}
      />

      {/* Modal de Critérios de Teste (CT01 a CT10) */}
      <VerificationTestModal
        aberto={modalTestesAberto}
        onFechar={() => setModalTestesAberto(false)}
        onCarregarDemos={handleCarregarDemos}
        onLimparDados={handleLimparDados}
        onAbrirNovoTreino={handleNovoTreino}
      />
    </div>
  );
}
