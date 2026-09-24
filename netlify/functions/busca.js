// netlify/functions/busca.js
//
// Índices da busca por foto (Biometria Motos → Eu Na Garupa).
//
//   GET  /.netlify/functions/busca?acao=locais            → pontos (para o programa do notebook)
//   GET  /.netlify/functions/busca?acao=lista             → eventos com busca publicada
//   GET  /.netlify/functions/busca?evento=2026-09-20_frutaria1 → índice do evento
//   POST /.netlify/functions/busca?evento=...             → publica (header Authorization: Bearer <PUBLICAR_CHAVE>)
//
// Os índices ficam no Netlify Blobs (store "busca"): não precisa redeploy a cada evento.
// A chave de publicação é a variável de ambiente PUBLICAR_CHAVE do site (painel da Netlify).

import { getStore } from '@netlify/blobs';
import { LOCAIS } from '../../src/data/locais.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding'
};

const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS, ...extra }
  });

const EVENTO_OK = /^\d{4}-\d{2}-\d{2}_[a-z0-9-]{1,40}$/;

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  const url = new URL(req.url);
  const acao = url.searchParams.get('acao');
  const evento = url.searchParams.get('evento');
  const store = getStore({ name: 'busca', consistency: 'strong' });

  try {
    if (req.method === 'GET' && acao === 'locais') {
      return json({ locais: LOCAIS.map(({ id, nome, descricao }) => ({ id, nome, descricao })) });
    }

    if (req.method === 'GET' && acao === 'lista') {
      const { blobs } = await store.list();
      const eventos = [];
      for (const b of blobs) {
        const meta = await store.getMetadata(b.key);
        eventos.push({ evento: b.key, ...(meta?.metadata || {}) });
      }
      eventos.sort((a, b) => (a.evento < b.evento ? 1 : -1));
      return json({ eventos }, 200, { 'Cache-Control': 'public, max-age=60' });
    }

    if (!evento || !EVENTO_OK.test(evento)) return json({ erro: 'evento inválido' }, 400);

    if (req.method === 'GET') {
      const txt = await store.get(evento, { type: 'text' });
      if (!txt) return json({ erro: 'sem busca para este evento' }, 404);
      return new Response(txt, {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=300', ...CORS }
      });
    }

    if (req.method === 'POST') {
      const chave = process.env.PUBLICAR_CHAVE || Netlify.env.get('PUBLICAR_CHAVE');
      const auth = req.headers.get('authorization') || '';
      if (!chave || auth !== `Bearer ${chave}`) return json({ erro: 'chave de publicação inválida' }, 401);
      const corpo = await req.text();
      let d;
      try { d = JSON.parse(corpo); } catch { return json({ erro: 'JSON inválido' }, 400); }
      if (!Array.isArray(d.fotos) || !Array.isArray(d.subs)) return json({ erro: 'índice incompleto' }, 400);
      await store.set(evento, corpo, {
        metadata: { nome: d.nome || evento, fotos: d.fotos.length, publicado: new Date().toISOString(), versao: d.versao || 1 }
      });
      return json({ ok: true, evento, fotos: d.fotos.length, bytes: corpo.length });
    }

    return json({ erro: 'método não suportado' }, 405);
  } catch (e) {
    return json({ erro: 'falha', mensagem: e.message }, 500);
  }
};
