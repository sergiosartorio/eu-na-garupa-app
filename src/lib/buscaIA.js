// src/lib/buscaIA.js
//
// Busca por foto: a IA roda no próprio celular do cliente (nada é enviado para servidor).
// Detector yolo11n + reID LMBN (128 dimensões) + histogramas de cor HSV, exatamente como o
// programa do notebook (biometria/busca_indice.py) calcula para as fotos do evento.
// Qualquer mudança aqui precisa ser feita igual lá.

const BASE = '/busca/';
const VEIC = [1, 2, 3, 5, 7], CARRO = [2, 5, 7], KEEP = [0, 1, 2, 3, 5, 7];

// ---------------------------------------------------------------- dados do evento
export async function carregarIndice(evento) {
  const r = await fetch(`/.netlify/functions/busca?evento=${encodeURIComponent(evento)}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Falha ao carregar a busca (${r.status})`);
  const D = await r.json();
  const b64 = (s) => Uint8Array.from(atob(s || ''), (c) => c.charCodeAt(0));
  const R = b64(D.R), H = b64(D.H);
  D.Ri8 = new Int8Array(R.buffer, R.byteOffset, R.byteLength);
  D.H16 = new Uint16Array(H.buffer, H.byteOffset, H.byteLength / 2);
  D.N = D.fotos.length;
  D.gruposDe = Array.from({ length: D.N }, () => []);
  D.grupos.forEach((g, k) => g.forEach((i) => D.gruposDe[i].push(k)));
  D.subsDe = Array.from({ length: D.N }, () => []);
  D.subs.forEach((s, k) => D.subsDe[s[0]].push(k));
  D.minuto = D.fotos.map(([, h]) => { const [a, b, c] = h.split(':').map(Number); return a * 60 + b + c / 60; });
  return D;
}

export async function carregarFotosSofoto(place, dataISO) {
  if (!place) return {};
  const [y, m, d] = dataISO.split('-');
  const q = new URLSearchParams({ place, date: `${d}/${m}/${y}` });
  const r = await fetch(`/.netlify/functions/sofoto-fotos?${q}`);
  if (!r.ok) throw new Error('Não consegui ler as fotos do Só Foto');
  return (await r.json()).fotos || {};
}

// ---------------------------------------------------------------- IA no aparelho
let sessoes = null;
function carregarScript(src) {
  return new Promise((ok, erro) => {
    if (window.ort) return ok();
    const s = document.createElement('script');
    s.src = src; s.onload = () => ok(); s.onerror = () => erro(new Error('não carregou ' + src));
    document.head.appendChild(s);
  });
}
async function baixar(url, onProg, base, peso) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('não baixou ' + url);
  const tot = +r.headers.get('content-length') || 0;
  if (!r.body || !tot) return new Uint8Array(await r.arrayBuffer());
  const rd = r.body.getReader(), partes = []; let n = 0;
  for (;;) { const { done, value } = await rd.read(); if (done) break; partes.push(value); n += value.length; onProg?.(base + peso * n / tot); }
  const out = new Uint8Array(n); let o = 0; for (const p of partes) { out.set(p, o); o += p.length; }
  return out;
}
export async function carregarIA(onProg) {
  if (sessoes) return sessoes;
  await carregarScript(BASE + 'ort.wasm.min.js');
  const ort = window.ort;
  ort.env.wasm.numThreads = 1;
  const abs = new URL(BASE, location.href).href;
  ort.env.wasm.wasmPaths = { mjs: abs + 'ort-wasm-simd-threaded.mjs', wasm: abs + 'ort-wasm-simd-threaded.wasm' };
  const det = await baixar(BASE + 'detector.onnx', onProg, 0, 0.3);
  const rid = await baixar(BASE + 'reid.onnx', onProg, 0.3, 0.6);
  sessoes = { ort, det: await ort.InferenceSession.create(det), rid: await ort.InferenceSession.create(rid) };
  onProg?.(1);
  return sessoes;
}

