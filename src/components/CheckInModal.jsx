import { useState, useMemo } from 'react';
import { LOCAIS } from '../data/locais.js';

/**
 * Modal de check-in (sempre retrospectivo).
 *
 * CORREÇÃO de fuso horário: a data "hoje" agora é calculada em
 * horário LOCAL do aparelho. Antes usava toISOString() (UTC), que
 * no Brasil (UTC-3) virava o DIA SEGUINTE depois das 21h — e o
 * check-in nunca batia com o evento do dia.
 */

function dataLocalISO(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function diasAtras(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return dataLocalISO(d);
}

export default function CheckInModal({ onFechar, onConfirmar }) {
  const dataHoje = useMemo(() => dataLocalISO(), []);
  const dataOntem = useMemo(() => diasAtras(1), []);

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

  function preencherAgora() {
    const agora = new Date();
    const hh = String(agora.getHours()).padStart(2, '0');
    const mm = String(agora.getMinutes()).padStart(2, '0');
    setHora(`${hh}:${mm}`);
  }

  function ajustarHora(minutosDelta) {
    if (!hora) {
      preencherAgora();
      return;
    }
    const [hh, mm] = hora.split(':').map(Number);
    const totalMin = hh * 60 + mm + minutosDelta;
    if (totalMin < 0) return;
    const novaHh = Math.floor(totalMin / 60) % 24;
    const novoMm = totalMin % 60;
    setHora(
      `${String(novaHh).padStart(2, '0')}:${String(novoMm).padStart(2, '0')}`
    );
  }

  return (
    <div className="fixed inset-0 bg-asphalt-900 z-50 flex flex-col animate-slide-up">
      {/* Header */}
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
          <div className="flex gap-2 mb-3">
            <BotaoRapidoData
              label="Hoje"
              ativo={data === dataHoje}
              onClick={() => setData(dataHoje)}
            />
            <BotaoRapidoData
              label="Ontem"
              ativo={data === dataOntem}
              onClick={() => setData(dataOntem)}
            />
            <BotaoRapidoData
              label="Outra data"
              ativo={data !== dataHoje && data !== dataOntem && Boolean(data)}
              onClick={() => setData('')}
            />
          </div>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            max={dataHoje}
            className="w-full bg-asphalt-800 border border-asphalt-600 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-signal"
          />
        </section>

        {/* Hora */}
        <section>
          <label className="block text-xs uppercase tracking-widest text-asphalt-300 mb-3">
            🕐 Que hora você passou?
          </label>

          <button
            onClick={preencherAgora}
            className={`
              w-full py-3 rounded-xl font-display text-lg tracking-wide mb-3
              transition-all active:scale-[0.98]
              ${
                hora
                  ? 'bg-asphalt-800 border border-asphalt-600 text-asphalt-200'
                  : 'bg-signal text-asphalt-900'
              }
            `}
          >
            {hora ? '↻ ATUALIZAR PRA AGORA' : '⚡ FAZER CHECK-IN AGORA'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => ajustarHora(-15)}
              disabled={!hora}
              className="btn-secondary px-3 py-3 text-sm disabled:opacity-40"
              aria-label="Voltar 15 minutos"
            >
              −15 min
            </button>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              placeholder="--:--"
              className="flex-1 bg-asphalt-800 border border-asphalt-600 rounded-xl px-3 py-3 text-2xl font-mono text-center focus:outline-none focus:border-signal"
            />
            <button
              onClick={() => ajustarHora(15)}
              disabled={!hora}
              className="btn-secondary px-3 py-3 text-sm disabled:opacity-40"
              aria-label="Avançar 15 minutos"
            >
              +15 min
            </button>
          </div>

          <p className="text-xs text-asphalt-400 italic mt-3 leading-relaxed">
            Toque em <strong className="text-asphalt-200">Check-in agora</strong> ao
            passar pelo ponto e ajuste pra trás se passou um pouco antes.
            Ou digite a hora diretamente.
          </p>
        </section>
      </main>

      {/* Footer */}
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

function BotaoRapidoData({ label, ativo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
        ${
          ativo
            ? 'bg-signal text-asphalt-900'
            : 'bg-asphalt-800 border border-asphalt-600 text-asphalt-200 active:scale-95'
        }
      `}
    >
      {label}
    </button>
  );
}
