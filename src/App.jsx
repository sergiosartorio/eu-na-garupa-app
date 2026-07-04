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
import { iniciarSessao, track } from './lib/analytics.js';

import Onboarding from './components/Onboarding.jsx';
import Home from './components/Home.jsx';
import CheckInModal from './components/CheckInModal.jsx';
import PassagemDetail from './components/PassagemDetail.jsx';
import Settings from './components/Settings.jsx';

export default function App() {
  const [tela, setTela] = useState('home');
  const [perfil, setPerfil] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [erroEventos, setErroEventos] = useState(null);
  const [passagemSelecionada, setPassagemSelecionada] = useState(null);

  useEffect(() => {
    iniciarSessao();
    const p = getPerfil();
    const cs = getCheckIns();
    setPerfil(p);
    setCheckIns(cs);
    setTela(p ? 'home' : 'onboarding');
  }, []);

  const recarregarEventos = useCallback(async () => {
    setLoadingEventos(true);
    setErroEventos(null);
    try {
      const evs = await fetchEventosPublicados({ page: 1, perPage: 20 });
      setEventos(evs);
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
    const atualizados = atualizarStatusCheckIns(lista, eventos);
    saveCheckIns(atualizados);
    setCheckIns(atualizados);
    track.checkinFeito(dados.localId);
    setTela('home');
  };

  const handleAbrirPassagem = (checkIn) => {
    setPassagemSelecionada(checkIn);
    setTela('passagem');
  };

  const handleVerAmostras = (checkIn) => {
    if (checkIn.status !== 'pronto') {
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
      track.viuAmostras(checkIn.localId);
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