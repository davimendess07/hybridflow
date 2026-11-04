/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Treino,
  Modalidade,
  BoxeTipoSessao,
  JiuJitsuTipoSessao,
  JiuJitsuFormato,
  JiuJitsuPosicao,
  CorridaTipo,
  MusculacaoObjetivo,
  MusculacaoGrupoMuscular,
  ErrosValidacao,
} from '../types/workout.ts';
import { getHojeISO } from '../utils/dates.ts';
import { validarTreino, GRUPOS_MUSCULARES_VALIDOS } from '../utils/validation.ts';
import {
  X,
  Flame,
  Activity,
  Footprints,
  Dumbbell,
  AlertCircle,
  Check,
} from 'lucide-react';

interface WorkoutFormModalProps {
  aberto: boolean;
  treinoEmEdicao: Treino | null;
  onFechar: () => void;
  onSalvar: (treino: Treino) => void;
}

export const WorkoutFormModal: React.FC<WorkoutFormModalProps> = ({
  aberto,
  treinoEmEdicao,
  onFechar,
  onSalvar,
}) => {
  const hoje = getHojeISO();

  // Estados dos campos comuns
  const [modalidade, setModalidade] = useState<Modalidade>('boxe');
  const [data, setData] = useState<string>(hoje);
  const [duracaoMinutos, setDuracaoMinutos] = useState<string>('60');
  const [intensidade, setIntensidade] = useState<number>(7);
  const [observacoes, setObservacoes] = useState<string>('');

  // Estados do Boxe
  const [boxeTipoSessao, setBoxeTipoSessao] = useState<BoxeTipoSessao>('tecnica_manopla');
  const [boxeRounds, setBoxeRounds] = useState<string>('6');

  // Estados do Jiu-Jitsu
  const [jjTipoSessao, setJjTipoSessao] = useState<JiuJitsuTipoSessao>('rola_livre');
  const [jjFormato, setJjFormato] = useState<JiuJitsuFormato>('gi');
  const [jjRounds, setJjRounds] = useState<string>('6');
  const [jjPosicoes, setJjPosicoes] = useState<JiuJitsuPosicao[]>([]);
  const [jjTecnica, setJjTecnica] = useState<string>('');

  // Estados da Corrida
  const [corridaTipo, setCorridaTipo] = useState<CorridaTipo>('regenerativo');
  const [corridaDistancia, setCorridaDistancia] = useState<string>('5.0');

  // Estados da Musculação
  const [muscObjetivo, setMuscObjetivo] = useState<MusculacaoObjetivo>('hipertrofia');
  const [muscGrupos, setMuscGrupos] = useState<MusculacaoGrupoMuscular[]>(['Peito', 'Ombros']);

  // Erros de validação
  const [erros, setErros] = useState<ErrosValidacao>({});

  // Reset ou inicialização com base em treinoEmEdicao
  useEffect(() => {
    if (treinoEmEdicao) {
      setModalidade(treinoEmEdicao.modalidade);
      setData(treinoEmEdicao.data);
      setDuracaoMinutos(String(treinoEmEdicao.duracaoMinutos));
      setIntensidade(treinoEmEdicao.intensidade);
      setObservacoes(treinoEmEdicao.observacoes || '');

      if (treinoEmEdicao.boxe) {
        setBoxeTipoSessao(treinoEmEdicao.boxe.tipoSessao);
        setBoxeRounds(String(treinoEmEdicao.boxe.rounds));
      }
      if (treinoEmEdicao.jiuJitsu) {
        setJjTipoSessao(treinoEmEdicao.jiuJitsu.tipoSessao);
        setJjFormato(treinoEmEdicao.jiuJitsu.formato);
        setJjRounds(String(treinoEmEdicao.jiuJitsu.rounds));
        setJjPosicoes(treinoEmEdicao.jiuJitsu.posicoes || []);
        setJjTecnica(treinoEmEdicao.jiuJitsu.tecnicaTrabalhada || '');
      }
      if (treinoEmEdicao.corrida) {
        setCorridaTipo(treinoEmEdicao.corrida.tipoCorrida);
        setCorridaDistancia(String(treinoEmEdicao.corrida.distanciaKm));
      }
      if (treinoEmEdicao.musculacao) {
        setMuscObjetivo(treinoEmEdicao.musculacao.objetivo);
        setMuscGrupos(treinoEmEdicao.musculacao.gruposMusculares || []);
      }
    } else {
      // Padrões para novo treino
      setModalidade('boxe');
      setData(hoje);
      setDuracaoMinutos('60');
      setIntensidade(7);
      setObservacoes('');

      setBoxeTipoSessao('tecnica_manopla');
      setBoxeRounds('6');

      setJjTipoSessao('rola_livre');
      setJjFormato('gi');
      setJjRounds('6');
      setJjPosicoes([]);
      setJjTecnica('');

      setCorridaTipo('regenerativo');
      setCorridaDistancia('5.0');

      setMuscObjetivo('hipertrofia');
      setMuscGrupos(['Peito', 'Ombros']);
    }
    setErros({});
  }, [treinoEmEdicao, aberto]);

  if (!aberto) return null;

  // Alternar posição de jiu-jitsu
  const togglePosicaoJJ = (pos: JiuJitsuPosicao) => {
    setJjPosicoes(prev =>
      prev.includes(pos) ? prev.filter(p => p !== pos) : [...prev, pos]
    );
  };

  // Alternar grupo muscular
  const toggleGrupoMuscular = (grupo: MusculacaoGrupoMuscular) => {
    setMuscGrupos(prev =>
      prev.includes(grupo) ? prev.filter(g => g !== grupo) : [...prev, grupo]
    );
    // Limpar erro de grupo se selecionou
    if (erros.musculacaoGrupos) {
      setErros(e => ({ ...e, musculacaoGrupos: undefined }));
    }
  };

  // Submissão com validação
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dadosMontados: Partial<Treino> = {
      id: treinoEmEdicao ? treinoEmEdicao.id : undefined,
      modalidade,
      data,
      duracaoMinutos: Number(duracaoMinutos),
      intensidade,
      observacoes: observacoes.trim() || undefined,
      criadoEm: treinoEmEdicao ? treinoEmEdicao.criadoEm : Date.now(),
    };

    if (modalidade === 'boxe') {
      dadosMontados.boxe = {
        tipoSessao: boxeTipoSessao,
        rounds: Number(boxeRounds),
      };
    } else if (modalidade === 'jiu-jitsu') {
      dadosMontados.jiuJitsu = {
        tipoSessao: jjTipoSessao,
        formato: jjFormato,
        rounds: Number(jjRounds),
        posicoes: jjPosicoes,
        tecnicaTrabalhada: jjTecnica.trim() || undefined,
      };
    } else if (modalidade === 'corrida') {
      dadosMontados.corrida = {
        tipoCorrida: corridaTipo,
        distanciaKm: Number(corridaDistancia),
      };
    } else if (modalidade === 'musculacao') {
      dadosMontados.musculacao = {
        objetivo: muscObjetivo,
        gruposMusculares: muscGrupos,
      };
    }

    const errosEncontrados = validarTreino(dadosMontados);
    if (Object.keys(errosEncontrados).length > 0) {
      setErros(errosEncontrados);
      return;
    }

    onSalvar(dadosMontados as Treino);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl text-slate-100 shadow-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header do Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {treinoEmEdicao ? 'Editar Treino' : 'Registrar Novo Treino'}
            </h2>
            <p className="text-xs text-slate-400">
              Preencha os dados da sessão para atualizar o resumo semanal.
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com rolagem interna */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5">
          {/* 1. Seleção de Modalidade */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              1. Modalidade de Treino
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setModalidade('boxe');
                  setErros({});
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer min-h-[64px] ${
                  modalidade === 'boxe'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Flame className="w-5 h-5 mb-1 text-amber-400" />
                <span>Boxe</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModalidade('jiu-jitsu');
                  setErros({});
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer min-h-[64px] ${
                  modalidade === 'jiu-jitsu'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Activity className="w-5 h-5 mb-1 text-purple-400" />
                <span>Jiu-Jitsu</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModalidade('corrida');
                  setErros({});
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer min-h-[64px] ${
                  modalidade === 'corrida'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Footprints className="w-5 h-5 mb-1 text-emerald-400" />
                <span>Corrida</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModalidade('musculacao');
                  setErros({});
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer min-h-[64px] ${
                  modalidade === 'musculacao'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Dumbbell className="w-5 h-5 mb-1 text-blue-400" />
                <span>Musculação</span>
              </button>
            </div>
          </div>

          {/* 2. Campos Comuns (Data, Duração, Intensidade) */}
          <div className="space-y-4 pt-1 border-t border-slate-800">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              2. Dados Gerais da Sessão
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Data (CT09: obrigatória e não pode ser futura) */}
              <div>
                <label htmlFor="data-treino" className="block text-xs font-medium text-slate-300 mb-1">
                  Data do treino <span className="text-rose-400">*</span>
                </label>
                <input
                  id="data-treino"
                  type="date"
                  value={data}
                  max={hoje}
                  onChange={e => {
                    setData(e.target.value);
                    if (erros.data) setErros(prev => ({ ...prev, data: undefined }));
                  }}
                  className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                    erros.data ? 'border-rose-500 bg-rose-950/10' : 'border-slate-800'
                  }`}
                />
                {erros.data && (
                  <p className="mt-1 text-xs text-rose-400 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{erros.data}</span>
                  </p>
                )}
              </div>

              {/* Duração em minutos (CT10: inteiro > 0 e <= 720) */}
              <div>
                <label htmlFor="duracao-treino" className="block text-xs font-medium text-slate-300 mb-1">
                  Duração em minutos <span className="text-rose-400">*</span>
                </label>
                <input
                  id="duracao-treino"
                  type="number"
                  min="1"
                  max="720"
                  step="1"
                  placeholder="Ex: 60"
                  value={duracaoMinutos}
                  onChange={e => {
                    setDuracaoMinutos(e.target.value);
                    if (erros.duracaoMinutos) setErros(prev => ({ ...prev, duracaoMinutos: undefined }));
                  }}
                  className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 tabular-nums ${
                    erros.duracaoMinutos ? 'border-rose-500 bg-rose-950/10' : 'border-slate-800'
                  }`}
                />
                {erros.duracaoMinutos && (
                  <p className="mt-1 text-xs text-rose-400 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{erros.duracaoMinutos}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Intensidade (PSE 1 a 10) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Percepção Subjetiva de Esforço (PSE 1 a 10) <span className="text-rose-400">*</span>
                </label>
                <span className="text-xs font-bold text-amber-400 tabular-nums">
                  {intensidade} / 10
                </span>
              </div>
              <div className="grid grid-cols-10 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setIntensidade(val)}
                    className={`py-2 rounded-lg text-xs font-bold tabular-nums transition-colors cursor-pointer ${
                      intensidade === val
                        ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 - Leve/Regenerativo</span>
                <span>5 - Moderado</span>
                <span>8 - Duro</span>
                <span>10 - Exaustão Máxima</span>
              </div>
            </div>
          </div>

          {/* 3. Campos Específicos por Modalidade */}
          <div className="space-y-4 pt-1 border-t border-slate-800">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              3. Detalhes Específicos: {modalidade.toUpperCase()}
            </span>

            {/* BOXE */}
            {modalidade === 'boxe' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tipo de Sessão de Boxe <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'tecnica_manopla', label: 'Técnica / Manopla' },
                      { id: 'saco', label: 'Saco de Pancada' },
                      { id: 'sparring_leve', label: 'Sparring Leve' },
                      { id: 'sparring_duro', label: 'Sparring Duro' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setBoxeTipoSessao(opt.id as BoxeTipoSessao)}
                        className={`p-2.5 text-xs font-medium rounded-xl border text-left transition-colors cursor-pointer ${
                          boxeTipoSessao === opt.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="boxe-rounds" className="block text-xs font-medium text-slate-300 mb-1">
                    Número de rounds (1 a 30) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="boxe-rounds"
                    type="number"
                    min="1"
                    max="30"
                    value={boxeRounds}
                    onChange={e => {
                      setBoxeRounds(e.target.value);
                      if (erros.boxeRounds) setErros(prev => ({ ...prev, boxeRounds: undefined }));
                    }}
                    className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 tabular-nums ${
                      erros.boxeRounds ? 'border-rose-500 bg-rose-950/10' : 'border-slate-800'
                    }`}
                  />
                  {erros.boxeRounds && (
                    <p className="mt-1 text-xs text-rose-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{erros.boxeRounds}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* JIU-JITSU */}
            {modalidade === 'jiu-jitsu' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tipo de Sessão */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Tipo de Sessão <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setJjTipoSessao('drill')}
                        className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-colors cursor-pointer ${
                          jjTipoSessao === 'drill'
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Drill
                      </button>
                      <button
                        type="button"
                        onClick={() => setJjTipoSessao('rola_livre')}
                        className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-colors cursor-pointer ${
                          jjTipoSessao === 'rola_livre'
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Rola livre
                      </button>
                    </div>
                  </div>

                  {/* Formato: Gi ou No-Gi */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Uniforme / Formato <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setJjFormato('gi')}
                        className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-colors cursor-pointer ${
                          jjFormato === 'gi'
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Gi (Kimono)
                      </button>
                      <button
                        type="button"
                        onClick={() => setJjFormato('no-gi')}
                        className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-colors cursor-pointer ${
                          jjFormato === 'no-gi'
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        No-Gi (Sem kimono)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rounds (CT02: tentar submeter sem preencher rounds) */}
                <div>
                  <label htmlFor="jj-rounds" className="block text-xs font-medium text-slate-300 mb-1">
                    Número de rounds (1 a 30) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="jj-rounds"
                    type="number"
                    min="1"
                    max="30"
                    placeholder="Ex: 8"
                    value={jjRounds}
                    onChange={e => {
                      setJjRounds(e.target.value);
                      if (erros.jiuJitsuRounds) setErros(prev => ({ ...prev, jiuJitsuRounds: undefined }));
                    }}
                    className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 tabular-nums ${
                      erros.jiuJitsuRounds ? 'border-rose-500 bg-rose-950/10' : 'border-slate-800'
                    }`}
                  />
                  {erros.jiuJitsuRounds && (
                    <p className="mt-1 text-xs text-rose-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{erros.jiuJitsuRounds}</span>
                    </p>
                  )}
                </div>

                {/* Posições trabalhadas com tags */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Posições trabalhadas (tags)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['guarda', 'passagem', 'costas', 'finalizacao'] as JiuJitsuPosicao[]).map(pos => {
                      const sel = jjPosicoes.includes(pos);
                      return (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => togglePosicaoJJ(pos)}
                          className={`p-2 rounded-lg text-xs font-medium border flex items-center justify-between transition-colors cursor-pointer ${
                            sel
                              ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="capitalize">{pos}</span>
                          {sel && <Check className="w-3.5 h-3.5 text-purple-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Técnica trabalhada (Ajuste 3: opcional, até 100 caracteres) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="jj-tecnica" className="text-xs font-medium text-slate-300">
                      Técnica trabalhada (opcional)
                    </label>
                    <span className="text-[10px] text-slate-500 tabular-nums">
                      {jjTecnica.length}/100
                    </span>
                  </div>
                  <input
                    id="jj-tecnica"
                    type="text"
                    maxLength={100}
                    placeholder="Ex: Passagem toreando, armlock da guarda fechada..."
                    value={jjTecnica}
                    onChange={e => {
                      setJjTecnica(e.target.value);
                      if (erros.jiuJitsuTecnica) setErros(prev => ({ ...prev, jiuJitsuTecnica: undefined }));
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  {erros.jiuJitsuTecnica && (
                    <p className="mt-1 text-xs text-rose-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{erros.jiuJitsuTecnica}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* CORRIDA */}
            {modalidade === 'corrida' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tipo de Corrida <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'regenerativo', label: 'Regenerativo' },
                      { id: 'intervalado', label: 'Intervalado' },
                      { id: 'longao', label: 'Longão' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCorridaTipo(opt.id as CorridaTipo)}
                        className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-colors cursor-pointer ${
                          corridaTipo === opt.id
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="corrida-distancia" className="block text-xs font-medium text-slate-300 mb-1">
                    Distância em km <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="corrida-distancia"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="150"
                    placeholder="Ex: 5.5"
                    value={corridaDistancia}
                    onChange={e => {
                      setCorridaDistancia(e.target.value);
                      if (erros.corridaDistancia) setErros(prev => ({ ...prev, corridaDistancia: undefined }));
                    }}
                    className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 tabular-nums ${
                      erros.corridaDistancia ? 'border-rose-500 bg-rose-950/10' : 'border-slate-800'
                    }`}
                  />
                  {erros.corridaDistancia && (
                    <p className="mt-1 text-xs text-rose-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{erros.corridaDistancia}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* MUSCULAÇÃO */}
            {modalidade === 'musculacao' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Objetivo Principal <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'hipertrofia', label: 'Hipertrofia' },
                      { id: 'forca', label: 'Força' },
                      { id: 'potencia', label: 'Potência' },
                      { id: 'mobilidade', label: 'Mobilidade' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setMuscObjetivo(opt.id as MusculacaoObjetivo)}
                        className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-colors cursor-pointer ${
                          muscObjetivo === opt.id
                            ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grupos musculares (Ajuste 2: lista fechada Peito, Costas, Pernas, Ombros, Braços e Core) */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Grupos Musculares Trabalhados (mínimo 1) <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {GRUPOS_MUSCULARES_VALIDOS.map(grupo => {
                      const selecionado = muscGrupos.includes(grupo);
                      return (
                        <button
                          key={grupo}
                          type="button"
                          onClick={() => toggleGrupoMuscular(grupo)}
                          className={`p-2.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-colors cursor-pointer ${
                            selecionado
                              ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-semibold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{grupo}</span>
                          {selecionado && <Check className="w-3.5 h-3.5 text-blue-400" />}
                        </button>
                      );
                    })}
                  </div>
                  {erros.musculacaoGrupos && (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{erros.musculacaoGrupos}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. Observações Livres */}
          <div className="pt-1 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="treino-obs" className="text-xs font-medium text-slate-300">
                Observações gerais (opcional)
              </label>
              <span className="text-[10px] text-slate-500 tabular-nums">
                {observacoes.length}/500
              </span>
            </div>
            <textarea
              id="treino-obs"
              rows={2}
              maxLength={500}
              placeholder="Sensações, ajuste de carga, técnica destacada, recuperação..."
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
          </div>

          {/* Botões do Rodapé do Modal */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onFechar}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 rounded-xl shadow-lg shadow-rose-950/30 transition-all cursor-pointer min-h-[44px]"
            >
              {treinoEmEdicao ? 'Atualizar Treino' : 'Salvar Treino'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
