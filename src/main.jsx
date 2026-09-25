import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import BuscaPublica from './components/BuscaPublica.jsx';
import './index.css';

// /buscar e /buscar/<evento>: busca por foto aberta a qualquer cliente (link colocado no Só Foto),
// sem cadastro. O resto é o app de check-in.
const rota = window.location.pathname.match(/^\/buscar\/?([^/?#]*)/);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {rota ? <BuscaPublica evento={decodeURIComponent(rota[1] || '') || null} /> : <App />}
  </React.StrictMode>
);
