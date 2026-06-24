// src/data/tags.js
//
// Dicionário oficial de compatibilização — derivado da tabela
// "TAGS - SEPARAÇÕES Lr" do admin (Anderson).
//
//   tag      = IA Tag (o que a IA identifica / o que sugerimos ao cliente)
//   marca    = Tag Principal  → vai em `mainType` na URL
//   sub      = Tag Secundária → vai em `subType` (só Honda e Yamaha)
//   estilo   = Tag Genérica   → vai em `genericType`
//
// REGRA DE OURO: se o modelo digitado pelo cliente não estiver aqui,
// a URL sai só com mainType (comportamento atual) — nada quebra.
//
// Pra adicionar/corrigir uma tag: edita aqui, commit, push. Netlify
// redeploya sozinho.

export const TAGS_MODELOS = [
  // ───────────── HONDA — CG's ─────────────
  { tag: 'CG 125', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CG 150', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CG 150 Fan', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CG 150 Sport', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CG 150 Start', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CG 150 Titan', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CG 160', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CG 160 Cargo', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CG 160 Fan', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CG 160 Sport', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CG 160 Start', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CG 160 Street', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CG 160 Titan', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CG 160i CBS', marca: 'Honda', sub: "CG's", estilo: null },
  { tag: 'CB 160', marca: 'Honda', sub: "CG's", estilo: null },

  // ───────────── HONDA — Até 300cc ─────────────
  { tag: 'CB 250 Twister', marca: 'Honda', sub: 'Até 300cc', estilo: 'Street' },
  { tag: 'CB 250F Twister', marca: 'Honda', sub: 'Até 300cc', estilo: 'Street' },
  { tag: 'CB 300', marca: 'Honda', sub: 'Até 300cc', estilo: 'Street' },
  { tag: 'CB 300F', marca: 'Honda', sub: 'Até 300cc', estilo: 'Street' },
  { tag: 'CB 300F Twister', marca: 'Honda', sub: 'Até 300cc', estilo: 'Street' },
  { tag: 'CB 300F Sahara', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'CB 300R', marca: 'Honda', sub: 'Até 300cc', estilo: 'Street' },
  { tag: 'CBR 250R', marca: 'Honda', sub: 'Até 300cc', estilo: 'Carenada' },
  { tag: 'CBX 200', marca: 'Honda', sub: 'Até 300cc', estilo: 'Street' },
  { tag: 'CBX 250 Twister', marca: 'Honda', sub: 'Até 300cc', estilo: 'Street' },
  { tag: 'Bros', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'NXR 150 Bros', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'NXR 160 Bros', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'Bros 160 Rally', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'XRE 190', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'XRE 190 Rally', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'XRE 300', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'XRE 300 Adventure', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'XRE 300 Rally', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'XRE 300 Sahara', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'Sahara 300', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'Sahara 300 Rally', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'Sahara 350', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'XR 250 Tornado', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'Tornado', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'XR 300 Rally', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'XLX', marca: 'Honda', sub: 'Até 300cc', estilo: 'Trail' },
  { tag: 'Biz 110i', marca: 'Honda', sub: 'Até 300cc', estilo: 'Scooter' },
  { tag: 'Biz 125', marca: 'Honda', sub: 'Até 300cc', estilo: 'Scooter' },
  { tag: 'Pop 110i', marca: 'Honda', sub: 'Até 300cc', estilo: 'Scooter' },
  { tag: 'PCX 150', marca: 'Honda', sub: 'Até 300cc', estilo: 'Scooter' },
  { tag: 'PCX 160', marca: 'Honda', sub: 'Até 300cc', estilo: 'Scooter' },
  { tag: 'PCX DLX', marca: 'Honda', sub: 'Até 300cc', estilo: 'Scooter' },
  { tag: 'ADV 150', marca: 'Honda', sub: 'Até 300cc', estilo: 'Scooter' },
  { tag: 'Elite 125', marca: 'Honda', sub: 'Até 300cc', estilo: 'Scooter' },
  { tag: 'SH 125i', marca: 'Honda', sub: 'Até 300cc', estilo: 'Scooter' },

  // ───────────── HONDA — Acima 400cc ─────────────
  { tag: 'CB 500F', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Naked' },
  { tag: 'CB 500X', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Trail' },
  { tag: 'CB 500X Rally', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Trail' },
  { tag: 'CB 600F Hornet', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Naked' },
  { tag: 'CB 650F', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Naked' },
  { tag: 'CB 650R', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Naked' },
  { tag: 'CB 1000R', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Carenada' },
  { tag: 'Hornet', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Naked' },
  { tag: 'Hornet 500F', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Naked' },
  { tag: 'Hornet 600', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Naked' },
  { tag: 'CBR 500R', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Carenada' },
  { tag: 'CBR 600RR', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Carenada' },
  { tag: 'CBR 650R', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Carenada' },
  { tag: 'CBR 1000RR', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Carenada' },
  { tag: 'CBR 1000RR Fireblade', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Carenada' },
  { tag: 'Fireblade', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Carenada' },
  { tag: 'CBX 750', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Naked' },
  { tag: 'NC 750X', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Trail' },
  { tag: 'NX 500', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Trail' },
  { tag: 'NX4 Falcon', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Trail' },
  { tag: 'Falcon', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Trail' },
  { tag: 'Transalp', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Trail' },
  { tag: 'XL750 Transalp', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Trail' },
  { tag: 'Africa Twin', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Trail' },
  { tag: 'Africa Twin 1100', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Trail' },
  { tag: 'Africa Twin 750', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Trail' },
  { tag: 'CRF 1000', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Trail' },
  { tag: 'X-ADV', marca: 'Honda', sub: 'Acima 400cc', estilo: 'Scooter' },
  { tag: 'ADV 350', marca: 'Honda', sub: null, estilo: 'Scooter' },

  // ───────────── YAMAHA — Até 250cc ─────────────
  { tag: 'Factor 150', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Street' },
  { tag: 'Factor DX', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Street' },
  { tag: 'Fazer 150', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Street' },
  { tag: 'Fazer 250', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Street' },
  { tag: 'Fazer FZ-15', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Street' },
  { tag: 'Fazer FZ-25', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Street' },
  { tag: 'FZ15', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Street' },
  { tag: 'FZ25', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Street' },
  { tag: 'YBR 125', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Street' },
  { tag: 'YBR 150 Factor', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Street' },
  { tag: 'YS 150', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Street' },
  { tag: 'YS 250', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Street' },
  { tag: 'Crosser 150', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Trail' },
  { tag: 'XTZ 150 Crosser', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Trail' },
  { tag: 'XTZ 125', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Trail' },
  { tag: 'XTZ 250', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Trail' },
  { tag: 'XTZ 250 Lander', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Trail' },
  { tag: 'Lander 250', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Trail' },
  { tag: 'Lander S', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Trail' },
  { tag: 'Tenere 250', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Trail' },
  { tag: 'XT 225', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Trail' },
  { tag: 'XT 250', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Trail' },
  { tag: 'DT 180', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Trail' },
  { tag: 'DT 200 R', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Trail' },
  { tag: 'NMAX', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Scooter' },
  { tag: 'YZF-R15', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Street' },
  { tag: 'R15', marca: 'Yamaha', sub: 'Até 250cc', estilo: 'Carenada' },

  // ───────────── YAMAHA — Acima 300cc ─────────────
  { tag: 'MT-03', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Naked' },
  { tag: 'MT-07', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Naked' },
  { tag: 'MT-09', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Naked' },
  { tag: 'MT-09 Tracer', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Trail' },
  { tag: 'Tracer 9 GT', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Trail' },
  { tag: 'Tracer 900', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Trail' },
  { tag: 'Tenere 700', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Trail' },
  { tag: 'Super Ténéré', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Trail' },
  { tag: 'Super Tenere 1200', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Trail' },
  { tag: 'XT 600', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Trail' },
  { tag: 'XT 660', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Trail' },
  { tag: 'XT 660Z Tenere', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Trail' },
  { tag: 'XJ6', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Naked' },
  { tag: 'XJ6 N', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Naked' },
  { tag: 'XJ6F', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Carenada' },
  { tag: 'FZ6 Fazer', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Naked' },
  { tag: 'FZ-09', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Naked' },
  { tag: 'YZF-R1', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Carenada' },
  { tag: 'R1', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Carenada' },
  { tag: 'R3', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Carenada' },
  { tag: 'R6', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Carenada' },
  { tag: 'TDM 850', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Naked' },
  { tag: 'XMAX', marca: 'Yamaha', sub: 'Acima 300cc', estilo: 'Scooter' },
  { tag: 'XMAX 250', marca: 'Yamaha', sub: null, estilo: 'Scooter' },
  { tag: 'TMAX', marca: 'Yamaha', sub: null, estilo: 'Scooter' },

  // ───────────── KAWASAKI ─────────────
  { tag: 'Ninja 300', marca: 'Kawasaki', sub: null, estilo: 'Carenada' },
  { tag: 'Ninja 400', marca: 'Kawasaki', sub: null, estilo: 'Carenada' },
  { tag: 'Ninja 500', marca: 'Kawasaki', sub: null, estilo: 'Carenada' },
  { tag: 'Ninja 650', marca: 'Kawasaki', sub: null, estilo: 'Carenada' },
  { tag: 'Ninja 1000', marca: 'Kawasaki', sub: null, estilo: 'Carenada' },
  { tag: 'Ninja ZX-4R', marca: 'Kawasaki', sub: null, estilo: 'Carenada' },
  { tag: 'Ninja ZX-6R', marca: 'Kawasaki', sub: null, estilo: 'Carenada' },
  { tag: 'Ninja ZX-10R', marca: 'Kawasaki', sub: null, estilo: 'Carenada' },
  { tag: 'Ninja H2', marca: 'Kawasaki', sub: null, estilo: 'Carenada' },
  { tag: 'Z300', marca: 'Kawasaki', sub: null, estilo: 'Naked' },
  { tag: 'Z400', marca: 'Kawasaki', sub: null, estilo: 'Naked' },
  { tag: 'Z650', marca: 'Kawasaki', sub: null, estilo: 'Naked' },
  { tag: 'Z750', marca: 'Kawasaki', sub: null, estilo: 'Naked' },
  { tag: 'Z800', marca: 'Kawasaki', sub: null, estilo: 'Naked' },
  { tag: 'Z900', marca: 'Kawasaki', sub: null, estilo: 'Naked' },
  { tag: 'Z900RS', marca: 'Kawasaki', sub: null, estilo: 'Naked' },
  { tag: 'Z1000', marca: 'Kawasaki', sub: null, estilo: 'Naked' },
  { tag: 'ER-6n', marca: 'Kawasaki', sub: null, estilo: 'Naked' },
  { tag: 'Versys 650', marca: 'Kawasaki', sub: null, estilo: 'Trail' },
  { tag: 'Versys 1000', marca: 'Kawasaki', sub: null, estilo: 'Trail' },
  { tag: 'Versys-X 300', marca: 'Kawasaki', sub: null, estilo: 'Trail' },
  { tag: 'Vulcan S', marca: 'Kawasaki', sub: null, estilo: 'Custom' },

  // ───────────── SUZUKI ─────────────
  { tag: 'Bandit 650', marca: 'Suzuki', sub: null, estilo: 'Naked' },
  { tag: 'Bandit 1200', marca: 'Suzuki', sub: null, estilo: 'Naked' },
  { tag: 'Bandit S 1250', marca: 'Suzuki', sub: null, estilo: 'Naked' },
  { tag: 'GSX-S750', marca: 'Suzuki', sub: null, estilo: 'Naked' },
  { tag: 'GSX-S1000', marca: 'Suzuki', sub: null, estilo: 'Carenada' },
  { tag: 'GSX-S1000GT', marca: 'Suzuki', sub: null, estilo: null },
  { tag: 'GSX-R 750', marca: 'Suzuki', sub: null, estilo: 'Carenada' },
  { tag: 'GSX-R 1000', marca: 'Suzuki', sub: null, estilo: 'Carenada' },
  { tag: 'GSX-8S', marca: 'Suzuki', sub: null, estilo: null },
  { tag: 'SRAD 750', marca: 'Suzuki', sub: null, estilo: 'Carenada' },
  { tag: 'Hayabusa', marca: 'Suzuki', sub: null, estilo: 'Carenada' },
  { tag: 'V-Strom 650', marca: 'Suzuki', sub: null, estilo: 'Trail' },
  { tag: 'V-Strom 800', marca: 'Suzuki', sub: null, estilo: 'Trail' },
  { tag: 'V-Strom 1000', marca: 'Suzuki', sub: null, estilo: 'Trail' },
  { tag: 'V-Strom 1050', marca: 'Suzuki', sub: null, estilo: 'Trail' },
  { tag: 'Intruder', marca: 'Suzuki', sub: null, estilo: 'Custom' },
  { tag: 'DR300', marca: 'Suzuki', sub: null, estilo: 'Trail' },
  { tag: 'GS500', marca: 'Suzuki', sub: null, estilo: 'Naked' },

  // ───────────── BMW ─────────────
  { tag: 'G 310 R', marca: 'BMW', sub: null, estilo: 'Naked' },
  { tag: 'G 310 GS', marca: 'BMW', sub: null, estilo: 'Trail' },
  { tag: 'F 750 GS', marca: 'BMW', sub: null, estilo: 'Trail' },
  { tag: 'F 800 GS', marca: 'BMW', sub: null, estilo: 'Trail' },
  { tag: 'F 850 GS', marca: 'BMW', sub: null, estilo: 'Trail' },
  { tag: 'F 850 GS Adventure', marca: 'BMW', sub: null, estilo: 'Trail' },
  { tag: 'F 900 GS', marca: 'BMW', sub: null, estilo: 'Trail' },
  { tag: 'F 900 R', marca: 'BMW', sub: null, estilo: 'Naked' },
  { tag: 'R 1200 GS', marca: 'BMW', sub: null, estilo: 'Trail' },
  { tag: 'R 1250 GS', marca: 'BMW', sub: null, estilo: 'Trail' },
  { tag: 'R 1250 GS Adventure', marca: 'BMW', sub: null, estilo: 'Trail' },
  { tag: 'R 1300 GS', marca: 'BMW', sub: null, estilo: 'Trail' },
  { tag: 'R nineT', marca: 'BMW', sub: null, estilo: 'Naked' },
  { tag: 'S 1000 R', marca: 'BMW', sub: null, estilo: 'Carenada' },
  { tag: 'S 1000 RR', marca: 'BMW', sub: null, estilo: 'Carenada' },
  { tag: 'S 1000 XR', marca: 'BMW', sub: null, estilo: 'Trail' },
  { tag: 'K 1600 GT', marca: 'BMW', sub: null, estilo: 'Carenada | Custom' },
  { tag: 'RT 1250', marca: 'BMW', sub: null, estilo: 'Carenada | Custom' },
  { tag: 'HP4', marca: 'BMW', sub: null, estilo: 'Carenada' },

  // ───────────── TRIUMPH ─────────────
  { tag: 'Trident 660', marca: 'Triumph', sub: null, estilo: 'Naked' },
  { tag: 'Street Triple 765', marca: 'Triumph', sub: null, estilo: 'Naked' },
  { tag: 'Street Triple 765 RS', marca: 'Triumph', sub: null, estilo: 'Naked' },
  { tag: 'Speed Triple', marca: 'Triumph', sub: null, estilo: 'Naked' },
  { tag: 'Daytona 660', marca: 'Triumph', sub: null, estilo: 'Carenada' },
  { tag: 'Daytona 675', marca: 'Triumph', sub: null, estilo: 'Carenada' },
  { tag: 'Bonneville T120', marca: 'Triumph', sub: null, estilo: 'Custom | Naked' },
  { tag: 'Scrambler 900', marca: 'Triumph', sub: null, estilo: 'Custom | Naked' },
  { tag: 'Scrambler 1200', marca: 'Triumph', sub: null, estilo: 'Custom | Naked' },
  { tag: 'Scrambler 400 X', marca: 'Triumph', sub: null, estilo: 'Naked' },
  { tag: 'Street Scrambler', marca: 'Triumph', sub: null, estilo: 'Naked' },
  { tag: 'Tiger 660', marca: 'Triumph', sub: null, estilo: 'Trail' },
  { tag: 'Tiger Sport 660', marca: 'Triumph', sub: null, estilo: 'Trail' },
  { tag: 'Tiger 800', marca: 'Triumph', sub: null, estilo: 'Trail' },
  { tag: 'Tiger 850 Sport', marca: 'Triumph', sub: null, estilo: 'Trail' },
  { tag: 'Tiger 900', marca: 'Triumph', sub: null, estilo: 'Trail' },
  { tag: 'Tiger 900 Rally', marca: 'Triumph', sub: null, estilo: 'Trail' },
  { tag: 'Tiger 900 GT Pro', marca: 'Triumph', sub: null, estilo: 'Trail' },
  { tag: 'Tiger 1200', marca: 'Triumph', sub: null, estilo: 'Trail' },
  { tag: 'Rocket 3', marca: 'Triumph', sub: null, estilo: 'Custom | Naked' },

  // ───────────── DUCATI ─────────────
  { tag: 'Monster', marca: 'Ducati', sub: null, estilo: null },
  { tag: 'Diavel', marca: 'Ducati', sub: null, estilo: null },
  { tag: 'Panigale', marca: 'Ducati', sub: null, estilo: null },
  { tag: 'Panigale V4', marca: 'Ducati', sub: null, estilo: null },
  { tag: 'Panigale V4 R', marca: 'Ducati', sub: null, estilo: null },
  { tag: '1199 Panigale', marca: 'Ducati', sub: null, estilo: 'Carenada' },
  { tag: 'Streetfighter V4', marca: 'Ducati', sub: null, estilo: null },
  { tag: 'Multistrada V2', marca: 'Ducati', sub: null, estilo: null },
  { tag: 'Multistrada V4', marca: 'Ducati', sub: null, estilo: null },
  { tag: 'Multistrada V4 Rally', marca: 'Ducati', sub: null, estilo: null },

  // ───────────── ROYAL ENFIELD ─────────────
  { tag: 'Classic 350', marca: 'Royal Enfield', sub: null, estilo: null },
  { tag: 'Meteor 350', marca: 'Royal Enfield', sub: null, estilo: null },
  { tag: 'Meteor 650', marca: 'Royal Enfield', sub: null, estilo: null },
  { tag: 'Super Meteor 650', marca: 'Royal Enfield', sub: null, estilo: null },
  { tag: 'Himalayan', marca: 'Royal Enfield', sub: null, estilo: null },
  { tag: 'Scram 411', marca: 'Royal Enfield', sub: null, estilo: null },

  // ───────────── KTM ─────────────
  { tag: 'Duke 200', marca: 'KTM', sub: null, estilo: null },
  { tag: 'Duke 390', marca: 'KTM', sub: null, estilo: null },
  { tag: '790 Duke', marca: 'KTM', sub: null, estilo: null },
  { tag: '790 Adventure', marca: 'KTM', sub: null, estilo: null },

  // ───────────── OUTRAS ─────────────
  { tag: 'Dominar 400', marca: 'Outras', sub: null, estilo: 'Street' },
  { tag: 'Dominar 250', marca: 'Outras', sub: null, estilo: 'Street' },
  { tag: 'Pulsar NS200', marca: 'Outras', sub: null, estilo: 'Street' },
  { tag: 'Pulsar NS 400', marca: 'Outras', sub: null, estilo: 'Street' },
  { tag: 'Apache 200', marca: 'Outras', sub: null, estilo: 'Street' },
  { tag: 'Haojue DK150', marca: 'Outras', sub: null, estilo: 'Street' },
  { tag: 'Haojue NK150', marca: 'Outras', sub: null, estilo: 'Street' },
  { tag: 'Shineray', marca: 'Outras', sub: null, estilo: 'Street' },
  { tag: 'Zontes', marca: 'Outras', sub: null, estilo: 'Street' },
  { tag: 'DR 160', marca: 'Outras', sub: null, estilo: 'Street' },
  { tag: 'Iron 883', marca: 'Outras', sub: null, estilo: 'Custom' },
  { tag: 'Sportster 883', marca: 'Outras', sub: null, estilo: 'Custom' },
  { tag: 'Fat Boy', marca: 'Outras', sub: null, estilo: 'Custom' },
  { tag: 'Fat Bob', marca: 'Outras', sub: null, estilo: 'Custom' },
  { tag: 'Road Glide', marca: 'Outras', sub: null, estilo: 'Custom' },
  { tag: 'Night Rod Special', marca: 'Outras', sub: null, estilo: 'Custom' },
  { tag: 'V-Rod', marca: 'Outras', sub: null, estilo: 'Custom' },
  { tag: 'Shadow 600', marca: 'Outras', sub: null, estilo: 'Custom' },
  { tag: 'Shadow 750', marca: 'Outras', sub: null, estilo: 'Custom' },
  { tag: 'Drag Star', marca: 'Outras', sub: null, estilo: 'Custom' },
  { tag: 'Midnight Star', marca: 'Outras', sub: null, estilo: 'Custom' },
  { tag: 'Rebel 1100', marca: 'Outras', sub: null, estilo: 'Custom' },
  { tag: 'Burgman 400', marca: 'Outras', sub: null, estilo: 'Scooter' },
  { tag: 'Citycom 300i', marca: 'Outras', sub: null, estilo: 'Scooter' },
  { tag: 'Maxsym 400', marca: 'Outras', sub: null, estilo: 'Scooter' },
  { tag: 'Maxsym TL', marca: 'Outras', sub: null, estilo: 'Scooter' },
  { tag: 'AK 550', marca: 'Outras', sub: null, estilo: 'Scooter' },
  { tag: 'Xciting 300i', marca: 'Outras', sub: null, estilo: 'Scooter' },
  { tag: 'F4', marca: 'Outras', sub: null, estilo: 'Carenada' },
  { tag: 'Kasinski', marca: 'Outras', sub: null, estilo: 'Carenada' }
];

// Marcas com Tag Secundária (cilindrada) aplicável, conforme a tabela.
const MARCAS_COM_SUB = ['Honda', 'Yamaha'];

// ─────────────────────────────────────────────────────────────────
// IDs reais do banco do sofoto (tabela de tags, query 11/06/2026).
// O parâmetro `subType` da URL espera o ID NUMÉRICO, não o texto.
// (mainType e genericType usam o texto/Title direto.)
// ─────────────────────────────────────────────────────────────────
const SUBTYPE_IDS = {
  Honda: {
    "CG's": '72',
    'Até 300cc': '77',
    'Acima 400cc': '67'
  },
  Yamaha: {
    'Até 250cc': '63',
    'Acima 300cc': '64'
  }
};

/**
 * Converte o texto da Tag Secundária no ID que a URL do sofoto espera.
 * Retorna null se a marca/tag não tiver ID cadastrado.
 */
export function subTypeParaId(marca, subTexto) {
  if (!marca || !subTexto) return null;
  return SUBTYPE_IDS[marca]?.[subTexto] || null;
}

/**
 * Normaliza texto pra comparação: minúsculas + sem acentos.
 * Resolve "Ténéré" vs "tenere", "até" vs "ate", e o auto-capitalize
 * dos teclados mobile.
 */
function normalizar(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Busca sugestões de modelo pra uma marca (autocomplete).
 * Tolerante: ignora caixa, acentos e ordem das palavras —
 * "titan 160" acha "CG 160 Titan".
 */
export function buscarSugestoes(marca, texto, limite = 8) {
  const candidatos = TAGS_MODELOS.filter((t) => t.marca === marca);
  const termo = normalizar(texto);
  if (!termo) return candidatos.slice(0, limite).map((t) => t.tag);

  const tokens = termo.split(/\s+/);
  return candidatos
    .filter((t) => {
      const tagNorm = normalizar(t.tag);
      return tokens.every((tok) => tagNorm.includes(tok));
    })
    .slice(0, limite)
    .map((t) => t.tag);
}

/**
 * Busca GLOBAL (todas as marcas) — usada quando o cliente começa
 * direto pelo modelo, sem ter escolhido marca. Retorna objetos
 * { tag, marca } pra UI exibir a marca junto e derivá-la ao escolher.
 *
 * Sugestões que COMEÇAM com o termo vêm primeiro (mais provável).
 */
export function buscarSugestoesGlobal(texto, limite = 8) {
  const termo = normalizar(texto);
  if (!termo) return [];

  const tokens = termo.split(/\s+/);
  const matches = TAGS_MODELOS.filter((t) => {
    const tagNorm = normalizar(t.tag);
    return tokens.every((tok) => tagNorm.includes(tok));
  });

  // Prioriza tags que começam com o que foi digitado
  matches.sort((a, b) => {
    const aStarts = normalizar(a.tag).startsWith(termo) ? 0 : 1;
    const bStarts = normalizar(b.tag).startsWith(termo) ? 0 : 1;
    return aStarts - bStarts;
  });

  return matches.slice(0, limite).map((t) => ({ tag: t.tag, marca: t.marca }));
}

/**
 * Resolve as tags de URL pra um modelo digitado/escolhido.
 * Retorna { mainType, subType, genericType } — campos null quando
 * não aplicáveis ou modelo desconhecido.
 *
 * Estratégia de matching (na ordem):
 *   1. Match exato (case-insensitive)
 *   2. Match por inclusão: a IA Tag está contida no texto do cliente
 *      ou vice-versa (cobre "minha CG 160 Titan vermelha")
 * Se nada bater, retorna só a marca → URL sai como hoje, nada quebra.
 */
export function resolverTags(marca, modeloTexto) {
  const base = { mainType: marca || null, subType: null, subTexto: null, genericType: null };
  if (!modeloTexto || !modeloTexto.trim()) return base;

  const termo = normalizar(modeloTexto);
  const candidatos = TAGS_MODELOS.filter((t) => !marca || t.marca === marca);

  // 1. Exato
  let match = candidatos.find((t) => normalizar(t.tag) === termo);

  // 2. Inclusão, em duas direções com preferências distintas:
  //    a) O texto do cliente CONTÉM uma tag (ex: "minha CG 160 Titan")
  //       → prefere a tag mais LONGA (mais específica) contida no texto.
  //    b) O texto está CONTIDO numa tag (ex: cliente digitou só "CB 500")
  //       → prefere a tag mais CURTA (a mais próxima do que foi digitado).
  if (!match) {
    const tagDentroDoTermo = candidatos
      .filter((t) => termo.includes(normalizar(t.tag)))
      .sort((a, b) => b.tag.length - a.tag.length);
    match = tagDentroDoTermo[0];
  }

  if (!match) {
    const termoDentroDaTag = candidatos
      .filter((t) => normalizar(t.tag).includes(termo))
      .sort((a, b) => a.tag.length - b.tag.length);
    match = termoDentroDaTag[0];
  }

  if (!match) return base;

  const subTexto = MARCAS_COM_SUB.includes(match.marca) ? match.sub : null;

  return {
    mainType: match.marca,
    // subType vai como ID numérico (formato que a URL do sofoto espera)
    subType: subTypeParaId(match.marca, subTexto),
    subTexto, // texto legível, caso a UI queira exibir
    genericType: match.estilo
  };
}
