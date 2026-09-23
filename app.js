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

    CURRENCY_KEY: "aurcus-currency-pref",

    LANG_KEY: "aurcus-lang-pref",

    LOW_STOCK: 2,

    /*
      Kurs IDR -> USD (perkiraan, per akhir September 2026).
      Update angka ini kalau kurs berubah signifikan.
    */
    USD_RATE: 16300,

    /*
      Setiap harga yang dikonversi ke USD ditambah markup flat $1.
    */
    USD_MARKUP: 1
  };


  /* =========================================================
     TRANSLATIONS (ID / EN)
     ========================================================= */

  const TRANSLATIONS = {
    id: {
      tagline: "Official accessory marketplace",
      filter_level_aria: "Filter level",
      filter_type_aria: "Filter tipe",
      filter_variant_aria: "Filter varian",
      filter_all_level: "Semua Level",
      filter_all_type: "Semua Tipe",
      filter_all_variant: "Semua Varian",
      reset_filter: "Reset Filter",
      loading_catalog: "Memuat katalog...",
      empty_title: "Tidak ada item",
      empty_desc: "Coba ubah pencarian atau filter.",
      empty_filtered: "Tidak ada item yang cocok dengan filter.",
      cart_title: "Keranjang",
      close_aria: "Tutup",
      open_cart_aria: "Buka keranjang",
      estimated_total: "Estimasi Total",
      checkout_btn: "Checkout via WhatsApp",
      clear_cart: "Kosongkan Keranjang",
      currency_toggle_aria: "Ganti tampilan mata uang",
      currency_switch_to_idr: "Tampilkan harga dalam Rupiah",
      currency_switch_to_usd: "Tampilkan harga dalam Dollar",
      lang_toggle_aria: "Ganti bahasa",
      lang_switch_to_id: "Ganti ke Bahasa Indonesia",
      lang_switch_to_en: "Switch to English",
      lang_button_en: "EN",
      lang_button_id: "ID",
      result_info: "{{count}} item · {{available}} tersedia",
      parts_available: "{{available}}/{{total}} tersedia",
      set_contents_label: "ISI PACKAGE",
      set_contents_fallback: "Paket set",
      sold_out: "SOLD OUT",
      low_stock: "Sisa {{count}}",
      in_stock: "{{count}} tersedia",
      tap_hint: "Tekan untuk masukan keranjang",
      added_to_cart: "{{name}} ({{type}}) ditambahkan ke cart.",
      cart_empty_msg: "Keranjang masih kosong.",
      cart_items_out_of_stock: "Item di keranjang sudah habis.",
      cart_cleared: "Keranjang dikosongkan.",
      json_loaded: "accessories.json berhasil dimuat.",
      json_invalid: "JSON tidak valid.",
      wa_greeting: "Halo Oren, saya mau order:",
      wa_price_label: "Harga:",
      wa_closing: ". Mohon cek ketersediaan dan proses ordernya.",
      status_loading: "Memuat...",
      status_online: "Online",
      status_cache: "Cache",
      status_offline: "Offline",
      status_local: "Local"
    },

    en: {
      tagline: "Official accessory marketplace",
      filter_level_aria: "Level filter",
      filter_type_aria: "Type filter",
      filter_variant_aria: "Variant filter",
      filter_all_level: "All Levels",
      filter_all_type: "All Types",
      filter_all_variant: "All Variants",
      reset_filter: "Reset Filters",
      loading_catalog: "Loading catalog...",
      empty_title: "No items found",
      empty_desc: "Try changing your search or filters.",
      empty_filtered: "No items match the current filters.",
      cart_title: "Cart",
      close_aria: "Close",
      open_cart_aria: "Open cart",
      estimated_total: "Estimated Total",
      checkout_btn: "Checkout via WhatsApp",
      clear_cart: "Clear Cart",
      currency_toggle_aria: "Switch currency display",
      currency_switch_to_idr: "Show prices in Rupiah",
      currency_switch_to_usd: "Show prices in Dollars",
      lang_toggle_aria: "Switch language",
      lang_switch_to_id: "Ganti ke Bahasa Indonesia",
      lang_switch_to_en: "Switch to English",
      lang_button_en: "EN",
      lang_button_id: "ID",
      result_info: "{{count}} items · {{available}} available",
      parts_available: "{{available}}/{{total}} available",
      set_contents_label: "SET CONTENTS",
      set_contents_fallback: "Package set",
      sold_out: "SOLD OUT",
      low_stock: "{{count}} left",
      in_stock: "{{count}} available",
      tap_hint: "Press and hold to add to cart",
      added_to_cart: "{{name}} ({{type}}) added to cart.",
      cart_empty_msg: "Your cart is empty.",
      cart_items_out_of_stock: "Items in your cart are out of stock.",
      cart_cleared: "Cart cleared.",
      json_loaded: "accessories.json loaded successfully.",
      json_invalid: "Invalid JSON.",
      wa_greeting: "Hi Oren, I'd like to order:",
      wa_price_label: "Price:",
      wa_closing: ". Please check availability and process the order.",
      status_loading: "Loading...",
      status_online: "Online",
      status_cache: "Cache",
      status_offline: "Offline",
      status_local: "Local"
    }
  };


  function t(key, vars) {

    const dict =
      TRANSLATIONS[lang] ||
      TRANSLATIONS.id;

    let text =
      dict[key] ??
      TRANSLATIONS.id[key] ??
      key;

    if (vars) {

      Object.keys(vars).forEach((k) => {

        text = text.replace(
          new RegExp("{{" + k + "}}", "g"),
          vars[k]
        );

      });

    }

    return text;
  }


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

  let currency = loadCurrency();

  let lang = loadLanguage();


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


  function formatDollar(value) {
    const usd =
      (safeNumber(value) / CONFIG.USD_RATE) +
      CONFIG.USD_MARKUP;

    return "$" + usd.toFixed(2);
  }


  /*
    formatPrice() adalah titik tunggal yang dipakai di semua
    tampilan (kartu produk, cart, total). Formatnya mengikuti
    preferensi currency yang aktif saat ini.
  */
  function formatPrice(value) {
    return currency === "USD"
      ? formatDollar(value)
      : formatRupiah(value);
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

          source: "master",
          master_set: false
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

        source: "master",
        isi: ["necklace", "ring", "earring"],
        master_set: true
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

      source: "json",

      /*
        Untuk Set, `isi` adalah daftar package yang memang
        ditentukan oleh accessories.json. Jangan pernah
        menginfer isi Set dari item individual yang kebetulan
        punya nama / level / varian yang sama.
      */
      ...(type === "Set" && Array.isArray(raw.isi)
        ? {
            isi: raw.isi.map((x) => normalizeText(x)).filter(Boolean),
            master_set: true
          }
        : {
            master_set: false
          })
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

        if (Array.isArray(item.isi)) {
          current.isi = [...item.isi];
        }

        current.master_set = true;
        current.source = "master+json";

      } else {

        map.set(key, {
          ...item,
          master_set: true,
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

    setSyncStatus(t("status_loading"));

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

      setSyncStatus(t("status_online"));

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

        setSyncStatus(t("status_cache"));

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

      setSyncStatus(t("status_offline"));

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
     CURRENCY PREFERENCE
     ========================================================= */

  function loadCurrency() {

    try {

      const raw = localStorage.getItem(
        CONFIG.CURRENCY_KEY
      );

      return raw === "USD" ? "USD" : "IDR";

    } catch (error) {

      return "IDR";
    }
  }


  function loadLanguage() {

    try {

      const raw = localStorage.getItem(
        CONFIG.LANG_KEY
      );

      return raw === "en" ? "en" : "id";

    } catch (error) {

      return "id";
    }
  }


  function saveLanguagePref() {

    try {

      localStorage.setItem(
        CONFIG.LANG_KEY,
        lang
      );

    } catch (error) {

      console.warn(
        "Language pref tidak bisa disimpan:",
        error
      );

    }
  }


  function toggleLanguage() {

    lang = lang === "id" ? "en" : "id";

    saveLanguagePref();
    renderLanguageUI();
    renderCatalog();
    renderCart();
  }


  function renderLanguageToggle() {

    const button = $("lang-toggle");

    if (!button) {
      return;
    }

    button.textContent =
      lang === "id"
        ? t("lang_button_en")
        : t("lang_button_id");

    button.setAttribute("aria-label", t("lang_toggle_aria"));
    button.setAttribute("aria-pressed", lang === "en" ? "true" : "false");
    button.title =
      lang === "id"
        ? t("lang_switch_to_en")
        : t("lang_switch_to_id");
  }


  function renderLanguageUI() {

    document.documentElement.lang = lang === "en" ? "en" : "id";

    const search = $("q");
    const reset = $("reset-btn");
    const cartButton = $("cart-btn");
    const cartTitle = document.querySelector(".cart-panel h2");
    const closeCart = $("close-cart");
    const totalLabel = document.querySelector(".total span");
    const checkout = $("checkout-btn");
    const clearCartButton = $("clear-cart");
    const emptyTitle = document.querySelector("#empty h2");
    const emptyDesc = document.querySelector("#empty p");
    const level = $("level-filter");
    const type = $("type-filter");
    const variant = $("variant-filter");

    if (search) {
      search.placeholder = lang === "id"
        ? "Cari accessories..."
        : "Search accessories...";
    }

    if (level) level.setAttribute("aria-label", t("filter_level_aria"));
    if (type) type.setAttribute("aria-label", t("filter_type_aria"));
    if (variant) variant.setAttribute("aria-label", t("filter_variant_aria"));
    if (reset) reset.textContent = t("reset_filter");
    if (cartButton) cartButton.setAttribute("aria-label", t("open_cart_aria"));
    if (cartTitle) cartTitle.textContent = t("cart_title");
    if (closeCart) closeCart.setAttribute("aria-label", t("close_aria"));
    if (totalLabel) totalLabel.textContent = t("estimated_total");
    if (checkout) checkout.textContent = t("checkout_btn");
    if (clearCartButton) clearCartButton.textContent = t("clear_cart");
    if (emptyTitle) emptyTitle.textContent = t("empty_title");
    if (emptyDesc) emptyDesc.textContent = t("empty_desc");

    const syncStatus = $("sync-status");
    if (syncStatus) {
      const status = syncStatus.textContent;
      if (status === "Memuat..." || status === "Loading...") {
        syncStatus.textContent = t("status_loading");
      } else if (status === "Online") {
        syncStatus.textContent = t("status_online");
      } else if (status === "Cache") {
        syncStatus.textContent = t("status_cache");
      } else if (status === "Offline") {
        syncStatus.textContent = t("status_offline");
      } else if (status === "Local") {
        syncStatus.textContent = t("status_local");
      }
    }

    renderCurrencyToggle();
    renderLanguageToggle();
  }


  function initLanguageToggle() {

    const button = $("lang-toggle");

    if (!button) {
      return;
    }

    button.addEventListener("click", toggleLanguage);
    renderLanguageToggle();
  }


  function saveCurrencyPref() {

    try {

      localStorage.setItem(
        CONFIG.CURRENCY_KEY,
        currency
      );

    } catch (error) {

      console.warn(
        "Currency pref tidak bisa disimpan:",
        error
      );

    }
  }


  function toggleCurrency() {

    currency = currency === "IDR" ? "USD" : "IDR";

    saveCurrencyPref();

    renderCurrencyToggle();

    renderCatalog();

    renderCart();
  }


  function renderCurrencyToggle() {

    const button = $("currency-toggle");

    if (!button) {
      return;
    }

    const label = $("currency-toggle-label");

    if (label) {
      label.textContent =
        currency === "USD" ? "$" : "Rp";
    } else {
      button.textContent =
        currency === "USD" ? "$" : "Rp";
    }

    button.setAttribute(
      "aria-pressed",
      currency === "USD" ? "true" : "false"
    );

    button.setAttribute(
      "aria-label",
      t("currency_toggle_aria")
    );

    button.title =
      currency === "USD"
        ? t("currency_switch_to_idr")
        : t("currency_switch_to_usd");
  }


  /*
    Tombolnya sudah ada di index.html (#currency-toggle),
    di sini cuma disambungkan ke event & state-nya.
  */
  function initCurrencyToggle() {

    const button = $("currency-toggle");

    if (!button) {
      return;
    }

    button.addEventListener(
      "click",
      toggleCurrency
    );

    renderCurrencyToggle();
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
      t("added_to_cart", { name: item.name, type: item.type })
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
      '<option value="all">' + escapeHtml(t("filter_all_level")) + '</option>' +
      levels.map(
        (level) =>
          `<option value="${escapeHtml(level)}">${escapeHtml(level)}</option>`
      ).join("");


    typeSelect.innerHTML =
      '<option value="all">' + escapeHtml(t("filter_all_type")) + '</option>' +
      types.map(
        (type) =>
          `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`
      ).join("");


    variantSelect.innerHTML =
      '<option value="all">' + escapeHtml(t("filter_all_variant")) + '</option>' +
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

  function groupCatalogItems(items) {
    const groups = new Map();
    const typeOrder = {
      Necklace: 0,
      Earring: 1,
      Ring: 2
    };

    items.forEach((item) => {
      /*
        HANYA item individual yang boleh masuk group.
        Set/master_set selalu berdiri sebagai package sendiri.
      */
      if (item.type === "Set" || item.master_set === true) {
        const key = "set|" + item.id;
        groups.set(key, {
          kind: "set",
          key,
          item
        });
        return;
      }

      const key = itemKey(
        item.level,
        item.variant,
        item.name,
        "parts"
      );

      if (!groups.has(key)) {
        groups.set(key, {
          kind: "parts",
          key,
          name: item.name,
          level: item.level,
          variant: item.variant,
          items: []
        });
      }

      groups.get(key).items.push(item);
    });

    return Array.from(groups.values()).sort((a, b) => {
      const ai = a.kind === "set" ? a.item : a;
      const bi = b.kind === "set" ? b.item : b;

      if (ai.stock > 0 && bi.stock <= 0) return -1;
      if (ai.stock <= 0 && bi.stock > 0) return 1;
      if (ai.level !== bi.level) return bi.level - ai.level;

      const nameCompare = ai.name.localeCompare(bi.name);
      if (nameCompare !== 0) return nameCompare;

      if (ai.variant === "R" && bi.variant !== "R") return -1;
      if (ai.variant !== "R" && bi.variant === "R") return 1;

      if (a.kind !== b.kind) return a.kind === "parts" ? -1 : 1;
      return 0;
    });
  }


  function renderCatalog() {
    const container = $("catalog");
    const empty = $("empty");
    const resultInfo = $("result-info");

    if (!container) return;

    populateFilters();

    const items = filteredCatalog();
    container.innerHTML = "";

    if (resultInfo) {
      const available = items.filter((item) => item.stock > 0).length;
      resultInfo.textContent =
        t("result_info", { count: items.length, available });
    }

    if (!items.length) {
      if (empty) empty.hidden = false;
      renderCart();
      return;
    }

    if (empty) empty.hidden = true;

    /*
      Catalog dibagi menjadi 4 blok vertical tetap:
      1. Master Base Lv 115
      2. Master Base Lv 110
      3. Master Set Lv 115
      4. Master Set Lv 110

      Item individual tetap dikelompokkan berdasarkan
      nama + level + varian. Master Set tidak pernah
      digabung dengan item individual.
    */
    const sections = [
      {
        key: "base-115",
        title: "GOD LORD ACCESSORY LV 115",
        subtitle: "Parts",
        kind: "base",
        level: 115
      },
      {
        key: "base-110",
        title: "GOD LORD ACCESSORY LV 110",
        subtitle: "Parts",
        kind: "base",
        level: 110
      },
      {
        key: "set-115",
        title: "GOD LORD ACCESSORY LV 115",
        subtitle: "Sets",
        kind: "set",
        level: 115
      },
      {
        key: "set-110",
        title: "GOD LORD ACCESSORY LV 110",
        subtitle: "Sets",
        kind: "set",
        level: 110
      }
    ];

    sections.forEach((sectionConfig) => {
      const sectionItems = items.filter((item) => {
        const isSet = item.type === "Set" || item.master_set === true;
        const sameKind = sectionConfig.kind === "set" ? isSet : !isSet;
        return sameKind && Number(item.level) === sectionConfig.level;
      });

      container.appendChild(
        createCatalogLevelSection(sectionConfig, sectionItems)
      );
    });

    renderCart();
  }


  function createCatalogLevelSection(config, items) {
    const section = document.createElement("section");
    section.className = `catalog-level-section catalog-level-${config.kind}`;

    const available = items.filter((item) => item.stock > 0).length;

    section.innerHTML = `
      <div class="catalog-level-head">
        <div class="catalog-level-heading">
          <strong>${escapeHtml(config.title)}</strong>
          <span>${escapeHtml(config.subtitle)}</span>
        </div>
        <div class="catalog-level-count">
          ${t("result_info", { count: items.length, available })}
        </div>
      </div>
      <div class="catalog-level-body"></div>
    `;

    const body = section.querySelector(".catalog-level-body");

    if (!items.length) {
      body.innerHTML = `
        <div class="catalog-section-empty">
          Tidak ada item yang cocok dengan filter.
        </div>
      `;
      return section;
    }

    if (config.kind === "set") {
      const sets = [...items].sort((a, b) => {
        const nameCompare = a.name.localeCompare(b.name);
        if (nameCompare !== 0) return nameCompare;
        if (a.variant === "R" && b.variant !== "R") return -1;
        if (a.variant !== "R" && b.variant === "R") return 1;
        return 0;
      });

      sets.forEach((item) => {
        body.appendChild(createSetGroup(item));
      });

      return section;
    }

    const groups = groupCatalogItems(items).filter(
      (group) => group.kind === "parts"
    );

    groups.forEach((group) => {
      body.appendChild(createPartsGroup(group));
    });

    return section;
  }


  function createPartsGroup(group) {
    const section = document.createElement("section");
    section.className = "catalog-group";

    const items = [...group.items].sort((a, b) => {
      const order = { Necklace: 0, Earring: 1, Ring: 2 };
      return (order[a.type] ?? 99) - (order[b.type] ?? 99);
    });

    const available = items.filter((item) => item.stock > 0).length;

    section.innerHTML = `
      <div class="catalog-group-head">
        <div class="catalog-group-title">
          <strong>${escapeHtml(group.name)} ${escapeHtml(group.variant)}</strong>
        </div>
        <span class="catalog-group-level">
          ${t("parts_available", { available, total: items.length })}
        </span>
      </div>
      <div class="catalog-group-parts"></div>
    `;

    const parts = section.querySelector(".catalog-group-parts");

    items.forEach((item) => {
      parts.appendChild(createCatalogCard(item));
    });

    return section;
  }

function attachHoldToAdd(card, item) {

  const HOLD_MS = 450;   // lama tahan (ms)
  const MOVE_LIMIT = 10; // geser lebih dari ini = dianggap scroll

  let timer = null;
  let startX = 0;
  let startY = 0;

  function cancel() {
    clearTimeout(timer);
    timer = null;
    card.classList.remove("holding");
  }

  card.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
    card.classList.add("holding");

    timer = setTimeout(() => {
      timer = null;
      card.classList.remove("holding");
      addToCart(item);
      if (navigator.vibrate) navigator.vibrate(30);
    }, HOLD_MS);
  });

  card.addEventListener("pointermove", (e) => {
    if (!timer) return;
    if (
      Math.abs(e.clientX - startX) > MOVE_LIMIT ||
      Math.abs(e.clientY - startY) > MOVE_LIMIT
    ) {
      cancel();
    }
  });

  card.addEventListener("pointerup", cancel);
  card.addEventListener("pointerleave", cancel);
  card.addEventListener("pointercancel", cancel);
  card.addEventListener("contextmenu", (e) => e.preventDefault());
}

  function createSetGroup(item) {
    const section = document.createElement("section");
    section.className = "catalog-group catalog-set-group";

    const contents = Array.isArray(item.isi) && item.isi.length
      ? item.isi.join(" · ")
      : t("set_contents_fallback");

    section.innerHTML = `
      <div class="catalog-group-head">
        <div class="catalog-group-title">
          <strong>${escapeHtml(item.name)} ${escapeHtml(item.variant)}</strong>
        </div>
        <span class="catalog-group-level">FULL SET</span>
      </div>
      <div class="catalog-set-content">
        <div class="catalog-set-info">
          <div class="catalog-set-label">${t("set_contents_label")}</div>
          <div class="catalog-set-items">${escapeHtml(contents)}</div>
        </div>
        ${createCatalogCard(item).outerHTML}
      </div>
    `;

    const card = section.querySelector(".catalog-card");
    if (card && item.stock > 0) {
      card.addEventListener("click", () => showToast(t("tap_hint")));
      attachHoldToAdd(card, item);
    }

    return section;
  }


  function createCatalogCard(item) {
    const card = document.createElement("article");
    const soldOut = item.stock <= 0;
    const lowStock = item.stock > 0 && item.stock <= CONFIG.LOW_STOCK;

    card.className = "catalog-card" + (soldOut ? " sold-out" : "");

    const typeIcon = getTypeIcon(item.type);
    const stockLabel = soldOut
      ? "SOLD OUT"
      : lowStock
        ? t("low_stock", { count: item.stock })
        : t("in_stock", { count: item.stock });

    card.innerHTML = `
      <div class="card-top">
        <div class="item-icon">${typeIcon}</div>
        <div class="item-main">
          <div class="item-title-row">
            <h2 class="item-name">${escapeHtml(item.name)}</h2>
            <span class="item-variant ${item.variant === "R" ? "r" : ""}">
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
        <div class="price">${formatPrice(item.price)}</div>
        <div class="stock ${soldOut ? "sold" : lowStock ? "low" : ""}">
          ${stockLabel}
        </div>
      </div>
    `;

    if (!soldOut) {
      card.classList.add("clickable");
      card.addEventListener("click", () => showToast(t("tap_hint")));
      attachHoldToAdd(card, item);
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
        formatPrice(
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
          <p>${t("cart_empty_msg")}</p>
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
                ${formatPrice(item.price)}
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
        t("cart_empty_msg")
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
        t("cart_items_out_of_stock")
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
      t("wa_greeting"),
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
          `   ${t("wa_price_label")} ${formatPrice(item.price)}`
        );

        lines.push("");

      }
    );


    lines.push(
      `Total: ${formatPrice(total)}`
    );

    lines.push("");

    lines.push(
      t("wa_closing")
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
            t("cart_cleared")
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
              t("status_local")
            );


            renderMeta();

            renderCatalog();

            showToast(
              t("json_loaded")
            );

          } catch (error) {

            console.error(error);

            showToast(
              t("json_invalid")
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


    initLanguageToggle();
    renderLanguageUI();
    initCurrencyToggle();

    renderCatalog();

    renderCart();

    setupEvents();

    loadData();
  }


  init();

})();
