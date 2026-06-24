// src/lib/urlBuilder.js
//
// Monta a URL da galeria do Só Foto.
// Desde 24/06/2026 a galeria exige place + date (não mais event/slug).

import { resolverTags } from '../data/tags.js';
import { getLocalById } from '../data/locais.js';

const GALERIA_URL = 'https://sofoto.com.br/eunagarupa/galeria';

// Converte 'YYYY-MM-DD' (interno) em 'DDMMAAAA' (formato da galeria)
function dataParaDDMMAAAA(dataISO) {
  if (!dataISO) return null;
  const [y, m, d] = dataISO.split('-');
  if (!y || !m || !d) return null;
  return `${d}${m}${y}`;
}

export function montarUrlSofoto({ localId, data, perfil, hora }) {
  const local = getLocalById(localId);
  const date = dataParaDDMMAAAA(data);
  if (!local || !date) return null;

  const url = new URL(GALERIA_URL);
  url.searchParams.set('place', local.place);
  url.searchParams.set('date', date);

  const tags = resolverTags(perfil?.marca, perfil?.modelo);
  if (tags.mainType) url.searchParams.set('mainType', tags.mainType);
  if (tags.subType) url.searchParams.set('subType', tags.subType);
  if (tags.genericType) url.searchParams.set('genericType', tags.genericType);

  if (hora) url.searchParams.set('startTime', hora.padStart(5, '0'));

  // Cor desativada por enquanto:
  // if (perfil?.cor) url.searchParams.set('color', perfil.cor);

  return url.toString();
}

export function montarUrlAmpla({ localId, data }) {
  const local = getLocalById(localId);
  const date = dataParaDDMMAAAA(data);
  if (!local || !date) return null;

  const url = new URL(GALERIA_URL);
  url.searchParams.set('place', local.place);
  url.searchParams.set('date', date);
  return url.toString();
}