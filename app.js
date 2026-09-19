(function(){
  "use strict";

  /* =========================================================
     Konfigurasi
     ========================================================= */
  const CONFIG = {
    // Nomor WhatsApp seller, format internasional tanpa "+" (cth "6281234567890").
    // Kalau kosong, tombol "Pesan" menyalin teks pesanan ke clipboard.
    WA_NUMBER: "6285774792983",
    // File JSON hasil dari tool seller (taruh sefolder dengan index.html).
    DATA_URL: "accessories.json",
    STORAGE_KEY: "aurcus-catalog-data",
    // Stok segini atau kurang ditandai "Sisa N".
    LOW_STOCK: 2
  };

  const TIPE_ORDER = ["Necklace", "Earring", "Ring"];

  // Data cadangan: dipakai kalau accessories.json tidak bisa di-fetch
  // (mis. halaman dibuka langsung dari file://) dan belum ada data yang dimuat manual.
  const DEFAULT_DATA = {
    category: "accessories",
    last_updated: "2026-09-19T07:19:46.134Z",
    items: [
      { id: "HIDDEN-KAMUI-R-115-RING", nama: "Hidden Kamui", tipe: "Ring", level: 115, varian: "R", harga: 70000, stok: 2 },
      { id: "HIDDEN-KAMUI-NOR-115-NECKLACE", nama: "Hidden Kamui", tipe: "Necklace", level: 115, varian: "non-R", harga: 70000, stok: 1 },
      { id: "HIDDEN-KAMUI-NOR-115-RING", nama: "Hidden Kamui", tipe: "Ring", level: 115, varian: "non-R", harga: 30000, stok: 9 },
      { id: "HIDDEN-KAMUI-NOR-115-EARRING", nama: "Hidden Kamui", tipe: "Earring", level: 115, varian: "non-R", harga: 30000, stok: 11 },
      { id: "KAMUI-NOR-110-EARRING", nama: "Kamui", tipe: "Earring", level: 110, varian: "non-R", harga: 30000, stok: 13 },
      { id: "KAMUI-NOR-115-EARRING", nama: "Kamui", tipe: "Earring", level: 115, varian: "non-R", harga: 35000, stok: 1 },
      { id: "KAMUI-NOR-110-NECKLACE", nama: "Kamui", tipe: "Necklace", level: 110, varian: "non-R", harga: 60000, stok: 2 },
      { id: "KAMUI-NOR-115-NECKLACE", nama: "Kamui", tipe: "Necklace", level: 115, varian: "non-R", harga: 70000, stok: 2 },
      { id: "KAMUI-NOR-110-RING", nama: "Kamui", tipe: "Ring", level: 110, varian: "non-R", harga: 30000, stok: 15 },
      { id: "KAMUI-NOR-115-RING", nama: "Kamui", tipe: "Ring", level: 115, varian: "non-R", harga: 35000, stok: 2 },
      { id: "KAMUI-R-110-EARRING", nama: "Kamui", tipe: "Earring", level: 110, varian: "R", harga: 65000, stok: 4 },
      { id: "KAMUI-R-110-RING", nama: "Kamui", tipe: "Ring", level: 110, varian: "R", harga: 65000, stok: 3 },
      { id: "KAMUI-R-115-RING", nama: "Kamui", tipe: "Ring", level: 115, varian: "R", harga: 75000, stok: 1 }
    ]
  };

  /* =========================================================
     State & elemen
     ========================================================= */
  const $ = (id) => document.getElementById(id);
  const metaEl = $("meta"), noteEl = $("note"), infoEl = $("result-info");
  const catalogEl = $("catalog"), emptyEl = $("empty");
  const qEl = $("q"), readyEl = $("ready-only");
  const toastEl = $("toast");

  let data = { category: "accessories", last_updated: null, items: [] };
  const state = { q: "", level: "all", tipe: "all", varian: "all", ready: false };

  /* =========================================================
     Helper
     ========================================================= */
  // Bikin elemen lewat textContent, jadi isi JSON tidak pernah diparse sebagai HTML.
  function h(tag, props, ...kids){
    const node = document.createElement(tag);
    if(props){
      for(const [k, v] of Object.entries(props)){
        if(v == null || v === false) continue;
        if(k === "class") node.className = v;
        else if(k === "text") node.textContent = v;
        else if(k.startsWith("on")) node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? "" : v);
      }
    }
    kids.flat().forEach((kid) => {
      if(kid == null || kid === false) return;
      node.append(kid.nodeType ? kid : document.createTextNode(kid));
    });
    return node;
  }

  const rank = (t) => { const i = TIPE_ORDER.indexOf(t); return i < 0 ? 99 : i; };
  const formatRupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");
  const varianLabel = (v) => (v === "R" ? "R" : "Non-R");

  let toastTimer = null;
  function toast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2800);
  }

  async function copyText(text){
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        await navigator.clipboard.writeText(text);
        return true;
      }
    }catch(_){ /* lanjut ke fallback */ }
    try{
      const ta = h("textarea", { readonly: true, style: "position:fixed;opacity:0" });
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    }catch(_){
      return false;
    }
  }

  /* =========================================================
     Data
     ========================================================= */
  function normalize(raw){
    if(!raw || !Array.isArray(raw.items)){
      throw new Error('Format tidak sesuai: field "items" tidak ditemukan.');
    }
    const items = raw.items.map((it) => {
      const stok = Number(it.stok);
      return {
        id: String(it.id || ""),
        nama: String(it.nama || ""),
        tipe: String(it.tipe || ""),
        level: Number(it.level),
        varian: it.varian === "R" ? "R" : "non-R",
        harga: Number(it.harga),
        stok: Number.isFinite(stok) ? stok : 0
      };
    }).filter((it) => it.id && it.nama && it.tipe && Number.isFinite(it.level) && Number.isFinite(it.harga));

    return { category: raw.category || "accessories", last_updated: raw.last_updated || null, items };
  }

  async function loadInitial(){
    // 1. Ambil dari server (jalan kalau halaman dibuka lewat http/https).
    try{
      const res = await fetch(CONFIG.DATA_URL, { cache: "no-store" });
      if(!res.ok) throw new Error("HTTP " + res.status);
      return { data: normalize(await res.json()), source: "server" };
    }catch(_){ /* lanjut */ }

    // 2. Data yang terakhir dimuat manual di perangkat ini.
    try{
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      if(saved) return { data: normalize(JSON.parse(saved)), source: "tersimpan" };
    }catch(_){ /* lanjut */ }

    // 3. Data contoh.
    return { data: normalize(DEFAULT_DATA), source: "contoh" };
  }

  function setData(next, source){
    data = next;
    renderMeta(source);
    renderChips();
    renderCatalog();
  }

  /* =========================================================
     Render
     ========================================================= */
  function renderMeta(source){
    const d = data.last_updated ? new Date(data.last_updated) : null;
    metaEl.textContent = d && !isNaN(d)
      ? "Diperbarui " + d.toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
      : "Waktu pembaruan tidak tersedia";

    const notes = {
      contoh: "Menampilkan data contoh. Muat accessories.json untuk data terbaru.",
      tersimpan: "Menampilkan data yang terakhir dimuat di perangkat ini.",
      file: "Menampilkan file yang baru dimuat."
    };
    noteEl.hidden = source === "server";
    noteEl.textContent = notes[source] || "";
  }

  function renderChips(){
    const levels = [...new Set(data.items.map((i) => String(i.level)))].sort((a, b) => b - a);
    const tipes = [...new Set(data.items.map((i) => i.tipe))].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
    const defs = {
      level: levels.map((l) => [l, l]),
      tipe: tipes.map((t) => [t, t]),
      varian: [["R", "★ R"], ["non-R", "Non-R"]]
    };

    Object.entries(defs).forEach(([key, opts]) => {
      if(state[key] !== "all" && !opts.some(([v]) => v === state[key])) state[key] = "all";
      $("chips-" + key).replaceChildren(
        ...[["all", "Semua"], ...opts].map(([value, label]) => h("button", {
          type: "button",
          class: "chip",
          "data-key": key,
          "data-value": value,
          "aria-pressed": "false",
          onclick: () => { state[key] = value; syncChips(); renderCatalog(); }
        }, label))
      );
    });
    syncChips();
  }

  function syncChips(){
    document.querySelectorAll(".chip").forEach((c) => {
      c.setAttribute("aria-pressed", String(state[c.dataset.key] === c.dataset.value));
    });
  }

  function matches(it){
    if(state.level !== "all" && String(it.level) !== state.level) return false;
    if(state.tipe !== "all" && it.tipe !== state.tipe) return false;
    if(state.varian !== "all" && it.varian !== state.varian) return false;
    if(state.ready && it.stok <= 0) return false;
    const q = state.q.trim().toLowerCase();
    if(q && !(it.nama.toLowerCase().includes(q) || it.tipe.toLowerCase().includes(q))) return false;
    return true;
  }

  // Satu kartu = satu set (nama + level), isinya baris per tipe & varian.
  function groupSets(items){
    const map = new Map();
    items.forEach((it) => {
      const key = it.nama + "|" + it.level;
      if(!map.has(key)) map.set(key, { nama: it.nama, level: it.level, rows: [] });
      map.get(key).rows.push(it);
    });
    const sets = [...map.values()];
    sets.forEach((s) => s.rows.sort((a, b) =>
      rank(a.tipe) - rank(b.tipe) || (a.varian === b.varian ? 0 : a.varian === "R" ? -1 : 1)
    ));
    sets.sort((a, b) => b.level - a.level || a.nama.localeCompare(b.nama));
    return sets;
  }

  function varianTag(v){
    return v === "R"
      ? h("span", { class: "tag r", text: "R" })
      : h("span", { class: "tag nonr", text: "Non-R" });
  }

  function rowItem(it){
    const out = it.stok <= 0;
    const low = !out && it.stok <= CONFIG.LOW_STOCK;
    const stockText = out ? "Stok kosong" : low ? "Sisa " + it.stok : it.stok + " unit";
    const cls = "row" + (it.varian === "R" ? " is-r" : "") + (out ? " is-out" : "");

    return h("li", { class: cls },
      h("div", { class: "row-what" },
        h("span", { class: "tipe", text: it.tipe }),
        varianTag(it.varian),
        h("span", { class: "stock " + (out ? "out" : low ? "low" : "ok"), text: stockText })
      ),
      h("span", { class: "price", text: formatRupiah(it.harga) }),
      h("button", {
        type: "button",
        class: "order",
        disabled: out,
        "aria-label": `Pesan ${it.nama} ${it.tipe} ${varianLabel(it.varian)} level ${it.level}`,
        onclick: () => order(it)
      }, "Pesan")
    );
  }

  function setCard(set){
    const ready = set.rows.filter((r) => r.stok > 0).length;
    return h("article", { class: "set" },
      h("header", { class: "set-head" },
        h("div", {},
          h("h2", { text: set.nama }),
          h("p", { class: "set-sub", text: ready ? `${ready} dari ${set.rows.length} ready` : "Semua stok habis" })
        ),
        h("span", { class: "lvl", "aria-label": "Level " + set.level },
          h("small", { text: "Lv" }), String(set.level))
      ),
      h("ul", { class: "rows" }, set.rows.map(rowItem))
    );
  }

  function renderCatalog(){
    const visible = data.items.filter(matches);
    catalogEl.replaceChildren(...groupSets(visible).map(setCard));
    emptyEl.hidden = visible.length > 0;
    const ready = visible.filter((i) => i.stok > 0).length;
    infoEl.textContent = visible.length ? `${visible.length} item, ${ready} ready` : "";
  }

  /* =========================================================
     Pesan via WhatsApp
     ========================================================= */
  function orderText(it){
    return [
      "Halo, saya mau beli accessory:",
      `${it.nama} ${it.tipe} ${varianLabel(it.varian)} Lv ${it.level}`,
      "Harga: " + formatRupiah(it.harga),
      "Kode: " + it.id,
      "Jumlah: 1"
    ].join("\n");
  }

  async function order(it){
    const text = orderText(it);
    if(CONFIG.WA_NUMBER){
      window.open(`https://wa.me/${CONFIG.WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      return;
    }
    const ok = await copyText(text);
    toast(ok ? "Teks pesanan disalin. Tempel ke chat WhatsApp." : "Gagal menyalin. Isi WA_NUMBER di app.js.");
  }

  /* =========================================================
     Event
     ========================================================= */
  qEl.addEventListener("input", () => { state.q = qEl.value; renderCatalog(); });
  readyEl.addEventListener("change", () => { state.ready = readyEl.checked; renderCatalog(); });

  $("reset-btn").addEventListener("click", () => {
    Object.assign(state, { q: "", level: "all", tipe: "all", varian: "all", ready: false });
    qEl.value = "";
    readyEl.checked = false;
    syncChips();
    renderCatalog();
  });

  const fileInput = $("load-input");
  $("load-btn").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try{
        const parsed = normalize(JSON.parse(evt.target.result));
        setData(parsed, "file");
        try{ localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(parsed)); }catch(_){ /* storage bisa diblok */ }
        toast(`Berhasil memuat ${parsed.items.length} item.`);
      }catch(err){
        toast("Gagal memuat file: " + err.message);
      }finally{
        fileInput.value = "";
      }
    };
    reader.readAsText(file);
  });

  /* =========================================================
     Start
     ========================================================= */
  loadInitial().then(({ data: d, source }) => setData(d, source));
})();
