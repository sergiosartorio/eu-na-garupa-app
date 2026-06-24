import { useMemo, useState } from 'react';
import { getLocalById } from '../data/locais.js';
import { montarUrlSofoto, montarUrlAmpla } from '../lib/urlBuilder.js';
import { fetchEventosPublicados } from '../lib/api.js';
import { encontrarEventoParaCheckIn } from '../lib/matching.js';
import { getPrevisaoLocal } from '../data/previsoes.js';

export default function PassagemDetail({
  passagem,
  perfil,
  onFechar,
  onRemover,
  onAtualizarStatus
}) {
  const local = getLocalById(passagem.localId);
  const pronto = passagem.status === 'pronto';
  const [verificando, setVerificando] = useState(false);
  const [feedbackRefresh, setFeedbackRefresh] = useState(null);

  const urlFiltrada = useMemo(
    () =>
      pronto
        ? montarUrlSofoto({
            localId: passagem.localId,
            data: passagem.data,
            perfil,
            hora: passagem.hora
          })
        : null,
    [pronto, passagem.localId, passagem.data, perfil, passagem.hora]
  );

  const urlAmpla = useMemo(
    () =>
      pronto
        ? montarUrlAmpla({ localId: passagem.localId, data: passagem.data })
        : null,
    [pronto, passagem.localId, passagem.data]
  );

  function abrir(url) {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function compartilhar() {
    if (!urlFiltrada) return;
    const texto = `Minhas fotos de moto no ${local?.nome} em ${formatarData(passagem.data)}: ${urlFiltrada}`;
    if (navigator.share) {
      navigator.share({ title: 'Minhas amostras', text: texto, url: urlFiltrada });
    } else {
      navigator.clipboard?.writeText(urlFiltrada);
      setFeedbackRefresh('Link copiado!');
      setTimeout(() => setFeedbackRefresh(null), 2000);
    }
  }

  // Refresh manual — chama a API e revalida só esta passagem
  async function verificarAgora() {
    if (verificando) return;
    setVerificando(true);
    setFeedbackRefresh(null);
    try {
      const eventos = await fetchEventosPublicados({ page: 1, perPage: 20 });
      const evento = encontrarEventoParaCheckIn(passagem, eventos);
      if (evento) {
        const patch = {
          status: 'pronto',
          eventAddress: evento.eventAddress,
          eventStart: evento.eventStart,
          eventEnd: evento.eventEnd
        };
        onAtualizarStatus(passagem.id, patch);
        setFeedbackRefresh('Liberado! 🎉');
      } else {
        setFeedbackRefresh('Ainda não publicado.');
      }
    } catch {
      setFeedbackRefresh('Erro ao verificar.');
    } finally {
      setVerificando(false);
      setTimeout(() => setFeedbackRefresh(null), 3000);
    }
  }

  function confirmarRemover() {
    if (confirm('Remover esse check-in do app? (Não afeta suas fotos no Só Foto.)')) {
      onRemover(passagem.id);
    }
  }

  const previsao = !pronto ? getPrevisaoLocal(passagem.localId) : null;

  return (
    <div className="fixed inset-0 bg-asphalt-900 z-50 flex flex-col animate-slide-up overflow-y-auto">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={onFechar}
          className="text-asphalt-300 active:scale-95 px-2 py-1"
        >
          ← Voltar
        </button>
        <span className={`badge ${pronto ? 'badge-pronto' : 'badge-aguardando'}`}>
          {pronto ? '✓ Disponível' : '⏳ Aguardando'}
        </span>
      </header>

      <main className="flex-1 px-5 py-4">
        {/* Bloco principal */}
        <div className="mb-8 animate-fade-in">
          <p className="text-xs uppercase tracking-widest text-asphalt-300 mb-2">
            Check-in
          </p>
          <h1 className="text-5xl mb-4 leading-tight">
            {local?.nome.toUpperCase() || 'LOCAL'}
          </h1>
          {local && (
            <p className="text-asphalt-300 mb-4">{local.descricao}</p>
          )}

          <div className="grid grid-cols-2 gap-3 mt-6">
            <DataChip label="Data" valor={formatarData(passagem.data)} />
            <DataChip label="Hora" valor={passagem.hora} mono />
          </div>
        </div>

        <div className="road-stripe mb-8" />

        {/* CTA principal */}
        {pronto ? (
          <div className="space-y-3 animate-fade-in">
            <div className="flex gap-2">
              <button
                onClick={() => abrir(urlFiltrada)}
                className="btn-primary flex-1 py-6 text-xl"
              >
                📸 VER AMOSTRAS
              </button>
              <button
                onClick={verificarAgora}
                disabled={verificando}
                className="btn-secondary px-4 py-6"
                aria-label="Verificar de novo"
                title="Verificar de novo"
              >
                <span className={verificando ? 'animate-spin inline-block' : ''}>↻</span>
              </button>
            </div>
            <p className="text-xs text-asphalt-400 text-center px-4">
              Abre a galeria do Só Foto com seus filtros já aplicados.
            </p>

            <div className="pt-3 grid grid-cols-2 gap-3">
              <button onClick={compartilhar} className="btn-secondary">
                Compartilhar
              </button>
              <button onClick={() => abrir(urlAmpla)} className="btn-secondary">
                Ver tudo do dia
              </button>
            </div>

            <p className="text-xs text-asphalt-400 text-center mt-2 px-4">
              Não achou foto da sua moto? Toque em <em>"Ver tudo do dia"</em>{' '}
              pra ver o evento inteiro sem filtros.
            </p>
          </div>
        ) : (
          <AguardandoBlock
            previsao={previsao}
            verificarAgora={verificarAgora}
            verificando={verificando}
            feedback={feedbackRefresh}
          />
        )}

        {/* Feedback do refresh (pra estado pronto) */}
        {pronto && feedbackRefresh && (
          <p className="text-xs text-center text-liberated-light mt-4 animate-fade-in">
            {feedbackRefresh}
          </p>
        )}

        {/* Remover passagem */}
        <div className="mt-12 pb-8 text-center">
          <button
            onClick={confirmarRemover}
            className="text-asphalt-400 text-sm underline active:text-brake-light"
          >
            Remover esse check-in
          </button>
        </div>
      </main>
    </div>
  );
}

function DataChip({ label, valor, mono = false }) {
  return (
    <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-3">
      <p className="text-[10px] uppercase tracking-widest text-asphalt-400 mb-1">
        {label}
      </p>
      <p className={`text-lg ${mono ? 'font-mono' : 'font-display tracking-wide'}`}>
        {valor}
      </p>
    </div>
  );
}

function AguardandoBlock({ previsao, verificarAgora, verificando, feedback }) {
  return (
    <div className="card-aguardando text-center py-10 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-signal/15 border border-signal/40 flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <h2 className="text-2xl mb-2 text-signal">AGUARDANDO PUBLICAÇÃO</h2>

      {previsao ? (
        <div className="mb-4">
          <p className="text-sm text-asphalt-200">
            Previsão de liberação:
          </p>
          <p className="font-display text-2xl text-signal-light tracking-wide mt-1">
            {previsao}
          </p>
        </div>
      ) : (
        <p className="text-sm text-asphalt-300 max-w-xs mx-auto mb-4">
          O fotógrafo ainda não disponibilizou as fotos desse dia.
        </p>
      )}

      <div className="px-6">
        <button
          onClick={verificarAgora}
          disabled={verificando}
          className="btn-secondary w-full"
        >
          <span className={verificando ? 'animate-spin inline-block mr-2' : 'mr-2'}>↻</span>
          {verificando ? 'Verificando...' : 'Verificar agora'}
        </button>
      </div>

      {feedback && (
        <p className="text-xs text-asphalt-200 mt-3 animate-fade-in">
          {feedback}
        </p>
      )}
    </div>
  );
}

function formatarData(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
