// src/data/previsoes.js
//
// Previsão de quando as fotos costumam ser publicadas, por local.
// Mostrado na tela "Aguardando publicação" pra alinhar expectativa do
// cliente e reduzir ansiedade de ficar checando.
//
// Como atualizar (vocês, admins):
//   1. Edite a string da `previsao` do local que quiser ajustar.
//   2. Commit + push → Netlify faz redeploy automático.
//   3. Clientes veem o texto novo na próxima abertura do app.
//
// Sugestões de copy:
//   "até quarta-feira"
//   "em 24 a 48 horas"
//   "ainda hoje à noite"
//   "ao longo da semana"
//   "" (string vazia desliga a previsão e usa o texto padrão)

const PREVISOES = {
  km70: 'em até 48 horas'
  // Exemplo de futuros:
  // mirante: 'até segunda-feira',
  // serra: 'em até 72 horas'
};

export function getPrevisaoLocal(localId) {
  const valor = PREVISOES[localId];
  return valor && valor.trim() ? valor : null;
}
