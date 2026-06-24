# Eu Na Garupa — App de Check-in

PWA que ajuda clientes do **Eu Na Garupa Fotos** a encontrarem suas fotos
no **Só Foto** depois de passarem por um dos pontos fotográficos.

O cliente cadastra a moto uma vez, faz um "check-in" toda vez que passa
pelo fotógrafo, e quando o evento é publicado o app libera automaticamente
um botão que abre a galeria do Só Foto já filtrada pelos dados dele.

## Como funciona

1. **Cadastro**: cliente preenche marca, modelo, cilindrada (se aplicável),
   estilo e cor da moto. Salvo apenas no `localStorage` do navegador dele.
2. **Check-in**: ao passar por um ponto, toca em "Acabei de passar" e
   registra local + data + hora.
3. **Verificação automática**: cada vez que o app abre, busca a lista de
   eventos publicados na API do Só Foto via Netlify Function (proxy de
   CORS) e cruza com os check-ins do cliente.
4. **Link liberado**: se houver evento publicado correspondente, o card
   muda para verde e o botão "Ver minhas fotos" abre a galeria do Só Foto
   já com filtros (marca, cilindrada, estilo, hora) aplicados na URL.

Toda a compra continua acontecendo no Só Foto — este app não trata
pagamento nem download.

## Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (paleta custom: preto rodovia + amarelo placa + verde liberado)
- **PWA** via `vite-plugin-pwa` (instala como app no iOS/Android)
- **Netlify Functions** como proxy pra API do Só Foto
- **Sem backend próprio** — só localStorage + função serverless

## Setup local

Requer Node.js 18+.

```bash
npm install
```

Para rodar em desenvolvimento com a Netlify Function funcionando:

```bash
# Instale a CLI da Netlify globalmente (uma vez só)
npm install -g netlify-cli

# Rode o ambiente completo (Vite + Functions)
netlify dev
```

Abre em `http://localhost:8888`.

Se quiser apenas o Vite (sem function), `npm run dev` em
`http://localhost:5173` — mas a verificação de eventos publicados não vai
funcionar nessa rota porque depende da function.

## Deploy no Netlify

1. Crie um repositório Git e faça push deste código.
2. No painel da Netlify: **Add new site → Import from Git**.
3. Aponte pro seu repo. As configs já estão prontas no `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
4. Após o primeiro deploy, o app fica em algo como `https://eu-na-garupa-app.netlify.app`. Você pode conectar um domínio próprio (ex: `app.eunagarupa.com.br`).

A function fica acessível em
`/.netlify/functions/events` automaticamente.

## Estrutura

```
eu-na-garupa-app/
├── README.md
├── package.json
├── vite.config.js          # Vite + plugin PWA
├── tailwind.config.js      # paleta + fontes
├── postcss.config.js
├── netlify.toml            # config de build e redirects
├── index.html
├── public/
│   └── favicon.svg
├── netlify/
│   └── functions/
│       └── events.js       # proxy pra api.sofoto.com.br
└── src/
    ├── main.jsx
    ├── App.jsx             # orquestra navegação entre telas
    ├── index.css           # Tailwind + componentes
    ├── data/
    │   ├── marcas.js       # 10 marcas (espelha sofoto)
    │   ├── locais.js       # PONTOS DE FOTOGRAFIA — extender aqui
    │   ├── cores.js        # paleta de cores predominantes
    │   ├── estilos.js      # mapeia para `genericType` da URL
    │   └── cilindradas.js  # subType — só Honda/Yamaha
    ├── lib/
    │   ├── storage.js      # camada de localStorage
    │   ├── api.js          # chama a Netlify Function
    │   ├── matching.js     # cruza check-ins × eventos publicados
    │   └── urlBuilder.js   # monta URL final da galeria
    └── components/
        ├── Onboarding.jsx       # cadastro em 4 passos
        ├── Home.jsx             # tela principal
        ├── CheckInModal.jsx     # registrar passagem
        ├── PassagemDetail.jsx   # detalhes + botão "Ver fotos"
        └── Settings.jsx         # config + sobre + apagar
```

## Onde mexer para tarefas comuns

### Adicionar um novo ponto fotográfico

Edite `src/data/locais.js`:

```js
{
  id: 'mirante',                      // identificador único interno
  nome: 'Mirante da Serra',           // mostrado pro cliente
  descricao: 'Atibaia',               // descrição secundária
  chave: 'Mirante'                    // trecho do eventAddress da API
}
```

A `chave` precisa bater como substring (case-insensitive) com o campo
`eventAddress` que vem da API do Só Foto. Confira o conteúdo do
`eventAddress` de um evento real desse ponto antes de definir.

