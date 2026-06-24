import { useMemo } from 'react';
import { getLocalById } from '../data/locais.js';

export default function Home({
  perfil,
  checkIns,
  loadingEventos,
  erroEventos,
  onNovoCheckIn,
  onAbrirPassagem,
  onVerAmostras,
  onAbrirSettings,
  onRecarregar
}) {
  const { prontos, aguardando } = useMemo(() => {
    const p = checkIns.filter((c) => c.status === 'pronto');
    const a = checkIns.filter((c) => c.status !== 'pronto');
    return { prontos: p, aguardando: a };
  }, [checkIns]);

  return (
    <div className="min-h-screen bg-asphalt-900 flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex items-start justify-between">
        <div>
          <p className="font-display text-2xl tracking-widest text-signal">
            EU NA GARUPA
          </p>
          <p className="text-sm text-asphalt-300 mt-1">
            {perfil.marca} {perfil.modelo}
            {perfil.cor ? ` · ${capitalize(perfil.cor)}` : ''}
          </p>
        </div>
        <button
          onClick={onAbrirSettings}
          className="w-10 h-10 rounded-full bg-asphalt-800 border border-asphalt-700 flex items-center justify-center text-asphalt-200 active:scale-95"
          aria-label="Configurações"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </header>

      <div className="road-stripe mx-5 my-2" />

      {/* CTA principal */}
      <section className="px-5 py-4">
        <button
          onClick={onNovoCheckIn}
          className="btn-primary w-full py-6 text-xl"
        >
          <span className="text-2xl mr-1">🏍️</span> FAZER CHECK-IN
        </button>
        <p className="text-xs text-asphalt-400 text-center mt-3 px-4">
          Registre cada passagem. Quando o evento for publicado, suas
          amostras ficam acessíveis aqui.
        </p>
      </section>

      {/* Erros (silencioso, não bloqueia uso) */}
      {erroEventos && (
        <div className="mx-5 mb-2 p-3 rounded-lg bg-brake/15 border border-brake/40 text-sm text-brake-light">
          Não conseguimos verificar publicações agora. {' '}
          <button onClick={onRecarregar} className="underline font-medium">
            Tentar de novo
          </button>
        </div>
      )}

      {/* Lista de passagens */}
      <section className="flex-1 px-5 pb-8 overflow-y-auto">
        {checkIns.length === 0 ? (
          <EstadoVazio />
        ) : (
          <>
            {prontos.length > 0 && (
              <SecaoPassagens
                titulo="Prontas pra ver"
                badge="pronto"
                contador={prontos.length}
                passagens={prontos}
                onAbrirPassagem={onAbrirPassagem}
                onVerAmostras={onVerAmostras}
              />
            )}
            {aguardando.length > 0 && (
              <SecaoPassagens
                titulo="Aguardando publicação"
                badge="aguardando"
                contador={aguardando.length}
                passagens={aguardando}
                onAbrirPassagem={onAbrirPassagem}
                refrescando={loadingEventos}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}

// ---- Subcomponentes ----

function SecaoPassagens({
  titulo,
  badge,
  contador,
  passagens,
  onAbrirPassagem,
  onVerAmostras,
  refrescando = false
}) {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl tracking-wider text-asphalt-100">
          {titulo.toUpperCase()}
        </h2>
        <span className={`badge ${badge === 'pronto' ? 'badge-pronto' : 'badge-aguardando'}`}>
          {contador} {refrescando && '⟳'}
        </span>
      </div>
      <div className="space-y-3">
        {passagens.map((p) => (
          <PassagemCard
            key={p.id}
            passagem={p}
            badge={badge}
            onClick={() => onAbrirPassagem(p)}
            onVerAmostras={onVerAmostras}
          />
        ))}
      </div>
    </div>
  );
}

function PassagemCard({ passagem, badge, onClick, onVerAmostras }) {
  const local = getLocalById(passagem.localId);
  const pronto = badge === 'pronto';

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`
        w-full text-left transition-transform active:scale-[0.99] cursor-pointer
        ${pronto ? 'card-pronto' : 'card-aguardando'}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest text-asphalt-300 mb-1">
            {formatarData(passagem.data)}
          </p>
          <p className="font-display text-2xl tracking-wide truncate">
            {local ? local.nome.toUpperCase() : 'LOCAL'}
          </p>
          <p className="text-sm text-asphalt-300 mt-1 font-mono">
            {passagem.hora}
            {local && ` · ${local.descricao}`}
          </p>
        </div>
        <div className="flex-shrink-0">
          {pronto ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVerAmostras(passagem);
              }}
              className="w-11 h-11 rounded-full bg-liberated flex items-center justify-center text-asphalt-900 active:scale-90 transition-transform"
              aria-label="Ver amostras"
              title="Ver amostras"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ) : (
            <div className="w-10 h-10 rounded-full bg-signal/15 border border-signal/40 flex items-center justify-center animate-pulse-soft">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {pronto && (
        <p className="text-[11px] text-liberated-light/80 mt-3 flex items-center gap-1">
          Toque na seta ► para ver as amostras direto
        </p>
      )}
    </div>
  );
}

function EstadoVazio() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 mb-6 rounded-full bg-asphalt-800 border border-asphalt-700 flex items-center justify-center text-4xl">
        🛣️
      </div>
      <h2 className="text-2xl text-asphalt-100 mb-2">SEM PASSAGENS AINDA</h2>
      <p className="text-sm text-asphalt-300 max-w-xs">
        Toque em <strong className="text-signal">FAZER CHECK-IN</strong> assim que
        cruzar um dos pontos do Eu Na Garupa.
      </p>
    </div>
  );
}

// ---- Helpers ----

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatarData(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  const dias = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const date = new Date(`${iso}T12:00:00`);
  return `${dias[date.getDay()]} · ${parseInt(d, 10)} ${meses[parseInt(m, 10) - 1]}`;
}
