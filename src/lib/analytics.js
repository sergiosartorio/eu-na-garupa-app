// src/lib/analytics.js
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDN8Nick-bCruY5YmWYp6HBs60w-rQR-Aw',
  authDomain: 'eunagarupa-analytics.firebaseapp.com',
  projectId: 'eunagarupa-analytics',
  storageBucket: 'eunagarupa-analytics.firebasestorage.app',
  messagingSenderId: '733250175201',
  appId: '1:733250175201:web:68887be2385cf1357577a0',
  measurementId: 'G-EXXJW378M8'
};

let analytics = null;
try {
  const app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
} catch (e) {
  analytics = null;
}

function ev(nome, params = {}) {
  try {
    if (analytics) logEvent(analytics, nome, params);
  } catch {
    /* no-op */
  }
}

function detectarSO() {
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  return 'Outro';
}

function modoExibicao() {
  const standalone =
    window.matchMedia?.('(display-mode: standalone)')?.matches ||
    window.navigator.standalone === true;
  return standalone ? 'instalado' : 'navegador';
}

export function iniciarSessao() {
  try {
    if (analytics) {
      setUserProperties(analytics, {
        sistema: detectarSO(),
        modo: modoExibicao()
      });
    }
  } catch {
    /* no-op */
  }
  ev('app_aberto', { sistema: detectarSO(), modo: modoExibicao() });
}

export const track = {
  onboardingIniciado: () => ev('onboarding_iniciado'),
  perfilCriado: (marca, modelo) =>
    ev('perfil_criado', { marca: marca || 'nao_informado', modelo: modelo || 'nao_informado' }),
  checkinFeito: (localId) =>
    ev('checkin_feito', { local: localId || 'nao_informado' }),
  viuAmostras: (localId) =>
    ev('viu_amostras', { local: localId || 'nao_informado' }),
  appInstalado: () => ev('app_instalado', { sistema: detectarSO() })
};