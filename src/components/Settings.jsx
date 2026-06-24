import { useState } from 'react';
import Onboarding from './Onboarding.jsx';
import { clearPerfil, saveCheckIns } from '../lib/storage.js';

export default function Settings({ perfil, onFechar, onSalvar }) {
  const [editandoPerfil, setEditandoPerfil] = useState(false);

  if (editandoPerfil) {
    return (
      <Onboarding
        perfilInicial={perfil}
        onSalvar={(p) => {
          setEditandoPerfil(false);
          onSalvar(p);
        }}
      />
    );
  }

  function apagarTudo() {
    if (
      confirm(
        'Apagar perfil e todos os check-ins salvos? Isso não afeta suas fotos no Só Foto, mas remove o histórico daqui.'
      )
    ) {
      clearPerfil();
      saveCheckIns([]);
      window.location.reload();
    }
  }

  return (
    <div className="fixed inset-0 bg-asphalt-900 z-50 flex flex-col animate-slide-up overflow-y-auto">
      <header className="px-5 pt-6 pb-4 flex items-center justify-between border-b border-asphalt-700">
        <button onClick={onFechar} className="text-asphalt-300 active:scale-95 px-2 py-1">
          ← Voltar
        </button>
        <p className="font-display text-xl tracking-widest text-signal">
          CONFIGURAÇÕES
        </p>
        <div className="w-16" />
      </header>

      <main className="flex-1 px-5 py-6 space-y-8">
        <section>
          <h2 className="text-xs uppercase tracking-widest text-asphalt-300 mb-3">
            Sua moto
          </h2>
          <div className="card">
            <div className="space-y-2 mb-4">
              <Linha label="Marca" valor={perfil.marca} />
              <Linha label="Modelo" valor={perfil.modelo} />
              {perfil.cor && (
                <Linha label="Cor" valor={capitalize(perfil.cor)} />
              )}
            </div>
            <button
              onClick={() => setEditandoPerfil(true)}
              className="btn-secondary w-full"
            >
              Editar perfil
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-asphalt-300 mb-3">
            Sobre
          </h2>
          <div className="card text-sm text-asphalt-300 space-y-2">
            <p>
              Este app é um atalho pra encontrar suas amostras no{' '}
              <a
                href="https://sofoto.com.br/eunagarupa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal underline"
              >
                Só Foto
              </a>
              .
            </p>
            <p>
              Seus check-ins ficam salvos apenas neste celular. Nada é
              enviado pra servidor nosso.
            </p>
            <p>A compra das fotos continua acontecendo direto no Só Foto.</p>
          </div>
        </section>

        <section className="pt-4">
          <button
            onClick={apagarTudo}
            className="w-full p-4 rounded-xl border border-brake/40 text-brake-light bg-brake/5 active:scale-[0.99] text-sm"
          >
            Apagar perfil e check-ins
          </button>
        </section>
      </main>
    </div>
  );
}

function Linha({ label, valor }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-xs uppercase tracking-widest text-asphalt-400">
        {label}
      </span>
      <span className="font-medium">{valor}</span>
    </div>
  );
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}