const area = (b) => Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]);
const iou = (a, b) => { const ix = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])), iy = Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1])), I = ix * iy; return I / (area(a) + area(b) - I + 1e-9); };
const sobre = (pb, bx) => { const ix = Math.max(0, Math.min(bx[2], pb[2]) - Math.max(bx[0], pb[0])), iy = Math.max(0, Math.min(bx[3], pb[3]) - Math.max(bx[1], pb[1])), cx = (pb[0] + pb[2]) / 2, w = bx[2] - bx[0];
  return ix * iy > 0.25 * area(pb) && bx[0] - 0.1 * w < cx && cx < bx[2] + 0.1 * w && pb[1] < bx[1] + 0.5 * (bx[3] - bx[1]); };

function letter(bmp) {
  const W = bmp.width, H = bmp.height, r = Math.min(640 / W, 640 / H), w = Math.round(W * r), h = Math.round(H * r);
  const c = document.createElement('canvas'); c.width = 640; c.height = 640;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.fillStyle = 'rgb(114,114,114)'; x.fillRect(0, 0, 640, 640);
  x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.drawImage(bmp, 0, 0, w, h);
  return { c, r, w, h, px: x.getImageData(0, 0, 640, 640).data };
}
async function detectar(S, L) {
  const px = L.px, t = new Float32Array(3 * 640 * 640);
  for (let i = 0, j = 0; i < 640 * 640; i++, j += 4) { t[i] = px[j] / 255; t[i + 409600] = px[j + 1] / 255; t[i + 819200] = px[j + 2] / 255; }
  const o = (await S.det.run({ [S.det.inputNames[0]]: new S.ort.Tensor('float32', t, [1, 3, 640, 640]) }))[S.det.outputNames[0]].data;
  const A = 8400, cand = [];
  for (let a = 0; a < A; a++) {
    let best = -1, bc = 0;
    for (const k of KEEP) { const v = o[(4 + k) * A + a]; if (v > bc) { bc = v; best = k; } }
    if (bc > 0.25) { const cx = o[a], cy = o[A + a], w = o[2 * A + a], h = o[3 * A + a]; cand.push({ cls: best, conf: bc, box: [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2] }); }
  }
  const out = [];
  for (const k of KEEP) {
    const cs = cand.filter((d) => d.cls === k).sort((a, b) => b.conf - a.conf), keep = [];
    for (const d of cs) if (keep.every((q) => iou(d.box, q.box) <= 0.5)) keep.push(d);
    out.push(...keep);
  }
  return out;
}
function hist(px, b) {
  const x1 = Math.max(0, Math.round(b[0])), y1 = Math.max(0, Math.round(b[1])), x2 = Math.min(640, Math.round(b[2])), y2 = Math.min(640, Math.round(b[3]));
  if ((x2 - x1) * (y2 - y1) < 50) return null;
  const h = new Float32Array(192); let n = 0;
  for (let y = y1; y < y2; y++) for (let x = x1; x < x2; x++) {
    const j = (y * 640 + x) * 4, r = px[j], g = px[j + 1], bl = px[j + 2];
    const v = Math.max(r, g, bl), mn = Math.min(r, g, bl), d = v - mn, s = v === 0 ? 0 : Math.round(255 * d / v);
    let hh = 0; if (d > 0) { if (v === r) hh = 60 * (g - bl) / d; else if (v === g) hh = 120 + 60 * (bl - r) / d; else hh = 240 + 60 * (r - g) / d; if (hh < 0) hh += 360; }
    const HH = Math.round(hh / 2); h[Math.min(Math.floor(HH * 12 / 180), 11) * 16 + Math.floor(s / 64) * 4 + Math.floor(v / 64)]++; n++;
  }
  for (let k = 0; k < 192; k++) h[k] /= n;
  return h;
}
async function reid(S, L, b) {
  const x1 = Math.trunc(Math.max(0, b[0])), y1 = Math.trunc(Math.max(0, b[1])), x2 = Math.trunc(Math.min(640, b[2])), y2 = Math.trunc(Math.min(640, b[3]));
  if (x2 - x1 < 4 || y2 - y1 < 4) return null;
  const c = document.createElement('canvas'); c.width = 128; c.height = 384;
  const x = c.getContext('2d', { willReadFrequently: true }); x.imageSmoothingEnabled = true;
  x.drawImage(L.c, x1, y1, x2 - x1, y2 - y1, 0, 0, 128, 384);
  const px = x.getImageData(0, 0, 128, 384).data, t = new Float32Array(3 * 384 * 128), N = 384 * 128;
  for (let i = 0, j = 0; i < N; i++, j += 4) { t[i] = px[j] / 255; t[i + N] = px[j + 1] / 255; t[i + 2 * N] = px[j + 2] / 255; }
  const o = await S.rid.run({ x: new S.ort.Tensor('float32', t, [1, 3, 384, 128]) });
  const f = Float32Array.from(o.f.data); let s = 0; for (const v of f) s += v * v; s = Math.sqrt(s) || 1;
  return f.map((v) => v / s);
}

