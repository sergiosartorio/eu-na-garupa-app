import { useEffect, useMemo, useRef, useState } from 'react';
import { getLocalById } from '../data/locais.js';
import {
  carregarIndice, carregarFotosSofoto, analisarFoto, desenharPrevia,
  pontuar, pessoas, maisParecidas, codigoDaFoto
} from '../lib/buscaIA.js';
import { montarUrlCodigos } from '../lib/urlBuilder.js';
import { track } from '../lib/analytics.js';

const chaveEvento = (p) => `${p.data}_${p.localId}`;
const minutos = (hhmm) => { const [h, m] = (hhmm || '').split(':').map(Number); return Number.isFinite(h) ? h * 60 + (m || 0) : null; };

function lerMarcadas(id) {
  try { return JSON.parse(localStorage.getItem('busca_' + id) || '[]'); } catch { return []; }
}
function salvarMarcadas(id, nomes) {
  try { localStorage.setItem('busca_' + id, JSON.stringify(nomes)); } catch { /* sem localStorage */ }
}

export default function BuscaFoto({ passagem, onFechar }) {
  const local = getLocalById(passagem.localId);
  const [D, setD] = useState(null);
  const [sofoto, setSofoto] = useState({});
  const [estado, setEstado] = useState('carregando'); // carregando | indisponivel | erro | inicio | resultado | horario | mais | minhas
  const [erro, setErro] = useState('');
  const [prog, setProg] = useState(0);
  const [analise, setAnalise] = useState(null); // { subs, previa }
  const [moto, setMoto] = useState(0);
  const [diaTodo, setDiaTodo] = useState(false);
  const [marcadas, setMarcadas] = useState(() => new Set(lerMarcadas(passagem.id)));
  const [ampliada, setAmpliada] = useState(null);
  const [mostrar, setMostrar] = useState(12);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);

  // ---------- carrega índice da busca + fotos publicadas no Só Foto
  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const [ind, sf] = await Promise.all([
          carregarIndice(chaveEvento(passagem)),
          carregarFotosSofoto(passagem.eventAddress, passagem.data).catch(() => ({}))
        ]);
        if (!vivo) return;
        if (!ind) { setEstado('indisponivel'); return; }
        setD(ind); setSofoto(sf); setEstado(marcadasValidas(ind) ? 'minhas' : 'inicio');
      } catch (e) {
        if (vivo) { setErro(e.message); setEstado('erro'); }
      }
    })();
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function marcadasValidas(ind) {
    return lerMarcadas(passagem.id).some((n) => ind.fotos.some((f) => f[0] === n));
  }

  // fotos do índice que estão publicadas no Só Foto (as outras não dá para mostrar nem comprar)
  const disponivel = useMemo(() => {
    if (!D) return null;
    const temLista = Object.keys(sofoto).length > 0;
    return D.fotos.map(([nome]) => !temLista || !!sofoto[nome]);
  }, [D, sofoto]);
  const idx = useMemo(() => (D ? new Map(D.fotos.map((f, i) => [f[0], i])) : new Map()), [D]);
  const marcadasIdx = useMemo(() => [...marcadas].map((n) => idx.get(n)).filter((i) => i != null), [marcadas, idx]);

  const urlFoto = (i) => sofoto[D.fotos[i][0]]?.preview || null;
  const codigo = (i) => sofoto[D.fotos[i][0]]?.code || codigoDaFoto(D.fotos[i][0]);

  function alterna(nomes, ligar) {
    setMarcadas((prev) => {
      const s = new Set(prev);
      nomes.forEach((n) => (ligar ? s.add(n) : s.delete(n)));
      salvarMarcadas(passagem.id, [...s]);
      return s;
    });
  }

  // janela de horário a partir do check-in: a foto é tirada ANTES do "acabei de passar"
  const janela = useMemo(() => {
    const m = minutos(passagem.hora);
    return diaTodo || m == null ? null : [m - 50, m + 15];
  }, [passagem.hora, diaTodo]);

  // ---------- foto do celular
  async function escolherArquivo(e) {
    const f = e.target.files?.[0]; e.target.value = '';
    if (!f) return;
    setEstado('analisando'); setProg(0); setErro('');
    try {
      const a = await analisarFoto(f, setProg);
      if (!a.subs.length) { setErro('Não achei moto nesta foto. Use uma foto em que a moto apareça inteira.'); setEstado('inicio'); return; }
      setAnalise(a); setMoto(0); setMostrar(12); setEstado('resultado');
      track.buscaFoto?.('celular');
    } catch (err) {
      setErro('Este aparelho não conseguiu rodar a busca: ' + (err.message || err)); setEstado('inicio');
    }
  }
  useEffect(() => {
    if (estado === 'resultado' && analise && canvasRef.current) desenharPrevia(canvasRef.current, analise.previa, analise.subs, moto);
  }, [estado, analise, moto]);

  const resultado = useMemo(() => {
    if (!D || !analise || estado !== 'resultado') return [];
    return pessoas(D, pontuar(D, analise.subs[moto], janela, disponivel), disponivel);
  }, [D, analise, moto, janela, disponivel, estado]);

  const doHorario = useMemo(() => {
    if (!D || estado !== 'horario') return [];
    const out = [];
    for (let i = 0; i < D.N; i++) {
      if (disponivel && !disponivel[i]) continue;
      if (janela && (D.minuto[i] < janela[0] || D.minuto[i] > janela[1])) continue;
      out.push(i);
    }
    return pessoas(D, out.map((i) => [i, 1]), disponivel);
  }, [D, estado, janela, disponivel]);

  const mais = useMemo(() => (D && estado === 'mais' ? maisParecidas(D, marcadasIdx, disponivel) : []), [D, estado, marcadasIdx, disponivel]);

  // ---------- telas
  if (estado === 'carregando') return <Tela onFechar={onFechar}><Aviso>Carregando as fotos do evento…</Aviso></Tela>;
  if (estado === 'indisponivel')
    return (
      <Tela onFechar={onFechar}>
        <Aviso titulo="BUSCA AINDA NÃO LIBERADA">A busca por foto deste evento ainda não foi publicada. Use "Ver amostras" enquanto isso.</Aviso>
      </Tela>
    );
  if (estado === 'erro') return <Tela onFechar={onFechar}><Aviso titulo="NÃO CARREGOU">{erro}</Aviso></Tela>;

  const barra = marcadasIdx.length > 0 && estado !== 'minhas' && (
    <div className="fixed left-0 right-0 bottom-0 z-[60] bg-asphalt-800 border-t border-asphalt-600 px-4 py-3 flex gap-2" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
      <button className="btn-secondary flex-1" onClick={() => { setMostrar(24); setEstado('mais'); }}>Achar mais</button>
      <button className="btn-primary flex-1 !text-base !py-3" onClick={() => setEstado('minhas')}>Minhas fotos ({marcadasIdx.length})</button>
    </div>
  );

  return (
    <Tela onFechar={onFechar} titulo={local?.nome} extra={barra}>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={escolherArquivo} />

      {estado === 'inicio' && (
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-4xl leading-tight">ACHAR MINHAS FOTOS</h1>
          <p className="text-asphalt-200 text-sm">
            A IA compara com as {D.N} fotos do evento, aqui no seu celular. Nenhuma foto sua é enviada.
          </p>
          {erro && <p className="text-sm text-brake-light">{erro}</p>}
          <button className="btn-primary w-full py-6" onClick={() => inputRef.current?.click()}>📷 USAR UMA FOTO SUA</button>
          <p className="text-xs text-asphalt-400 text-center -mt-2">Uma foto sua com a moto, de frente ou de lado. Pode ser de outro dia.</p>
          <button className="btn-secondary w-full py-4" onClick={() => { setMostrar(12); setEstado('horario'); }}>🔎 Procurar nas fotos do meu horário</button>
          {marcadasIdx.length > 0 && (
            <button className="btn-secondary w-full" onClick={() => setEstado('minhas')}>Minhas fotos ({marcadasIdx.length})</button>
          )}
        </div>
      )}

      {estado === 'analisando' && (
        <Aviso titulo="PROCURANDO…">
          {prog < 0.9 ? 'Baixando a IA (só na primeira vez)…' : 'Comparando com as fotos do evento…'}
          <div className="h-2 bg-asphalt-700 rounded-full overflow-hidden mt-4"><div className="h-full bg-signal transition-all" style={{ width: `${Math.round(prog * 100)}%` }} /></div>
        </Aviso>
      )}

      {estado === 'resultado' && (
        <div className="space-y-4 animate-fade-in">
          <canvas ref={canvasRef} className="w-full rounded-xl bg-asphalt-800" />
          {analise.subs.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-asphalt-300 self-center">Qual é a sua?</span>
              {analise.subs.map((_, k) => (
                <button key={k} onClick={() => setMoto(k)} className={`badge ${k === moto ? 'bg-signal text-asphalt-900' : 'bg-asphalt-700 text-asphalt-100'}`}>Moto {k + 1}</button>
              ))}
            </div>
          )}
          <Cabecalho titulo="QUEM PARECE COM VOCÊ" diaTodo={diaTodo} setDiaTodo={setDiaTodo} hora={passagem.hora}
            texto='Cada cartão é uma pessoa com a moto. Toque em "Sou eu" no seu.' />
          <ListaPessoas lista={resultado.slice(0, mostrar)} D={D} urlFoto={urlFoto} marcadas={marcadas} alterna={alterna} ampliar={setAmpliada} />
          {resultado.length > mostrar && <button className="btn-secondary w-full" onClick={() => setMostrar(mostrar + 12)}>Mostrar mais</button>}
          {!resultado.length && <Aviso>Ninguém parecido nesse horário. Tente "o dia todo".</Aviso>}
          <button className="text-sm underline text-asphalt-300 w-full" onClick={() => inputRef.current?.click()}>Usar outra foto</button>
        </div>
      )}

      {estado === 'horario' && (
        <div className="space-y-4 animate-fade-in">
          <Cabecalho titulo="FOTOS DO SEU HORÁRIO" diaTodo={diaTodo} setDiaTodo={setDiaTodo} hora={passagem.hora}
            texto='Ache a sua e toque em "Sou eu". Depois use "Achar mais".' />
          <ListaPessoas lista={doHorario.slice(0, mostrar)} D={D} urlFoto={urlFoto} marcadas={marcadas} alterna={alterna} ampliar={setAmpliada} />
          {doHorario.length > mostrar && <button className="btn-secondary w-full" onClick={() => setMostrar(mostrar + 12)}>Mostrar mais</button>}
          {!doHorario.length && <Aviso>Nenhuma foto nesse horário.</Aviso>}
        </div>
      )}

      {estado === 'mais' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-3xl">MAIS FOTOS SUAS</h2>
          <p className="text-sm text-asphalt-300">Comparando com as {marcadasIdx.length} que você marcou. As mais parecidas vêm primeiro. Marque as suas.</p>
          <div className="grid grid-cols-2 gap-2">
            {mais.slice(0, mostrar).map(([i, p]) => (
              <Foto key={i} i={i} D={D} url={urlFoto(i)} marcada={marcadas.has(D.fotos[i][0])} ampliar={setAmpliada}
                rotulo={p >= 1 ? 'mesmo grupo' : `${Math.round(Math.min(p, 0.99) * 100)}%`} forte={p >= 1}
                onToggle={(on) => alterna([D.fotos[i][0]], on)} />
            ))}
          </div>
          {mais.length > mostrar && <button className="btn-secondary w-full" onClick={() => setMostrar(mostrar + 24)}>Mostrar mais</button>}
          {!mais.length && <Aviso>Não achei outras parecidas.</Aviso>}
        </div>
      )}

      {estado === 'minhas' && (
        <Minhas D={D} idxs={marcadasIdx} urlFoto={urlFoto} codigo={codigo} passagem={passagem} alterna={alterna} ampliar={setAmpliada}
          voltar={() => setEstado('inicio')} achar={() => { setMostrar(24); setEstado('mais'); }} />
      )}

      {ampliada != null && (
        <div className="fixed inset-0 z-[70] bg-black/90 flex flex-col items-center justify-center p-4" onClick={() => setAmpliada(null)}>
          <img src={urlFoto(ampliada)} alt="" className="max-h-[80vh] max-w-full rounded-lg" />
          <p className="text-xs text-asphalt-200 mt-3 font-mono">{D.fotos[ampliada][1]} · nº {codigo(ampliada)}</p>
        </div>
      )}
    </Tela>
  );
}

