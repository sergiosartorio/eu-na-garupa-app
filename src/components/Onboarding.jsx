import { useState, useMemo, useEffect, useRef } from 'react';
import { MARCAS } from '../data/marcas.js';
import { CORES } from '../data/cores.js';
import { buscarSugestoesGlobal } from '../data/tags.js';
import { savePerfil } from '../lib/storage.js';

/**
 * Onboarding "modelo primeiro" — o cliente digita direto a moto dele,
 * sem escolher marca antes.
 *
 * Fluxo mínimo (caminho feliz):
 *   digita "cg 160" → toca a sugestão "CG 160 Titan · Honda"
 *   → MARCA JÁ VEM JUNTO (derivada da tabela de tags)
 *   → toca a cor → Salvar.
 *   Total: ~3-4 toques.
 *
 * Fallback: se digitar um modelo fora da lista (texto livre), o grid
 * de marcas aparece pedindo a seleção manual — porque o mainType é
 * obrigatório no filtro do sofoto e não dá pra adivinhar.
 */
export default function Onboarding({ perfilInicial, onSalvar }) {
  const [modelo, setModelo] = useState(perfilInicial?.modelo || '');
  const [marca, setMarca] = useState(perfilInicial?.marca || '');
  const [marcaAutomatica, setMarcaAutomatica] = useState(
    Boolean(perfilInicial?.marca)
  );
  const [cor, setCor] = useState(perfilInicial?.cor || '');
  const [modeloFocado, setModeloFocado] = useState(false);
  const modeloRef = useRef(null);

  const completo = Boolean(modelo.trim() && marca && cor);

  const sugestoes = useMemo(
    () => buscarSugestoesGlobal(modelo, 6),
    [modelo]
  );
  const mostrarSugestoes = modeloFocado && sugestoes.length > 0;

  // Se o cliente editar o texto depois de ter escolhido uma sugestão,
  // a marca derivada deixa de valer — limpa pra reavaliar.
  function aoDigitarModelo(valor) {
    setModelo(valor);
    setModeloFocado(true);
    if (marcaAutomatica) {
      setMarca('');
      setMarcaAutomatica(false);
    }
  }

  function escolherSugestao(sug) {
    setModelo(sug.tag);
    setMarca(sug.marca);
    setMarcaAutomatica(true);
    setModeloFocado(false);
  }

  // Mostra o grid de marcas só quando precisa: tem texto digitado,
  // nenhuma marca definida ainda, e o campo não está em edição ativa.
  const precisaMarcaManual =
    modelo.trim().length > 0 && !marca && !modeloFocado;

  function finalizar() {
    if (!completo) return;
    const perfil = {
      marca,
      modelo: modelo.trim(),
      cor,
      atualizadoEm: new Date().toISOString()
    };
    savePerfil(perfil);
    onSalvar(perfil);
  }

  return (
    <div className="min-h-screen flex flex-col bg-asphalt-900">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <p className="font-display text-2xl tracking-widest text-signal mb-1">
          EU NA GARUPA
        </p>
        <h1 className="text-3xl">CADASTRE SUA MOTO</h1>
      </header>

      <main className="flex-1 px-5 pb-32 overflow-y-auto space-y-7">
        {/* ── Modelo (primeiro!) ── */}
        <section>
          <Etiqueta
            numero="1"
            texto="Qual é a sua moto?"
            preenchido={Boolean(modelo.trim() && marca)}
          />
          <div className="relative">
            <input
              ref={modeloRef}
              type="text"
              inputMode="text"
              value={modelo}
              onChange={(e) => aoDigitarModelo(e.target.value)}
              onFocus={() => setModeloFocado(true)}
              onBlur={() => setTimeout(() => setModeloFocado(false), 150)}
              placeholder="ex: CG 160, MT-07, Ninja 400..."
              className="w-full bg-asphalt-800 border border-asphalt-600 rounded-xl px-4 py-3.5 text-lg focus:outline-none focus:border-signal"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              autoFocus
            />

            {mostrarSugestoes && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1.5 bg-asphalt-800 border border-asphalt-600 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                {sugestoes.map((sug) => (
                  <button
                    key={`${sug.marca}-${sug.tag}`}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      escolherSugestao(sug);
                    }}
                    className="flex items-center justify-between w-full text-left px-4 py-3 hover:bg-asphalt-700 active:bg-signal/10 border-b border-asphalt-700 last:border-b-0"
                  >
                    <span>{sug.tag}</span>
                    <span className="text-xs text-asphalt-400 ml-3 shrink-0">
                      {sug.marca}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chip de marca derivada automaticamente */}
          {marca && marcaAutomatica && (
            <div className="flex items-center gap-2 mt-2.5 animate-fade-in">
              <span className="badge badge-pronto">✓ {marca}</span>
              <span className="text-[11px] text-asphalt-400">
                marca identificada automaticamente
              </span>
            </div>
          )}
        </section>

        {/* ── Marca manual — só aparece se não foi possível derivar ── */}
        {(precisaMarcaManual || (marca && !marcaAutomatica)) && (
          <section className="animate-fade-in">
            <Etiqueta
              numero="+"
              texto="Não achamos na lista — qual a marca?"
              preenchido={Boolean(marca)}
            />
            <div className="grid grid-cols-5 gap-2">
              {MARCAS.map((m) => (
                <button
                  key={m.valor}
                  onClick={() => {
                    setMarca(m.valor);
                    setMarcaAutomatica(false);
                  }}
                  className={`
                    flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-2 transition-all
                    ${
                      marca === m.valor
                        ? 'border-signal bg-signal/10'
                        : 'border-asphalt-700 bg-asphalt-800 active:scale-95'
                    }
                  `}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm"
                    style={{ backgroundColor: m.cor, color: '#fff' }}
                  >
                    {m.nome.charAt(0)}
                  </div>
                  <span className="text-[10px] leading-tight text-center font-medium">
                    {m.nome}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Cor ── */}
        <section
          className={
            modelo.trim() ? '' : 'opacity-40 pointer-events-none'
          }
        >
          <Etiqueta numero="2" texto="Cor predominante" preenchido={Boolean(cor)} />
          <div className="grid grid-cols-5 gap-2">
            {CORES.map((c) => (
              <button
                key={c.valor}
                onClick={() => setCor(c.valor)}
                className={`
                  flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-all
                  ${
                    cor === c.valor
                      ? 'border-signal bg-signal/10'
                      : 'border-asphalt-700 active:scale-95'
                  }
                `}
              >
                <div
                  className="w-7 h-7 rounded-full border-2 border-asphalt-500"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[10px] font-medium">{c.nome}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Botão fixo no rodapé */}
      <footer className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-asphalt-900/95 backdrop-blur border-t border-asphalt-700">
        <button
          onClick={finalizar}
          disabled={!completo}
          className="btn-primary w-full"
        >
          {completo
            ? '✓ Salvar e começar'
            : !modelo.trim()
              ? 'Digite sua moto'
              : !marca
                ? 'Selecione a marca'
                : 'Escolha a cor'}
        </button>
      </footer>
    </div>
  );
}

function Etiqueta({ numero, texto, preenchido }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span
        className={`
          w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold
          ${preenchido ? 'bg-liberated text-asphalt-900' : 'bg-asphalt-700 text-asphalt-300'}
        `}
      >
        {preenchido ? '✓' : numero}
      </span>
      <span className="text-xs uppercase tracking-widest text-asphalt-300">
        {texto}
      </span>
    </div>
  );
}