/** Lê a foto do cliente: devolve as motos encontradas (a maior primeiro) e a imagem com as caixas. */
export async function analisarFoto(file, onProg) {
  const S = await carregarIA(onProg);
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const L = letter(bmp);
  const d = await detectar(S, L);
  const veics = d.filter((x) => VEIC.includes(x.cls) && x.conf > 0.35).sort((a, b) => area(b.box) - area(a.box));
  const pers = d.filter((x) => x.cls === 0 && x.conf > 0.3), subs = [], usados = new Set(), caixas = [];
  if (veics.length) {
    const A0 = area(veics[0].box);
    for (const v of veics) {
      const bx = v.box;
      if (area(bx) < 0.35 * A0 || subs.length >= 3 || caixas.some((q) => iou(bx, q) > 0.5)) continue;
      caixas.push(bx); const car = CARRO.includes(v.cls), riders = [];
      if (!car) pers.forEach((p, k) => { if (!usados.has(k) && sobre(p.box, bx)) { riders.push(p); usados.add(k); } });
      const s = { car, box: bx, nr: 0 }; const wv = bx[2] - bx[0], hv = bx[3] - bx[1]; let ub = bx;
      s.h_moto = hist(L.px, [bx[0] + .15 * wv, bx[1] + .55 * hv, bx[2] - .15 * wv, bx[3]]);
      if (riders.length) {
        ub = [Math.min(...riders.map((p) => p.box[0])), Math.min(...riders.map((p) => p.box[1])), Math.max(...riders.map((p) => p.box[2])), Math.max(...riders.map((p) => p.box[3]))];
        s.r_rider = await reid(S, L, ub);
        const t = riders.reduce((a, p) => (p.box[1] < a.box[1] ? p : a)).box, w = t[2] - t[0], h = t[3] - t[1];
        s.h_helmet = hist(L.px, [t[0] + .2 * w, t[1], t[2] - .2 * w, t[1] + .22 * h]);
        s.h_torso = hist(L.px, [t[0] + .25 * w, t[1] + .22 * h, t[2] - .25 * w, t[1] + .55 * h]);
        s.h_rider = hist(L.px, ub);
      }
      const fb = [Math.min(bx[0], ub[0]), Math.min(bx[1], ub[1]), Math.max(bx[2], ub[2]), Math.max(bx[3], ub[3])];
      s.r_full = await reid(S, L, fb);
      s.nr = car ? 0 : Math.min(3, riders.filter((p) => area(p.box) > 0.08 * wv * hv).length);
      subs.push(s);
    }
  }
  return { subs, previa: L };
}