// ---------------------------------------------------------------- pedaços
function Tela({ onFechar, titulo, children, extra }) {
  return (
    <div className="fixed inset-0 bg-asphalt-900 z-50 flex flex-col animate-slide-up overflow-y-auto">
      <header className="px-5 pt-6 pb-2 flex items-center justify-between">
        <button onClick={onFechar} className="text-asphalt-300 active:scale-95 px-2 py-1">← Voltar</button>
        {titulo && <span className="text-xs uppercase tracking-widest text-asphalt-300">{titulo}</span>}
      </header>
      <main className="flex-1 px-5 py-4 pb-28">{children}</main>
      {extra}
    </div>
  );
}

function Aviso({ titulo, children }) {
  return (
    <div className="card text-center py-10 animate-fade-in">
      {titulo && <h2 className="text-2xl mb-2 text-signal">{titulo}</h2>}
      <div className="text-sm text-asphalt-200">{children}</div>
    </div>
  );
}

function Cabecalho({ titulo, texto, diaTodo, setDiaTodo, hora }) {
  return (
    <div>
      <h2 className="text-3xl">{titulo}</h2>
      <p className="text-sm text-asphalt-300">{texto}</p>
      {hora && (
        <div className="flex gap-2 mt-3">
          <button className={`badge ${!diaTodo ? 'bg-signal text-asphalt-900' : 'bg-asphalt-700 text-asphalt-100'}`} onClick={() => setDiaTodo(false)}>Perto das {hora}</button>
          <button className={`badge ${diaTodo ? 'bg-signal text-asphalt-900' : 'bg-asphalt-700 text-asphalt-100'}`} onClick={() => setDiaTodo(true)}>O dia todo</button>
        </div>
      )}
    </div>
  );
}

