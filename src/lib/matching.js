// src/lib/matching.js
//
// Cruza check-ins com eventos publicados da API.
// Identifica o local pelo SUFIXO DO SLUG do evento (confiável) e guarda
// o eventAddress exato do evento pra montar a URL corretamente.

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

function localBate(evento, local) {
  if (!evento.slug || !local?.slugSufixo) return false;
  return evento.slug.toLowerCase().endsWith(local.slugSufixo.toLowerCase());
}

export function encontrarEventoParaCheckIn(checkIn, eventos) {
  const local = getLocalById(checkIn.localId);
  if (!local) return null;

  let match = eventos.find(
    (e) =>
      mesmaData(e.occurredAt, checkIn.data) &&
      localBate(e, local) &&
      horaCaiNaSessao(checkIn.hora, e.eventStart, e.eventEnd)
  );
  if (match) return match;

  match = eventos.find(
    (e) => mesmaData(e.occurredAt, checkIn.data) && localBate(e, local)
  );
  if (match) return match;

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
        slug: evento.slug || null,
        eventAddress: evento.eventAddress || null,
        eventStart: evento.eventStart,
        eventEnd: evento.eventEnd
      };
    }
    return { ...ci, status: 'aguardando' };
  });
}
