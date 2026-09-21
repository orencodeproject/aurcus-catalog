/* =========================================================
   AURCUS MARKET - BUYER CATALOG
   Master catalog = Aurcus Stok Generator
   accessories.json = source of current stock
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIG
     ========================================================= */

  const CONFIG = {
    WA_NUMBER: "6285774792983",

    DATA_URL: "accessories.json",

    STORAGE_KEY: "aurcus-catalog-data",

    CART_KEY: "aurcus-market-cart",

    LOW_STOCK: 2
  };


  /* =========================================================
     MASTER CATALOG
     Source: Aurcus Stok Generator
     ========================================================= */

  const MASTER_BASE = [
    [115, "R",     "Heavenly Thunder",       130000],
    [115, "non-R", "Heavenly Thunder",        70000],
    [115, "R",     "Hidden Kamui",            140000],
    [115, "non-R", "Hidden Kamui",             70000],
    [115, "R",     "Hidden Phantom",           50000],
    [115, "R",     "Hidden Sword Master's",    50000],
    [115, "R",     "Kamui",                   160000],
    [115, "non-R", "Kamui",                    80000],
    [115, "R",     "Nightlight",              100000],
    [115, "non-R", "Nightlight",               30000],
    [115, "R",     "Phantom",                  60000],
    [115, "R",     "Tutelary",                80000],
    [115, "non-R", "Tutelary",                 40000],

    [110, "R",     "Dark Flame",               50000],
    [110, "R",     "Hidden Phantom",           20000],
    [110, "R",     "Hidden Sword Master's",    20000],
    [110, "R",     "Kamui",                   130000],
    [110, "non-R", "Kamui",                    60000],
    [110, "R",     "Nightlight",               40000],
    [110, "R",     "Phantom",                  30000],
    [110, "R",     "Sword Master",             30000],
    [110, "R",     "Tutelary",                50000],

    [115, "R",     "Thunderous",               40000],
    [115, "R",     "Sword Master",             60000],
    [110, "non-R", "Tutelary",                 20000],
    [110, "non-R", "Nightlight",               20000]
  ];

  const MASTER_SETS = [
    [115, "non-R", "Hidden Phantom",           25000],
    [115, "non-R", "Hidden Sword Master's",    25000],
    [115, "R",     "Majestic",                 30000],
    [115, "non-R", "Phantom",                  25000],
    [115, "non-R", "Sword Master",             25000],
    [115, "non-R", "Thunderous",               20000],

    [110, "non-R", "Dark Flame",               20000],
    [110, "non-R", "Hidden Phantom",           15000],
    [110, "non-R", "Hidden Sword Master's",    15000],
    [110, "non-R", "Phantom",                  15000],
    [110, "non-R", "Sword Master",             15000]
  ];

  /*
    Seller Tool memang menghapus:
    115 | non-R | Majestic

    Jadi tidak dimasukkan ke master aktif.
  */


  /* =========================================================
     DOM
     ========================================================= */

  const $ = (id) => document.getElementById(id);


  /* =========================================================
     STATE
     ========================================================= */

  let catalog = [];

  let filters = {
    q: "",
    level: "all",
    type: "all",
    variant: "all"
  };

  let cart = loadCart();

  let lastUpdated = null;


  /* =========================================================
     HELPERS
     ========================================================= */

  function safeNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }


  function normalizeText(value) {
    return String(value ?? "")
      .trim()
      .replace(/\s+/g, " ");
  }


  function normalizeVariant(value) {
    const v = normalizeText(value);

    if (v.toLowerCase() === "nonr") {
      return "non-R";
    }

    if (v.toLowerCase() === "non-r") {
      return "non-R";
    }

    if (v.toUpperCase() === "R") {
      return "R";
    }

    return v;
  }


  function normalizeType(value) {
    const v = normalizeText(value).toLowerCase();

    if (v === "necklace") return "Necklace";
    if (v === "ring") return "Ring";
    if (v === "earring") return "Earring";
    if (v === "set") return "Set";

    return normalizeText(value);
  }


  function itemKey(level, variant, name, type) {
    return [
      safeNumber(level),
      normalizeVariant(variant),
      normalizeText(name).toLowerCase(),
      normalizeType(type)
    ].join("|");
  }


  function formatRupiah(value) {
    return "Rp " + safeNumber(value).toLocaleString("id-ID");
  }


  function partPrice(basePrice, type) {
    if (type === "Necklace") {
      return safeNumber(basePrice);
    }

    return Math.round(safeNumber(basePrice) / 2);
  }


  function slugify(value) {
    return normalizeText(value)
      .toUpperCase()
      .replace(/'/g, "")
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }


  function makeId(level, variant, name, type) {
    const v = normalizeVariant(variant) === "R"
      ? "R"
      : "NONR";

    return (
      slugify(name) +
      "-" +
      v +
      "-" +
      safeNumber(level) +
      "-" +
      normalizeType(type).toUpperCase()
    );
  }


  function keyFromObject(item) {
    return itemKey(
      item.level,
      item.variant,
      item.name,
      item.type
    );
  }


  /* =========================================================
     BUILD MASTER CATALOG
     ========================================================= */

  function buildMasterCatalog() {
    const result = [];

    /*
      Part:
      setiap master item mempunyai 3 listing:

      Necklace
      Ring
      Earring
    */

    MASTER_BASE.forEach(([level, variant, name, basePrice]) => {

      ["Necklace", "Ring", "Earring"].forEach((type) => {

        const harga = partPrice(basePrice, type);

        result.push({
          id: makeId(level, variant, name, type),

          name,
          nama: name,

          level,
          variant,
          varian: variant,

          type,
          tipe: type.toLowerCase(),

          price: harga,
          harga,

          stock: 0,
          stok: 0,

          source: "master"
        });

      });

    });


    /*
      Set
    */

    MASTER_SETS.forEach(([level, variant, name, price]) => {

      result.push({
        id: makeId(level, variant, name, "SET"),

        name,
        nama: name,

        level,
        variant,
        varian: variant,

        type: "Set",
        tipe: "set",

        price: price,
        harga: price,

        stock: 0,
        stok: 0,

        source: "master"
      });

    });


    return result;
  }


  /* =========================================================
     JSON NORMALIZATION
     ========================================================= */

  function normalizeJsonItem(raw) {

    if (!raw || typeof raw !== "object") {
      return null;
    }

    const type = normalizeType(
      raw.tipe ??
      raw.type ??
      raw.jenis
    );

    const name = normalizeText(
      raw.nama ??
      raw.name
    );

    const level = safeNumber(
      raw.level
    );

    const variant = normalizeVariant(
      raw.varian ??
      raw.variant
    );

    if (!name || !level || !type) {
      return null;
    }

    const stock = Math.max(
      0,
      safeNumber(
        raw.stok ??
        raw.stock
      )
    );

    const price = safeNumber(
      raw.harga ??
      raw.price
    );

    return {
      id: raw.id || makeId(
        level,
        variant,
        name,
        type
      ),

      name,
      nama: name,

      level,
      variant,
      varian: variant,

      type,
      tipe: type,

      price,
      harga: price,

      stock,
      stok: stock,

      source: "json"
    };
  }


  /* =========================================================
     MERGE MASTER + JSON
     ========================================================= */

  function mergeCatalog(jsonData) {

    /*
      MASTER selalu menjadi daftar utama.
      Semua master item dimulai dari stock 0.
    */

    const master = buildMasterCatalog();

    const map = new Map();

    master.forEach((item) => {
      map.set(
        keyFromObject(item),
        {
          ...item
        }
      );
    });


    /*
      JSON masuk setelah master.

      Kalau item JSON cocok dengan master:
      → update stok + harga.

      Kalau item JSON tidak ada di master:
      → tambahkan sebagai item tambahan.
    */

    const jsonItems = Array.isArray(jsonData?.items)
      ? jsonData.items
      : [];

    jsonItems.forEach((raw) => {

      const item = normalizeJsonItem(raw);

      if (!item) {
        return;
      }

      const key = keyFromObject(item);

      if (map.has(key)) {

        const current = map.get(key);

        current.stock = item.stock;
        current.stok = item.stock;

        /*
          Harga dari JSON dipakai kalau tersedia.
          Kalau tidak ada, harga master tetap.
        */

        if (item.price > 0) {
          current.price = item.price;
          current.harga = item.price;
        }

        /*
          ID dari JSON dipertahankan kalau tersedia.
        */

        if (item.id) {
          current.id = item.id;
        }

        current.source = "master+json";

      } else {

        /*
          Item baru yang hanya muncul di JSON
          tetap ditampilkan.
        */

        map.set(key, {
          ...item,
          source: "json-only"
        });
      }
    });


    /*
      JSON SETS
    */

    const jsonSets = Array.isArray(jsonData?.sets)
      ? jsonData.sets
      : [];

    jsonSets.forEach((raw) => {

      const item = normalizeJsonItem({
        ...raw,
        tipe: "set"
      });

      if (!item) {
        return;
      }

      const key = keyFromObject(item);

      if (map.has(key)) {

        const current = map.get(key);

        current.stock = item.stock;
        current.stok = item.stock;

        if (item.price > 0) {
          current.price = item.price;
          current.harga = item.price;
        }

        if (item.id) {
          current.id = item.id;
        }

        current.source = "master+json";

      } else {

        map.set(key, {
          ...item,
          source: "json-only"
        });

      }
    });


    return Array.from(map.values());
  }


  /* =========================================================
     LOAD DATA
     ========================================================= */

  async function loadData() {

    setSyncStatus("Memuat...");

    try {

      const response = await fetch(
        CONFIG.DATA_URL + "?t=" + Date.now(),
        {
          cache: "no-store"
        }
      );

      if (!response.ok) {
        throw new Error(
          "HTTP " + response.status
        );
      }

      const data = await response.json();

      catalog = mergeCatalog(data);

      lastUpdated =
        data.last_updated ||
        data.updated_at ||
        null;

      saveCatalogCache(data);

      setSyncStatus("Online");

      renderMeta();

      renderCatalog();

      return;

    } catch (error) {

      console.warn(
        "Gagal mengambil accessories.json:",
        error
      );

      /*
        Kalau internet / fetch gagal,
        coba cache terakhir.
      */

      const cached = loadCatalogCache();

      if (cached) {

        catalog = mergeCatalog(cached);

        lastUpdated =
          cached.last_updated ||
          cached.updated_at ||
          null;

        setSyncStatus("Cache");

        renderMeta();

        renderCatalog();

        return;
      }


      /*
        Tidak ada JSON sama sekali.

        Master tetap ditampilkan,
        tetapi SEMUA stok = 0.
      */

      catalog = buildMasterCatalog();

      lastUpdated = null;

      setSyncStatus("Offline");

      renderMeta();

      renderCatalog();
    }
  }


  /* =========================================================
     CACHE
     ========================================================= */

  function saveCatalogCache(data) {

    try {

      localStorage.setItem(
        CONFIG.STORAGE_KEY,
        JSON.stringify(data)
      );

    } catch (error) {

      console.warn(
        "Tidak bisa menyimpan cache:",
        error
      );

    }
  }


  function loadCatalogCache() {

    try {

      const raw =
        localStorage.getItem(
          CONFIG.STORAGE_KEY
        );

      if (!raw) {
        return null;
      }

      return JSON.parse(raw);

    } catch (error) {

      return null;
    }
  }


  /* =========================================================
     CART
     ========================================================= */

  function loadCart() {

    try {

      const raw =
        localStorage.getItem(
          CONFIG.CART_KEY
        );

      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed;

    } catch (error) {

      return [];
    }
  }


  function saveCart() {

    try {

      localStorage.setItem(
        CONFIG.CART_KEY,
        JSON.stringify(cart)
      );

    } catch (error) {

      console.warn(
        "Cart tidak bisa disimpan:",
        error
      );

    }

    renderCart();
  }


  function getCartQuantity(id) {

    const item = cart.find(
      (x) => x.id === id
    );

    return item ? item.quantity : 0;
  }


  function addToCart(item) {

    if (!item || item.stock <= 0) {
      return;
    }

    const existing = cart.find(
      (x) => x.id === item.id
    );

    if (existing) {

      existing.quantity = Math.min(
        existing.quantity + 1,
        item.stock
      );

    } else {

      cart.push({
        id: item.id,

        name: item.name,

        level: item.level,

        variant: item.variant,

        type: item.type,

        price: item.price,

        quantity: 1
      });

    }

    saveCart();

    showToast(
      item.name +
      " (" +
      item.type +
      ") ditambahkan ke cart."
    );
  }


  function removeFromCart(id) {

    cart = cart.filter(
      (item) => item.id !== id
    );

    saveCart();
  }


  function changeCartQuantity(id, delta) {

    const cartItem =
      cart.find(
        (x) => x.id === id
      );

    if (!cartItem) {
      return;
    }

    const catalogItem =
      catalog.find(
        (x) => x.id === id
      );

    if (!catalogItem) {
      removeFromCart(id);
      return;
    }

    const next =
      cartItem.quantity + delta;

    if (next <= 0) {

      removeFromCart(id);

      return;
    }

    cartItem.quantity =
      Math.min(
        next,
        catalogItem.stock
      );

    saveCart();
  }


  function clearCart() {

    cart = [];

    saveCart();
  }


  function cartTotal() {

    return cart.reduce(
      (total, item) => {

        return total +
          safeNumber(item.price) *
          safeNumber(item.quantity);

      },
      0
    );
  }


  function cartCount() {

    return cart.reduce(
      (total, item) =>
        total + safeNumber(item.quantity),
      0
    );
  }


  /* =========================================================
     FILTER
     ========================================================= */

  function populateFilters() {

    const levelSelect =
      $("level-filter");

    const typeSelect =
      $("type-filter");

    const variantSelect =
      $("variant-filter");

    if (!levelSelect ||
        !typeSelect ||
        !variantSelect) {
      return;
    }


    const levels =
      [...new Set(
        catalog.map(
          (item) => item.level
        )
      )]
      .sort((a, b) => b - a);


    const types =
      [...new Set(
        catalog.map(
          (item) => item.type
        )
      )]
      .sort();


    const variants =
      [...new Set(
        catalog.map(
          (item) => item.variant
        )
      )]
      .sort((a, b) => {

        if (a === "R") return -1;
        if (b === "R") return 1;

        return a.localeCompare(b);
      });


    levelSelect.innerHTML =
      '<option value="all">Semua Level</option>' +
      levels.map(
        (level) =>
          `<option value="${escapeHtml(level)}">${escapeHtml(level)}</option>`
      ).join("");


    typeSelect.innerHTML =
      '<option value="all">Semua Tipe</option>' +
      types.map(
        (type) =>
          `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`
      ).join("");


    variantSelect.innerHTML =
      '<option value="all">Semua Varian</option>' +
      variants.map(
        (variant) =>
          `<option value="${escapeHtml(variant)}">${escapeHtml(variant)}</option>`
      ).join("");


    levelSelect.value =
      filters.level;

    typeSelect.value =
      filters.type;

    variantSelect.value =
      filters.variant;
  }


  function filteredCatalog() {

    const q =
      filters.q
        .trim()
        .toLowerCase();


    return catalog
      .filter((item) => {

        if (
          q &&
          ![
            item.name,
            item.type,
            item.variant,
            item.level
          ]
            .join(" ")
            .toLowerCase()
            .includes(q)
        ) {
          return false;
        }


        if (
          filters.level !== "all" &&
          String(item.level) !==
          String(filters.level)
        ) {
          return false;
        }


        if (
          filters.type !== "all" &&
          item.type !== filters.type
        ) {
          return false;
        }


        if (
          filters.variant !== "all" &&
          item.variant !== filters.variant
        ) {
          return false;
        }


        return true;
      })
      .sort((a, b) => {

        /*
          Item yang tersedia ditaruh lebih atas.
        */

        if (
          a.stock > 0 &&
          b.stock <= 0
        ) {
          return -1;
        }

        if (
          a.stock <= 0 &&
          b.stock > 0
        ) {
          return 1;
        }


        if (a.level !== b.level) {
          return b.level - a.level;
        }


        const nameCompare =
          a.name.localeCompare(
            b.name
          );

        if (nameCompare !== 0) {
          return nameCompare;
        }


        if (
          a.variant === "R" &&
          b.variant !== "R"
        ) {
          return -1;
        }

        if (
          a.variant !== "R" &&
          b.variant === "R"
        ) {
          return 1;
        }


        return a.type.localeCompare(
          b.type
        );
      });
  }


  /* =========================================================
     RENDER CATALOG
     ========================================================= */

  function renderCatalog() {

    const container =
      $("catalog");

    const empty =
      $("empty");

    const resultInfo =
      $("result-info");


    if (!container) {
      return;
    }


    populateFilters();


    const items =
      filteredCatalog();


    container.innerHTML = "";


    if (resultInfo) {

      const available =
        items.filter(
          (item) => item.stock > 0
        ).length;

      resultInfo.textContent =
        `${items.length} item · ${available} tersedia`;
    }


    if (!items.length) {

      if (empty) {
        empty.hidden = false;
      }

      return;
    }


    if (empty) {
      empty.hidden = true;
    }


    items.forEach((item) => {

      container.appendChild(
        createCatalogCard(item)
      );

    });


    renderCart();
  }


  function createCatalogCard(item) {

    const card =
      document.createElement("article");

    const soldOut =
      item.stock <= 0;

    const lowStock =
      item.stock > 0 &&
      item.stock <= CONFIG.LOW_STOCK;


    card.className =
      "catalog-card" +
      (soldOut ? " sold-out" : "");


    const typeIcon =
      getTypeIcon(item.type);


    const stockLabel =
      soldOut
        ? "SOLD OUT"
        : lowStock
          ? `Sisa ${item.stock}`
          : `${item.stock} tersedia`;


    card.innerHTML = `
      <div class="card-top">

        <div class="item-icon">
          ${typeIcon}
        </div>

        <div class="item-main">

          <div class="item-title-row">

            <h2 class="item-name">
              ${escapeHtml(item.name)}
            </h2>

            <span class="item-variant ${
              item.variant === "R"
                ? "r"
                : ""
            }">
              ${escapeHtml(item.variant)}
            </span>

          </div>

          <div class="item-meta">
            <span>Lv ${escapeHtml(item.level)}</span>
            <span>${escapeHtml(item.type)}</span>
          </div>

        </div>

      </div>


      <div class="card-bottom">

        <div class="price">
          ${formatRupiah(item.price)}
        </div>

        <div class="stock ${
          soldOut
            ? "sold"
            : lowStock
              ? "low"
              : ""
        }">
          ${stockLabel}
        </div>

      </div>
    `;


    if (!soldOut) {

      card.classList.add("clickable");

      card.addEventListener(
        "click",
        () => addToCart(item)
      );

    }


    return card;
  }


  function getTypeIcon(type) {

    switch (type) {

      case "Necklace":
        return "NEC";

      case "Ring":
        return "RNG";

      case "Earring":
        return "EAR";

      case "Set":
        return "SET";

      default:
        return "ITEM";
    }
  }


  /* =========================================================
     CART UI
     ========================================================= */

  function renderCart() {

    const count =
      $("cart-count");

    const itemsContainer =
      $("cart-items");

    const total =
      $("cart-total");


    if (count) {
      count.textContent =
        cartCount();
    }


    if (total) {

      total.textContent =
        formatRupiah(
          cartTotal()
        );
    }


    if (!itemsContainer) {
      return;
    }


    if (!cart.length) {

      itemsContainer.innerHTML = `
        <div class="cart-empty">
          <div>🛒</div>
          <p>Keranjang masih kosong.</p>
        </div>
      `;

      return;
    }


    itemsContainer.innerHTML =
      cart.map((item) => {

        const catalogItem =
          catalog.find(
            (x) => x.id === item.id
          );


        const maxStock =
          catalogItem
            ? catalogItem.stock
            : 0;


        const qty =
          Math.min(
            item.quantity,
            maxStock
          );


        return `
          <div class="cart-item">

            <div class="cart-item-info">

              <strong>
                ${escapeHtml(item.name)}
              </strong>

              <small>
                Lv ${escapeHtml(item.level)}
                · ${escapeHtml(item.variant)}
                · ${escapeHtml(item.type)}
              </small>

              <b>
                ${formatRupiah(item.price)}
              </b>

            </div>


            <div class="cart-controls">

              <button
                type="button"
                class="cart-qty"
                data-cart-minus="${escapeHtml(item.id)}"
              >
                −
              </button>

              <span>
                ${qty}
              </span>

              <button
                type="button"
                class="cart-qty"
                data-cart-plus="${escapeHtml(item.id)}"
                ${
                  qty >= maxStock
                    ? "disabled"
                    : ""
                }
              >
                +
              </button>

            </div>


            <button
              type="button"
              class="cart-remove"
              data-cart-remove="${escapeHtml(item.id)}"
            >
              ×
            </button>

          </div>
        `;

      }).join("");


    /*
      Event delegation
    */

    itemsContainer
      .querySelectorAll(
        "[data-cart-minus]"
      )
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            changeCartQuantity(
              button.dataset.cartMinus,
              -1
            );

          }
        );

      });


    itemsContainer
      .querySelectorAll(
        "[data-cart-plus]"
      )
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            changeCartQuantity(
              button.dataset.cartPlus,
              1
            );

          }
        );

      });


    itemsContainer
      .querySelectorAll(
        "[data-cart-remove]"
      )
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            removeFromCart(
              button.dataset.cartRemove
            );

          }
        );

      });
  }


  /* =========================================================
     WHATSAPP CHECKOUT
     ========================================================= */

  function checkoutWhatsApp() {

    if (!cart.length) {

      showToast(
        "Keranjang masih kosong."
      );

      return;
    }


    const validItems = [];


    cart.forEach((cartItem) => {

      const catalogItem =
        catalog.find(
          (item) =>
            item.id === cartItem.id
        );


      if (
        !catalogItem ||
        catalogItem.stock <= 0
      ) {
        return;
      }


      const quantity =
        Math.min(
          cartItem.quantity,
          catalogItem.stock
        );


      if (quantity <= 0) {
        return;
      }


      validItems.push({
        ...cartItem,
        quantity,
        price: catalogItem.price
      });

    });


    if (!validItems.length) {

      showToast(
        "Item di keranjang sudah habis."
      );

      cart = [];

      saveCart();

      return;
    }


    const total =
      validItems.reduce(
        (sum, item) =>
          sum +
          item.price *
          item.quantity,
        0
      );


    const lines = [
      "Halo AURCUS MARKET, saya mau order:",
      ""
    ];


    validItems.forEach(
      (item, index) => {

        lines.push(
          `${index + 1}. ${item.name}`
        );

        lines.push(
          `   Lv ${item.level} · ${item.variant} · ${item.type}`
        );

        lines.push(
          `   Qty: ${item.quantity}`
        );

        lines.push(
          `   Harga: ${formatRupiah(item.price)}`
        );

        lines.push("");

      }
    );


    lines.push(
      `Total: ${formatRupiah(total)}`
    );

    lines.push("");

    lines.push(
      "Mohon cek ketersediaan dan proses ordernya."
    );


    const message =
      encodeURIComponent(
        lines.join("\n")
      );


    const url =
      `https://wa.me/${CONFIG.WA_NUMBER}?text=${message}`;


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }


  /* =========================================================
     UI EVENTS
     ========================================================= */

  function setupEvents() {

    const search =
      $("q");

    const level =
      $("level-filter");

    const type =
      $("type-filter");

    const variant =
      $("variant-filter");

    const reset =
      $("reset-btn");


    if (search) {

      search.addEventListener(
        "input",
        (event) => {

          filters.q =
            event.target.value;

          renderCatalog();

        }
      );

    }


    if (level) {

      level.addEventListener(
        "change",
        (event) => {

          filters.level =
            event.target.value;

          renderCatalog();

        }
      );

    }


    if (type) {

      type.addEventListener(
        "change",
        (event) => {

          filters.type =
            event.target.value;

          renderCatalog();

        }
      );

    }


    if (variant) {

      variant.addEventListener(
        "change",
        (event) => {

          filters.variant =
            event.target.value;

          renderCatalog();

        }
      );

    }


    if (reset) {

      reset.addEventListener(
        "click",
        () => {

          filters = {
            q: "",
            level: "all",
            type: "all",
            variant: "all"
          };


          if (search) {
            search.value = "";
          }


          renderCatalog();

        }
      );

    }


    const cartButton =
      $("cart-btn");

    const closeCart =
      $("close-cart");

    const backdrop =
      $("cart-backdrop");

    const clearCartButton =
      $("clear-cart");

    const checkout =
      $("checkout-btn");


    if (cartButton) {

      cartButton.addEventListener(
        "click",
        openCart
      );

    }


    if (closeCart) {

      closeCart.addEventListener(
        "click",
        closeCartSheet
      );

    }


    if (backdrop) {

      backdrop.addEventListener(
        "click",
        closeCartSheet
      );

    }


    if (clearCartButton) {

      clearCartButton.addEventListener(
        "click",
        () => {

          clearCart();

          showToast(
            "Keranjang dikosongkan."
          );

        }
      );

    }


    if (checkout) {

      checkout.addEventListener(
        "click",
        checkoutWhatsApp
      );

    }


    /*
      Manual JSON loader
      */

    const loadButton =
      $("load-btn");

    const loadInput =
      $("load-input");


    if (loadButton && loadInput) {

      loadButton.addEventListener(
        "click",
        () => {
          loadInput.click();
        }
      );


      loadInput.addEventListener(
        "change",
        async (event) => {

          const file =
            event.target.files?.[0];

          if (!file) {
            return;
          }


          try {

            const text =
              await file.text();

            const data =
              JSON.parse(text);


            catalog =
              mergeCatalog(data);


            lastUpdated =
              data.last_updated ||
              data.updated_at ||
              null;


            saveCatalogCache(
              data
            );


            setSyncStatus(
              "Local"
            );


            renderMeta();

            renderCatalog();

            showToast(
              "accessories.json berhasil dimuat."
            );

          } catch (error) {

            console.error(error);

            showToast(
              "JSON tidak valid."
            );

          }


          loadInput.value = "";

        }
      );

    }
  }


  /* =========================================================
     CART DRAWER
     ========================================================= */

  function openCart() {

    const sheet =
      $("cart-sheet");

    if (!sheet) {
      return;
    }


    sheet.classList.add("open");

    sheet.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.classList.add(
      "cart-open"
    );


    renderCart();
  }


  function closeCartSheet() {

    const sheet =
      $("cart-sheet");

    if (!sheet) {
      return;
    }


    sheet.classList.remove(
      "open"
    );

    sheet.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.classList.remove(
      "cart-open"
    );
  }


  /* =========================================================
     STATUS
     ========================================================= */

  function setSyncStatus(text) {

    const element =
      $("sync-status");

    if (element) {
      element.textContent = text;
    }
  }


  function renderMeta() {

    const meta =
      $("meta");

    if (!meta) {
      return;
    }


    if (!lastUpdated) {

      meta.textContent = "—";

      return;
    }


    const date =
      new Date(lastUpdated);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      meta.textContent =
        String(lastUpdated);

      return;
    }


    meta.textContent =
      date.toLocaleString(
        "id-ID",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }
      );
  }


  /* =========================================================
     TOAST
     ========================================================= */

  let toastTimer = null;


  function showToast(message) {

    const toast =
      $("toast");

    if (!toast) {
      return;
    }


    toast.textContent =
      message;


    toast.classList.add(
      "show"
    );


    clearTimeout(
      toastTimer
    );


    toastTimer =
      setTimeout(
        () => {

          toast.classList.remove(
            "show"
          );

        },
        2200
      );
  }


  /* =========================================================
     HTML ESCAPE
     ========================================================= */

  function escapeHtml(value) {

    return String(value ?? "")
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }


  /* =========================================================
     INIT
     ========================================================= */

  function init() {

    /*
      Penting:
      langsung tampilkan master dulu.
      Jadi buyer tidak menunggu JSON untuk
      mengetahui daftar barang.
    */

    catalog =
      buildMasterCatalog();


    renderCatalog();

    renderCart();

    setupEvents();

    loadData();
  }


  init();

})();