// src/data/locais.js
//
// Pontos onde o Eu Na Garupa fotografa. O local é identificado pelo
// SUFIXO DO SLUG do evento (padronizado e confiável), não pelo
// eventAddress (que varia de grafia entre eventos do mesmo ponto).

export const LOCAIS = [
  {
    id: 'frutaria1',
    nome: 'Frutaria Rondon 1',
    descricao: 'SP-300 KM 70 — Jundiaí',
    slugSufixo: 'frutas-rondon-1'
  },
  {
    id: 'frutaria2',
    nome: 'Frutaria Rondon 2',
    descricao: 'SP-360 KM 71',
    slugSufixo: 'frutas-rondon-2'
  },
  {
    id: 'box1200',
    nome: 'Box 1200',
    descricao: 'Box 1200',
    slugSufixo: 'box-1200'
  }
];

export function getLocalById(id) {
  return LOCAIS.find((l) => l.id === id) || null;
}
