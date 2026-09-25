import { useEffect, useState } from 'react';
import { getLocalById } from '../data/locais.js';
import { fetchEventosPublicados } from '../lib/api.js';
import { encontrarEventoParaCheckIn } from '../lib/matching.js';
import BuscaFoto from './BuscaFoto.jsx';

// Entrada pública da busca por foto, sem cadastro nem check-in:
//   /buscar                         → lista os eventos com busca publicada
//   /buscar/2026-09-20_frutaria1    → busca direto naquele evento
// É o link que vai no Só Foto (descrição do evento) e no WhatsApp.

const EVENTO_OK = /^(\d{4}-\d{2}-\d{2})_([a-z0-9-]+)$/;

export default function BuscaPublica({ evento }) {
  const [lista, setLista] = useState(null);
  const [passagem, setPassagem] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        if (!evento) {
          const r = await fetch('/.netlify/functions/busca?acao=lista');
          const d = await r.json();
          if (vivo) setLista(d.eventos || []);
          return;
        }
        const m = evento.match(EVENTO_OK);
        if (!m || !getLocalById(m[2])) throw new Error('Link de busca inválido.');
        const [, data, localId] = m;
        // endereço exato do evento no Só Foto (para as prévias e o link de compra)
        const eventos = await fetchEventosPublicados({ page: 1, perPage: 50 }).catch(() => []);
        const ev = encontrarEventoParaCheckIn({ data, localId, hora: null }, eventos);
        if (vivo) setPassagem({ id: 'pub_' + evento, data, localId, hora: null, eventAddress: ev?.eventAddress || null, status: 'pronto' });
      } catch (e) {
        if (vivo) setErro(e.message || 'Não carregou.');
      }
    })();
    return () => { vivo = false; };
  }, [evento]);

  const irPara = (url) => { window.location.href = url; };

  if (passagem) return <BuscaFoto passagem={passagem} onFechar={() => irPara('/buscar')} />;

  return (
    <div className="min-h-screen bg-asphalt-900 px-5 py-8">
      <p className="font-display text-2xl tracking-widest text-signal">EU NA GARUPA</p>
      <h1 className="text-4xl mt-2 mb-2 leading-tight">ACHE SUAS FOTOS PELA FOTO</h1>
      <p className="text-sm text-asphalt-300 mb-6">
        Mande uma foto sua com a moto: a IA mostra só as suas fotos do evento, prontas para comprar no Só Foto.
      </p>
      <div className="road-stripe mb-6" />
      {erro && <p className="text-brake-light text-sm mb-4">{erro}</p>}
      {!evento && lista === null && <p className="text-asphalt-300">Carregando eventos…</p>}
      {!evento && lista && !lista.length && <p className="text-asphalt-300">Nenhum evento com busca por foto no momento.</p>}
      <div className="space-y-3">
        {(lista || []).map((e) => {
          const m = e.evento.match(EVENTO_OK);
          const local = m && getLocalById(m[2]);
          const [y, mo, d] = (m?.[1] || '').split('-');
          return (
            <button key={e.evento} onClick={() => irPara('/buscar/' + e.evento)} className="card w-full text-left active:scale-[0.99]">
              <p className="text-xs uppercase tracking-widest text-asphalt-300">{d}/{mo}/{y}</p>
              <p className="font-display text-2xl tracking-wide">{(local?.nome || e.nome || e.evento).toUpperCase()}</p>
              <p className="text-sm text-asphalt-300">{local?.descricao || ''} · {e.fotos} fotos</p>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-asphalt-400 mt-8 text-center">
        Quer ser avisado quando suas fotos saírem? <a className="underline" href="/">Use o app Eu Na Garupa</a>.
      </p>
    </div>
  );
}