### Ajustar previsão de publicação por local

Edite `src/data/previsoes.js`:

```js
const PREVISOES = {
  km70: 'em até 48 horas',
  mirante: 'até quarta-feira',
  serra: 'em até 72 horas'
};
```

Comita + push → Netlify redeploya em ~1 min. Clientes veem o texto novo
na próxima abertura do app. Aparece destacado na tela de "Aguardando
publicação" pra alinhar expectativa e reduzir verificações repetidas.

### Adicionar suporte ao filtro de cor da moto

Quando o Só Foto adicionar o parâmetro de cor na URL da galeria, edite
`src/lib/urlBuilder.js` e descomente o bloco indicado:

```js
if (perfil?.cor) url.searchParams.set('color', perfil.cor);
//                                     ^^^^^ trocar pelo nome real do parâmetro
```

### Adicionar mais marcas

Edite `src/data/marcas.js`. Para que apareça no filtro do Só Foto, o
`valor` precisa bater exatamente com o `mainType` que a galeria aceita.

### Adicionar suporte a cilindrada de outras marcas

Edite `src/data/cilindradas.js` e remova/ajuste a checagem em
`urlBuilder.js`:

```js
// Atualmente:
if (perfil?.cilindrada && (perfil.marca === 'Honda' || perfil.marca === 'Yamaha')) {
// Quando suportar mais:
if (perfil?.cilindrada) {
```

### Mudar a aparência

Toda a paleta e tipografia vivem em `tailwind.config.js`. Cores chave:
- `signal` (amarelo placa) — ações principais
- `brake` (vermelho) — destrutivo / erros
- `liberated` (verde) — passagem pronta
- `asphalt` (escala de cinzas dominante)

Fontes: `Bebas Neue` (display) e `Manrope` (body), carregadas via
Google Fonts em `index.html`.

## Roadmap (próximas versões)

### V2 — Botão "Minhas Fotos" (acervo pago do cliente)

O botão atual é **"Ver amostras"** — abre a galeria pública com marca
d'água. Quando vocês ativarem o sistema de venda integrada, surge um
segundo botão **"Minhas Fotos"** que lista as fotos que o cliente
**já pagou**, sem marca d'água, com download. Requer autenticação
(provavelmente reaproveitar o login do Só Foto).

### V2 — Notificação proativa via WhatsApp

Hoje o cliente precisa abrir o app pra ver se o evento foi publicado.
Próximo passo: integração com n8n + WhatsApp da equipe.

- Adicionar opção opcional de WhatsApp no check-in.
- Função extra que envia o check-in pra um webhook do n8n.
- n8n armazena (Google Sheet ou base própria).
- Quando vocês publicam, dispara n8n por mensagem padrão ou botão admin.
- n8n cruza e dispara WhatsApp pra cada check-in pendente daquela data+local.

### V3 — Match visual com IA

Cliente sobe uma foto da moto dele. CLIP ou Gemini Vision compara com as
fotos do evento e ranqueia as mais prováveis. Reduz "filtrei muito,
não achei nada" pra perto de zero.

### V4 — Beacon BLE

Para clientes frequentes, beacon BLE colado embaixo do banco identifica
a passagem com precisão de milissegundos. Receptor Android baratinho em
cada ponto. Vale só se o volume e fidelidade justificarem.

## Notas técnicas

### CORS

A API do Só Foto (`api.sofoto.com.br`) só libera origem `sofoto.com.br`.
O navegador bloqueia chamada direta de qualquer outra origem. Por isso
a `netlify/functions/events.js` faz proxy server-to-server: ela chama a
API (sem regras de CORS de servidor) e devolve pro app com
`Access-Control-Allow-Origin: *`.

### Cache

A function tem `Cache-Control: public, max-age=300` — Netlify CDN segura
a resposta por 5 minutos. Se publicarem um evento novo, o app pode levar
até 5 min pra mostrar como liberado (aceitável; clientes não ficam
recarregando a cada segundo).

### Resiliência do localStorage

Se o navegador rejeitar `localStorage` (modo anônimo restrito, quota
cheia), a `lib/storage.js` falha silenciosamente — o app continua
funcionando, só não persiste entre sessões.

### Por que não usar a placa

A maioria das fotos do Eu Na Garupa é frontal/lateral, sem placa visível.
ALPR sobre essa base teria taxa de cobertura baixa demais pra ser a
fundação. O cruzamento por data + local + horário + filtros de moto
cobre virtualmente 100% das passagens.
