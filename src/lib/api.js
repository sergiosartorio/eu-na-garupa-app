// src/lib/api.js
//
// Chama a Netlify Function que faz proxy pra api.sofoto.com.br.
//
// CORREÇÃO (bug do check-in no mesmo dia): a function tem cache de
// CDN de 5 minutos. Quando vocês publicavam um evento e o cliente
// verificava logo em seguida, o app recebia a lista VELHA do cache
// e não vinculava. O parâmetro `_` (timestamp) torna cada URL única,
// furando o cache — toda verificação agora vai direto na origem.
// O volume de uso é baixo, então não há custo prático nisso.

const FUNCTIONS_BASE = '/.netlify/functions';

export async function fetchEventosPublicados({ page = 1, perPage = 20 } = {}) {
  const cacheBuster = Date.now();
  const url = `${FUNCTIONS_BASE}/events?page=${page}&perPage=${perPage}&_=${cacheBuster}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`Falha ao buscar eventos (${res.status})`);
  }

  const data = await res.json();
  return data.events || [];
}
