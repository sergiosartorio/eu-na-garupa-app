// src/lib/urlBuilder.js
//
// Monta a URL da galeria do Só Foto usando o eventAddress EXATO do
// evento (guardado no check-in pelo matching), porque o site só
// reconhece o local se o place bater com o endereço real do evento.
// Passando place+date corretos, o site completa event e cameras sozinho.

import { resolverTags } from '../data/tags.js';

const GALERIA_URL = 'https://sofoto.com.br/eunagarupa/galeria';

function dataParaDDMMAAAA(dataISO) {
  if (!dataISO) return null;
  const [y, m, d] = dataISO.split('-');
  if (!y || !m || !d) return null;
  return `${d}${m}${y}`;
}

export function montarUrlSofoto({ eventAddress, data, perfil, hora }) {
  const date = dataParaDDMMAAAA(data);
  if (!eventAddress || !date) return null;

  const url = new URL(GALERIA_URL);
  url.searchParams.set('place', eventAddress);
  url.searchParams.set('date', date);

  const tags = resolverTags(perfil?.marca, perfil?.modelo);
  if (tags.mainType) url.searchParams.set('mainType', tags.mainType);
  if (tags.subType) url.searchParams.set('subType', tags.subType);
  if (tags.genericType) url.searchParams.set('genericType', tags.genericType);

  if (hora) url.searchParams.set('startTime', hora.padStart(5, '0'));

  return url.toString();
}

export function montarUrlAmpla({ eventAddress, data }) {
  const date = dataParaDDMMAAAA(data);
  if (!eventAddress || !date) return null;

  const url = new URL(GALERIA_URL);
  url.searchParams.set('place', eventAddress);
  url.searchParams.set('date', date);
  return url.toString();
}