export function desenharPrevia(canvas, previa, subs, escolhido) {
  const x = canvas.getContext('2d'); canvas.width = previa.w; canvas.height = previa.h;
  x.drawImage(previa.c, 0, 0, previa.w, previa.h, 0, 0, previa.w, previa.h);
  subs.forEach((s, k) => {
    const b = s.box, sel = k === escolhido;
    x.lineWidth = sel ? 5 : 2; x.strokeStyle = sel ? '#f5c518' : 'rgba(255,255,255,.8)';
    x.strokeRect(b[0], b[1], b[2] - b[0], b[3] - b[1]);
    x.fillStyle = sel ? '#f5c518' : 'rgba(0,0,0,.6)'; x.fillRect(b[0], Math.max(0, b[1] - 26), 84, 26);
    x.fillStyle = sel ? '#0a0a0a' : '#fff'; x.font = '700 18px Manrope, sans-serif'; x.fillText('Moto ' + (k + 1), b[0] + 8, Math.max(19, b[1] - 7));
  });
}

// ---------------------------------------------------------------- comparação
/** Sujeito da foto do índice (a moto principal da foto i) no mesmo formato de analisarFoto. */
function sujeitoDoIndice(D, k) {
  const [, car, nr, rr, rf, hh, ht, hr, hm] = D.subs[k];
  const r = (i) => (i < 0 ? null : Float32Array.from(D.Ri8.subarray(i * 128, i * 128 + 128), (v) => v / 127));
  const h = (i) => (i < 0 ? null : Float32Array.from(D.H16.subarray(i * 192, i * 192 + 192), (v) => v / 65535));
  return { car: !!car, nr, r_rider: r(rr), r_full: r(rf), h_helmet: h(hh), h_torso: h(ht), h_rider: h(hr), h_moto: h(hm) };
}

/** Probabilidade de cada foto do evento ser da mesma pessoa+moto que q. janela = [min, max] em minutos do dia. */
export function pontuar(D, q, janela, disponivel) {
  const cf = D.coef, b0 = D.b, best = new Float32Array(D.N);
  const cosR = (qv, k) => { if (!qv || k < 0) return null; let s = 0; const o = k * 128; for (let j = 0; j < 128; j++) s += qv[j] * D.Ri8[o + j]; return s / 127; };
  const inter = (qh, k) => { if (!qh || k < 0) return null; let s = 0; const o = k * 192; for (let j = 0; j < 192; j++) { const g = D.H16[o + j] / 65535; s += qh[j] < g ? qh[j] : g; } return s; };
  for (const [fi, car, nr, rr, rf, hh, ht, hr, hm] of D.subs) {
    if (disponivel && !disponivel[fi]) continue;
    if (janela && (D.minuto[fi] < janela[0] || D.minuto[fi] > janela[1])) continue;
    const xs = [cosR(q.r_rider, rr), cosR(q.r_full, rf), inter(q.h_helmet, hh), inter(q.h_torso, ht), inter(q.h_rider, hr), inter(q.h_moto, hm)];
    let z = b0; xs.forEach((x, k) => { z += cf[2 * k] * (x == null ? 0 : x) + cf[2 * k + 1] * (x == null ? 1 : 0); });
    z += cf[12] * (q.nr === nr ? 1 : 0) + cf[13] * ((q.car ? 1 : 0) !== car ? 1 : 0);
    const p = 1 / (1 + Math.exp(-z)); if (p > best[fi]) best[fi] = p;
  }
  const res = []; for (let i = 0; i < D.N; i++) if (best[i] > 0) res.push([i, best[i]]);
  return res.sort((a, b) => b[1] - a[1]);
}

// ---------------------------------------------------------------- moto cadastrada × tags do evento
const norm = (s) => (s || '').toString().trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const MARCA_IGUAL = { vw: 'volkswagen', 'harley davidson': 'harley-davidson', harley: 'harley-davidson' };
const marcaN = (s) => MARCA_IGUAL[norm(s)] || norm(s);
// cores que a IA e o cliente costumam confundir: não contam como diferentes
const COR_VIZINHA = { prata: ['cinza', 'branca'], cinza: ['prata', 'preta'], vermelha: ['vinho', 'laranja'], vinho: ['vermelha'], laranja: ['vermelha', 'amarela'], amarela: ['laranja', 'dourada'], marrom: ['bege', 'vinho'] };

