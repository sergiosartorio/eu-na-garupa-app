// netlify/functions/sofoto-fotos.js
//
// Lista as fotos publicadas no Só Foto de um local + data (para a busca por foto mostrar as
// prévias com marca d'água que o próprio Só Foto já serve, e montar o link ?codes=).
//
//   GET /.netlify/functions/sofoto-fotos?place=SP 300 km 70 + Frutaria&date=20/09/2026
//   → { fotos: { "20260920075039_IMG_8780.jpg": { code: "8780", preview: "https://preview.sofoto.com.br/event_956/..." } }, total }
//
// Mesmo motivo do events.js: a API só libera CORS para sofoto.com.br.

const API = 'https://api.sofoto.com.br/v2/teams/eunagarupa/images';
const PREVIEW = 'https://preview.sofoto.com.br/';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' };
const resp = (obj, status, extra = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...CORS, ...extra } });

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  const u = new URL(req.url);
  const place = u.searchParams.get('place'), date = u.searchParams.get('date');
  if (!place || !/^\d{2}\/\d{2}\/\d{4}$/.test(date || '')) return resp({ erro: 'informe place e date (DD/MM/AAAA)' }, 400);
  try {
    const fotos = {};
    let pagina = 1, ultima = 1;
    do {
      const q = new URLSearchParams({ page: String(pagina), perPage: '500', date, place });
      const r = await fetch(`${API}?${q}`, { headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(`Só Foto respondeu ${r.status}`);
      const d = await r.json();
      ultima = d?.meta?.lastPage || 1;
      for (const im of d?.data || []) {
        if (!im?.previewLink) continue;
        const nome = decodeURIComponent(im.previewLink.split('/').pop());
        fotos[nome] = { code: String(im.code ?? ''), preview: PREVIEW + im.previewLink, id: im.id };
      }
      pagina++;
    } while (pagina <= ultima && pagina <= 20);
    return resp({ fotos, total: Object.keys(fotos).length }, 200, { 'Cache-Control': 'public, max-age=900' });
  } catch (e) {
    return resp({ erro: 'proxy', mensagem: e.message }, 502);
  }
};
