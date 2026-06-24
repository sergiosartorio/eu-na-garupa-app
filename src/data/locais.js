// src/data/locais.js
//
// Pontos onde o Eu Na Garupa fotografa.
//
// `place` é o valor EXATO que vai no parâmetro ?place= da URL da galeria
// (o app cuida de codificar pra URL). A `chave` é a string usada pra cruzar
// o check-in com o evento publicado (compara com `eventAddress` da API).
//
// Pra adicionar um novo ponto: acrescenta um objeto aqui e faz redeploy.

export const LOCAIS = [
  {
    id: 'frutaria1',
    nome: 'Frutaria Rondon 1',
    descricao: 'SP-300 KM 70 — Jundiaí',
    place: 'SP 300 km 70 + Frutaria',
    chave: 'km 70'
  },
  {
    id: 'frutaria2',
    nome: 'Frutaria Rondon 2',
    descricao: 'SP-360 KM 71',
    place: 'Sp 360 km 71',
    chave: 'km 71'
  },
  {
    id: 'box1200',
    nome: 'Box 1200',
    descricao: 'Box 1200',
    place: 'Box 1200',
    chave: '1200'
  }
];

export function getLocalById(id) {
  return LOCAIS.find((l) => l.id === id) || null;
}