function ListaPessoas({ lista, D, urlFoto, marcadas, alterna, ampliar }) {
  return (
    <div className="space-y-3">
      {lista.map((u) => {
        const nomes = u.fotos.map((i) => D.fotos[i][0]);
        const sou = nomes.every((n) => marcadas.has(n));
        const vis = u.fotos.slice(0, 3);
        return (
          <div key={u.chave} className={`rounded-2xl border p-2 ${sou ? 'border-liberated bg-liberated/10' : 'border-asphalt-700 bg-asphalt-800'}`}>
            <div className={`grid gap-1 ${vis.length === 1 ? 'grid-cols-1' : vis.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {vis.map((i) => (
                <img key={i} src={urlFoto(i) || ''} alt="" loading="lazy" onClick={() => ampliar(i)}
                  className="w-full aspect-[3/2] object-cover rounded-lg bg-asphalt-700" />
              ))}
            </div>
            <div className="flex items-center justify-between gap-2 px-1 pt-2">
              <div className="min-w-0">
                <p className="font-mono text-sm">{D.fotos[u.fotos[0]][1].slice(0, 5)} · {u.fotos.length} foto{u.fotos.length > 1 ? 's' : ''}</p>
                {u.rotulo && <p className="text-xs text-asphalt-300 truncate">{u.rotulo}</p>}
              </div>
              <button onClick={() => alterna(nomes, !sou)} className={sou ? 'badge badge-pronto !py-2 !px-4' : 'btn-primary !text-base !py-2 !px-4'}>
                {sou ? 'Sou eu ✓' : 'Sou eu'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Foto({ i, D, url, marcada, onToggle, ampliar, rotulo, forte }) {
  return (
    <div className={`rounded-xl border overflow-hidden ${marcada ? 'border-liberated' : 'border-asphalt-700'} bg-asphalt-800`}>
      <img src={url || ''} alt="" loading="lazy" onClick={() => ampliar(i)} className="w-full aspect-[3/2] object-cover bg-asphalt-700" />
      <div className="flex items-center justify-between p-2 gap-1">
        <span className={`text-[11px] font-mono ${forte ? 'text-liberated-light' : 'text-asphalt-300'}`}>{D.fotos[i][1].slice(0, 5)}{rotulo ? ' · ' + rotulo : ''}</span>
        <button onClick={() => onToggle(!marcada)} className={`text-xs font-bold px-2 py-1 rounded-lg ${marcada ? 'bg-liberated text-asphalt-900' : 'bg-asphalt-600'}`}>
          {marcada ? 'Minha ✓' : 'É minha'}
        </button>
      </div>
    </div>
  );
}

function Minhas({ D, idxs, urlFoto, codigo, passagem, alterna, ampliar, voltar, achar }) {
  const ordenadas = [...idxs].sort((a, b) => D.minuto[a] - D.minuto[b]);
  const codigos = ordenadas.map(codigo).filter(Boolean);
  const url = montarUrlCodigos({ eventAddress: passagem.eventAddress, data: passagem.data, codigos });
  function abrir() {
    if (!url) return;
    track.buscaComprar?.(codigos.length);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  async function compartilhar() {
    if (!url) return;
    if (navigator.share) await navigator.share({ title: 'Minhas fotos', text: 'Minhas fotos de moto no Eu Na Garupa', url }).catch(() => {});
    else navigator.clipboard?.writeText(url);
  }
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-3xl">MINHAS FOTOS ({ordenadas.length})</h2>
      {ordenadas.length ? (
        <>
          <button className="btn-primary w-full py-5" onClick={abrir}>🛒 VER E COMPRAR NO SÓ FOTO</button>
          <p className="text-xs text-asphalt-400 text-center -mt-2">Abre a galeria do Só Foto só com estas fotos.</p>
          <div className="grid grid-cols-2 gap-2">
            {ordenadas.map((i) => (
              <Foto key={i} i={i} D={D} url={urlFoto(i)} marcada ampliar={ampliar} rotulo={'nº ' + codigo(i)} onToggle={(on) => alterna([D.fotos[i][0]], on)} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-secondary" onClick={achar}>Achar mais</button>
            <button className="btn-secondary" onClick={compartilhar}>Compartilhar</button>
          </div>
        </>
      ) : (
        <Aviso>Você ainda não marcou nenhuma foto.</Aviso>
      )}
      <button className="text-sm underline text-asphalt-300 w-full" onClick={voltar}>Procurar de novo</button>
    </div>
  );
}