/** Compara a moto do grupo g (tags do evento, índice versão 2) com a moto que o cliente cadastrou no app.
 *  marca/cor: true = igual, false = diferente, undefined = não dá para saber. conf: 2 corrigida, 1 pronta, 0 conferir. */
export function compatibilidade(D, g, perfil) {
  const t = D.tags?.[g];
  if (!t || !perfil) return null;
  const [marca, cor, conf] = t, r = { conf };
  if (marca && perfil.marca && norm(perfil.marca) !== 'outras') r.marca = marcaN(marca) === marcaN(perfil.marca);
  if (cor && perfil.cor && perfil.cor !== 'outra') {
    const cores = norm(cor).split(/\s+e\s+|,|\//).map((s) => s.trim()).filter(Boolean), minha = norm(perfil.cor);
    if (cores.includes(minha)) r.cor = true;
    else if (!cores.some((c) => (COR_VIZINHA[minha] || []).includes(c))) r.cor = false;
  }
  return r;
}
function ajuste(c) {
  if (!c) return 0;
  let a = 0;
  if (c.marca === true) a += 0.15; else if (c.marca === false) a -= 0.25;
  if (c.cor === true) a += 0.08; else if (c.cor === false) a -= 0.08;
  return a * (c.conf >= 1 ? 1 : 0.5);   // tag ainda "para conferir" pesa metade
}
/** Texto da confiança da IA para o cartão. */
export const confianca = (p) => (p >= 0.8 ? 'Muito parecida' : p >= 0.5 ? 'Parecida' : 'Pode ser');

/** Junta as fotos em "pessoas" (grupos do programa); cada cartão = uma moto + piloto.
 *  Com o perfil do cliente, quem tem a mesma marca/cor da moto cadastrada sobe na lista (e marca diferente desce). */
export function pessoas(D, res, disponivel, perfil) {
  const vistos = new Map();
  for (const [i, p] of res) {
    const g = D.gruposDe[i].length ? D.gruposDe[i][0] : null;
    const k = g != null ? 'g' + g : 'f' + i;
    if (vistos.has(k)) continue;
    const fotos = g != null ? [i, ...D.grupos[g].filter((x) => x !== i)] : [i];
    const vis = fotos.filter((x) => !disponivel || disponivel[x]);
    const compat = g != null ? compatibilidade(D, g, perfil) : null;
    if (vis.length) vistos.set(k, { chave: k, p, ordem: p + ajuste(compat), compat, fotos: vis, rotulo: g != null ? D.rotulos?.[g] || '' : '' });
  }
  return [...vistos.values()].sort((a, b) => b.ordem - a.ordem);
}

/** Depois que o cliente marcou fotos suas: grupo delas + fotos parecidas com qualquer uma delas. */
export function maisParecidas(D, marcadas, disponivel) {
  const sc = new Map();
  for (const q of marcadas) {
    for (const k of D.gruposDe[q]) for (const i of D.grupos[k]) sc.set(i, Math.max(sc.get(i) || 0, 1));
    const kq = D.subsDe[q][0];
    if (kq == null) continue;
    const t = D.minuto[q];
    for (const [i, p] of pontuar(D, sujeitoDoIndice(D, kq), [t - 45, t + 45], disponivel)) if (p > (sc.get(i) || 0)) sc.set(i, p);
  }
  for (const q of marcadas) sc.delete(q);
  return [...sc.entries()].filter(([i, p]) => (!disponivel || disponivel[i]) && p >= 0.2).sort((a, b) => b[1] - a[1]);
}

export const codigoDaFoto = (nome) => (nome.match(/IMG_(\d+)/i) || [])[1] || null;
