/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Retorna a data de hoje no formato YYYY-MM-DD de acordo com o horário local.
 */
export function getHojeISO(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Determina o intervalo da semana atual (Segunda-feira a Domingo)
 * com base na data do dispositivo local.
 */
export function getIntervaloSemanaAtual(referencia: Date = new Date()): {
  inicio: string; // YYYY-MM-DD (Segunda)
  fim: string;    // YYYY-MM-DD (Domingo)
} {
  const data = new Date(referencia);
  const diaSemana = data.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  
  // Segunda-feira como primeiro dia da semana (ISO-8601)
  // Se for domingo (0), a segunda-feira foi há 6 dias
  // Se for segunda (1), foi hoje (0 dias)
  // Se for terça (2), foi há 1 dia, etc.
  const diffSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
  
  const segunda = new Date(data);
  segunda.setDate(data.getDate() + diffSegunda);
  segunda.setHours(0, 0, 0, 0);
  
  const domingo = new Date(segunda);
  domingo.setDate(segunda.getDate() + 6);
  domingo.setHours(23, 59, 59, 999);
  
  const formatar = (d: Date) => {
    const a = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${a}-${m}-${dia}`;
  };

  return {
    inicio: formatar(segunda),
    fim: formatar(domingo),
  };
}

/**
 * Verifica se uma data YYYY-MM-DD pertence à semana corrente.
 */
export function pertenceASemanaAtual(dataISO: string): boolean {
  if (!dataISO) return false;
  const { inicio, fim } = getIntervaloSemanaAtual();
  return dataISO >= inicio && dataISO <= fim;
}

/**
 * Formata minutos em formato legível (ex.: 90 -> '1h 30m', 45 -> '45m').
 */
export function formatarMinutos(minutos: number): string {
  if (!minutos || minutos <= 0) return '0m';
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (horas === 0) return `${resto}m`;
  if (resto === 0) return `${horas}h`;
  return `${horas}h ${resto}m`;
}

/**
 * Formata data ISO para apresentação em português (ex.: "Segunda, 04/11" ou "04/11/2026").
 */
export function formatarDataExtenso(dataISO: string): string {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  
  const hoje = getHojeISO();
  if (dataISO === hoje) {
    return 'Hoje';
  }
  
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  const anoOntem = ontem.getFullYear();
  const mesOntem = String(ontem.getMonth() + 1).padStart(2, '0');
  const diaOntem = String(ontem.getDate()).padStart(2, '0');
  if (dataISO === `${anoOntem}-${mesOntem}-${diaOntem}`) {
    return 'Ontem';
  }

  return data.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
