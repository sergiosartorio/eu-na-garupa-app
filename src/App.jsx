import { useEffect, useState, useCallback } from 'react';
import {
  getPerfil,
  getCheckIns,
  saveCheckIns,
  addCheckIn as storageAddCheckIn,
  removeCheckIn as storageRemoveCheckIn,
  updateCheckIn as storageUpdateCheckIn,
  gerarId
} from './lib/storage.js';
import { fetchEventosPublicados } from './lib/api.js';
import { atualizarStatusCheckIns } from './lib/matching.js';
import { montarUrlSofoto } from './lib/urlBuilder.js';

import Onboarding from './components/Onboarding.jsx';
import Home from './components/Home.jsx';
import CheckInModal from './components/CheckInModal.jsx';
import PassagemDetail from './components/PassagemDetail.jsx';
import Settings from './components/Settings.jsx';

export default function App() {
  // Tela atual: 'onboarding' | 'home' | 'checkin' | 'passagem' | 'settings'
  const [tela, setTela] = useState('home');
  const [perfil, setPerfil] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [erroEventos, setErroEventos] = useState(null);
  const [passagemSelecionada, setPassagemSelecionada] = useState(null);

  // Carrega perfil + check-ins do localStorage no primeiro mount
  useEffect(() => {
    const p = getPerfil();
    const cs = getCheckIns();
    setPerfil(p);
    setCheckIns(cs);
    setTela(p ? 'home' : 'onboarding');
  }, []);

  // Busca eventos da API toda vez que entra na home
  const recarregarEventos = useCallback(async () => {
    setLoadingEventos(true);
    setErroEventos(null);
    try {
      const evs = await fetchEventosPublicados({ page: 1, perPage: 20 });
      setEventos(evs);

      // Recalcula status dos check-ins com a lista nova
      setCheckIns((prev) => {
        const atualizados = atualizarStatusCheckIns(prev, evs);
        saveCheckIns(atualizados);
        return atualizados;
      });
    } catch (err) {
      setErroEventos(err.message || 'Falha ao buscar eventos');
    } finally {
      setLoadingEventos(false);
    }
  }, []);

  useEffect(() => {
    if (tela === 'home' && perfil) {
      recarregarEventos();
    }
  }, [tela, perfil, recarregarEventos]);

  // --- Handlers ---

  const handleSalvarPerfil = (novoPerfil) => {
    setPerfil(novoPerfil);
    setTela('home');
  };

  const handleAdicionarCheckIn = (dados) => {
    const novo = {
      id: gerarId(),
      data: dados.data,
      localId: dados.localId,
      hora: dados.hora,
      status: 'aguardando',
      criadoEm: new Date().toISOString()
    };
    const lista = storageAddCheckIn(novo);
    // Roda matching imediatamente, caso o evento já esteja publicado
    const atualizados = atualizarStatusCheckIns(lista, eventos);
    saveCheckIns(atualizados);
    setCheckIns(atualizados);
    setTela('home');
  };

  const handleAbrirPassagem = (checkIn) => {
    setPassagemSelecionada(checkIn);
    setTela('passagem');
  };

  // Atalho da seta verde na home: abre a galeria filtrada direto,
  // pulando a tela de detalhe.
  const handleVerAmostras = (checkIn) => {
    if (checkIn.status !== 'pronto') {
      // Por segurança: se não estiver pronto, cai na tela de detalhe.
      handleAbrirPassagem(checkIn);
      return;
    }
    const url = montarUrlSofoto({
      localId: checkIn.localId,
      data: checkIn.data,
      perfil,
      hora: checkIn.hora
    });
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      handleAbrirPassagem(checkIn);
    }
  };

  const handleAtualizarStatus = (id, patch) => {
    const lista = storageUpdateCheckIn(id, patch);
    setCheckIns(lista);
  };

  const handleRemoverPassagem = (id) => {
    const lista = storageRemoveCheckIn(id);
    setCheckIns(lista);
    setTela('home');
  };

  // --- Render ---

  if (tela === 'onboarding' || !perfil) {
    return (
      <Onboarding
        perfilInicial={perfil}
        onSalvar={handleSalvarPerfil}
      />
    );
  }

  return (
    <>
      <Home
        perfil={perfil}
        checkIns={checkIns}
        loadingEventos={loadingEventos}
        erroEventos={erroEventos}
        onNovoCheckIn={() => setTela('checkin')}
        onAbrirPassagem={handleAbrirPassagem}
        onVerAmostras={handleVerAmostras}
        onAbrirSettings={() => setTela('settings')}
        onRecarregar={recarregarEventos}
      />

      {tela === 'checkin' && (
        <CheckInModal
          onFechar={() => setTela('home')}
          onConfirmar={handleAdicionarCheckIn}
        />
      )}

      {tela === 'passagem' && passagemSelecionada && (
        <PassagemDetail
          passagem={
            checkIns.find((c) => c.id === passagemSelecionada.id) ||
            passagemSelecionada
          }
          perfil={perfil}
          onFechar={() => setTela('home')}
          onRemover={handleRemoverPassagem}
          onAtualizarStatus={handleAtualizarStatus}
        />
      )}

      {tela === 'settings' && (
        <Settings
          perfil={perfil}
          onFechar={() => setTela('home')}
          onSalvar={(p) => {
            setPerfil(p);
            setTela('home');
          }}
        />
      )}
    </>
  );
}
