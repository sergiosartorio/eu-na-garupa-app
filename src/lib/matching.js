// src/lib/matching.js
//
// Cruza check-ins com eventos publicados da API. Desde 24/06/2026 a URL
// usa place+date, então o matching só decide se o evento ESTÁ PUBLICADO.

import { getLocalById } from '../data/locais.js';

function mesmaData(occurredAt, dataCheckIn) {
  if (!occurredAt || !dataCheckIn) return false;
  return occurredAt.slice(0, 10) === dataCheckIn;
}

function horaCaiNaSessao(horaCheckIn, eventStart, eventEnd) {
  if (!horaCheckIn) return true;
  if (!eventStart || !eventEnd) return true;
  const h = horaCheckIn.padStart(5, '0');
  return h >= eventStart.slice(0, 5) && h <= eventEnd.slice(0, 5);
}

export function encontrarEventoParaCheckIn(checkIn, eventos) {
  const local = getLocalById(checkIn.localId);
  if (!local) return null;

  const chave = (local.chave || '').toLowerCase();
  const enderecoBate = (e) =>
    typeof e.eventAddress === 'string' &&
    chave.length > 0 &&
    e.eventAddress.toLowerCase().includes(chave);

  // 1ª: data + endereço + horário
  let match = eventos.find(
    (e) =>
      mesmaData(e.occurredAt, checkIn.data) &&
      enderecoBate(e) &&
      horaCaiNaSessao(checkIn.hora, e.eventStart, e.eventEnd)
  );
  if (match) return match;

  // 2ª: data + endereço (sem horário)
  match = eventos.find(
    (e) => mesmaData(e.occurredAt, checkIn.data) && enderecoBate(e)
  );
  if (match) return match;

  // 3ª: evento único na data
  const doDia = eventos.filter((e) => mesmaData(e.occurredAt, checkIn.data));
  if (doDia.length === 1) return doDia[0];

  return null;
}

export function atualizarStatusCheckIns(checkIns, eventos) {
  return checkIns.map((ci) => {
    const evento = encontrarEventoParaCheckIn(ci, eventos);
    if (evento) {
      return {
        ...ci,
        status: 'pronto',
        eventAddress: evento.eventAddress,
        eventStart: evento.eventStart,
        eventEnd: evento.eventEnd
      };
    }
    return { ...ci, status: 'aguardando' };
  });
}