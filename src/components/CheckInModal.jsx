import { useState, useMemo } from 'react';
import { LOCAIS } from '../data/locais.js';

/**
 * Modal de check-in (sempre retrospectivo) — versão simplificada.
 * Campos: Local, Data (campo direto) e Hora (campo direto).
 * A data "hoje" é calculada em horário LOCAL (não UTC).
 */

function dataLocalISO(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function CheckInModal({ onFechar, onConfirmar }) {
  const dataHoje = useMemo(() => dataLocalISO(), []);

  const [data, setData] = useState(dataHoje);
  const [hora, setHora] = useState('');
  const [localId, setLocalId] = useState(
    LOCAIS.length === 1 ? LOCAIS[0].id : ''
  );

  const podeConfirmar = data && hora && localId;

  function confirmar() {
    if (!podeConfirmar) return;
    onConfirmar({ data, hora, localId });
  }

  return (
    <div className="fixed inset-0 bg-asphalt-900 z-50 flex flex-col animate-slide-up">
      <header className="px-5 pt-6 pb-4 flex items-center justify-between border-b border-asphalt-700">
        <button
          onClick={onFechar}
          className="text-asphalt-300 active:scale-95 px-2 py-1"
          aria-label="Fechar"
        >
          ← Voltar
        </button>
        <p className="font-display text-xl tracking-widest text-signal">
          CHECK-IN
        </p>
        <div className="w-16" />
      </header>

      <main className="flex-1 px-5 py-6 overflow-y-auto space-y-8">
        {/* Local */}
        <section>
          <label className="block text-xs uppercase tracking-widest text-asphalt-300 mb-3">
            📍 Onde você passou?
          </label>
          <div className="space-y-2">
            {LOCAIS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLocalId(l.id)}
                className={`
                  w-full text-left p-4 rounded-xl border-2 transition-all
                  ${
                    localId === l.id
                      ? 'border-signal bg-signal/10'
                      : 'border-asphalt-700 bg-asphalt-800 active:scale-[0.99]'
                  }
                `}
              >
                <p className="font-display text-xl tracking-wide">
                  {l.nome.toUpperCase()}
                </p>
                <p className="text-sm text-asphalt-300 mt-0.5">
                  {l.descricao}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Data */}
        <section>
          <label className="block text-xs uppercase tracking-widest text-asphalt-300 mb-3">
            📅 Que dia você passou?
          </label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            max={dataHoje}
            className="w-full bg-asphalt-800 border border-asphalt-600 rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-signal"
          />
        </section>

        {/* Hora */}
        <section>
          <label className="block text-xs uppercase tracking-widest text-asphalt-300 mb-3">
            🕐 Que hora você passou?
          </label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full bg-asphalt-800 border border-asphalt-600 rounded-xl px-4 py-4 text-2xl font-mono text-center focus:outline-none focus:border-signal"
          />
          <p className="text-xs text-asphalt-400 italic mt-3 leading-relaxed">
            Informe a hora aproximada em que passou pelo ponto.
          </p>
        </section>
      </main>

      <footer className="px-5 py-4 border-t border-asphalt-700">
        <button
          onClick={confirmar}
          disabled={!podeConfirmar}
          className="btn-primary w-full"
        >
          Registrar passagem
        </button>
      </footer>
    </div>
  );
}