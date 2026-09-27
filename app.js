/* =========================================================
   AURCUS MARKET - BUYER CATALOG
   Master catalog = Aurcus Stok Generator
   accessories.json = source of current stock (no price data;
   harga selalu via chat WhatsApp / Telegram)
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIG
     ========================================================= */

  const CONFIG = {
    WA_NUMBER: "6285647706240",
    TELEGRAM_USERNAME: "orenaurcus",

    DATA_URL: "accessories.json",

    STORAGE_KEY: "aurcus-catalog-data",
    CART_KEY: "aurcus-market-cart",
    THEME_KEY: "aurcus-theme-pref",
    LANG_KEY: "aurcus-lang-pref",

    LOW_STOCK: 2
  };


  /* =========================================================
     TRANSLATIONS (ID / EN)
     ========================================================= */

  const TRANSLATIONS = {
    id: {
      filter_level_aria: "Filter level",
      filter_type_aria: "Filter tipe",
      filter_variant_aria: "Filter varian",
      filter_all_level: "Semua Level",
      filter_all_type: "Semua Tipe",
      filter_all_variant: "Semua Varian",
      reset_filter: "Reset Filter",
      empty_title: "Tidak ada item",
      empty_desc: "Coba ubah pencarian atau filter.",
      cart_title: "Keranjang",
      close_aria: "Tutup",
      open_cart_aria: "Buka keranjang",
      price_label: "Harga",
      price_via_chat: "Chat dulu ya",
      checkout_btn: "Checkout via WhatsApp",
      clear_cart: "Kosongkan Keranjang",
      result_info: "{{count}} item · {{available}} tersedia",
      parts_available: "{{available}}/{{total}} tersedia",
      set_contents_label: "ISI PACKAGE",
      set_contents_fallback: "Paket set",
      sold_out: "SOLD OUT",
      low_stock: "Sisa {{count}}",
      in_stock: "{{count}} tersedia",
      tap_hint: "Tekan untuk masukkan keranjang",
      added_to_cart: "{{name}} ({{type}}) ditambahkan ke cart.",
      cart_empty_msg: "Keranjang masih kosong.",
      cart_items_out_of_stock: "Item di keranjang sudah habis.",
      cart_cleared: "Keranjang dikosongkan.",
      json_loaded: "accessories.json berhasil dimuat.",
      json_invalid: "JSON tidak valid.",
      wa_greeting: "Halo Oren, saya mau order:",
      wa_closing: "Mohon info harga dan ketersediaannya ya.",
      status_loading: "Memuat...",
      status_online: "Online",
      status_cache: "Cache",
      status_offline: "Offline",
      status_local: "Local"
    },

    en: {
      filter_level_aria: "Level filter",
      filter_type_aria: "Type filter",
      filter_variant_aria: "Variant filter",
      filter_all_level: "All Levels",
      filter_all_type: "All Types",
      filter_all_variant: "All Variants",
      reset_filter: "Reset Filters",
      empty_title: "No items found",
      empty_desc: "Try changing your search or filters.",
      cart_title: "Cart",
      close_aria: "Close",
      open_cart_aria: "Open cart",
      price_label: "Price",
      price_via_chat: "Ask via chat",
      checkout_btn: "Checkout via WhatsApp",
      clear_cart: "Clear Cart",
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
      wa_closing: "Please let me know the price and availability.",
      status_loading: "Loading...",
      status_online: "Online",
      status_cache: "Cache",
      status_offline: "Offline",
      status_local: "Local"
    }
  };


  function t(key, vars) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.id;
    let text = dict[key] ?? TRANSLATIONS.id[key] ?? key;

    if (vars) {
      Object.keys(vars).forEach((k) => {
        text = text.replace(new RegExp("{{" + k + "}}", "g"), vars[k]);
      });
    }

    return text;
  }


  /* =========================================================
     MASTER CATALOG
     Source: Aurcus Stok Generator
     ========================================================= */

  const MASTER_BASE = [
    [115, "R", "Heavenly Thunder"],
    [115, "non-R", "Heavenly Thunder"],
    [115, "R", "Hidden Kamui"],
    [115, "non-R", "Hidden Kamui"],
    [115, "R", "Hidden Phantom"],
    [115, "R", "Hidden Sword Master's"],
    [115, "R", "Kamui"],
    [115, "non-R", "Kamui"],
    [115, "R", "Nightlight"],
    [115, "non-R", "Nightlight"],
    [115, "R", "Phantom"],
    [115, "R", "Tutelary"],
    [115, "non-R", "Tutelary"],

    [110, "R", "Dark Flame"],
    [110, "R", "Hidden Phantom"],
    [110, "R", "Hidden Sword Master's"],
    [110, "R", "Kamui"],
    [110, "non-R", "Kamui"],
    [110, "R", "Nightlight"],
    [110, "R", "Phantom"],
    [110, "R", "Sword Master"],
    [110, "R", "Tutelary"],

    [115, "R", "Thunderous"],
    [115, "R", "Sword Master"],
    [115, "R", "White Night"],

    [110, "non-R", "Tutelary"],
    [110, "non-R", "Nightlight"]
  ];

  const MASTER_SETS = [
    [115, "non-R", "Hidden Phantom"],
    [115, "non-R", "Hidden Sword Master's"],
    [115, "R", "Majestic"],
    [115, "non-R", "Phantom"],
    [115, "non-R", "Sword Master"],
    [115, "non-R", "Thunderous"],

    [110, "non-R", "Dark Flame"],
    [110, "non-R", "Hidden Phantom"],
    [110, "non-R", "Hidden Sword Master's"],
    [110, "non-R", "Phantom"],
    [110, "non-R", "Sword Master"]
  ];

  /*
    Seller Tool memang menghapus: 115 | non-R | Majestic
    Jadi tidak dimasukkan ke master aktif.
  */


  /* =========================================================
     DOM / STATE
     ========================================================= */

  const $ = (id) => document.getElementById(id);

  let catalog = [];
  let filters = { q: "", level: "all", type: "all", variant: "all" };
  let cart = loadCart();
  let lastUpdated = null;
  let theme = loadTheme();
  let lang = loadLanguage();


  /* =========================================================
     HELPERS
     ========================================================= */

  function safeNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function normalizeText(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
  }

  function normalizeVariant(value) {
    const v = normalizeText(value);
    if (v.toLowerCase() === "nonr" || v.toLowerCase() === "non-r") return "non-R";
    if (v.toUpperCase() === "R") return "R";
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
    return [safeNumber(level), normalizeVariant(variant), normalizeText(name).toLowerCase(), normalizeType(type)].join("|");
  }

  function slugify(value) {
    return normalizeText(value)
      .toUpperCase()
      .replace(/'/g, "")
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function makeId(level, variant, name, type) {
    const v = normalizeVariant(variant) === "R" ? "R" : "NONR";
    return slugify(name) + "-" + v + "-" + safeNumber(level) + "-" + normalizeType(type).toUpperCase();
  }

  function keyFromObject(item) {
    return itemKey(item.level, item.variant, item.name, item.type);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =========================================================
     BUILD MASTER CATALOG
     ========================================================= */

  function buildMasterCatalog() {
    const result = [];

    MASTER_BASE.forEach(([level, variant, name]) => {
      ["Necklace", "Ring", "Earring"].forEach((type) => {
        result.push({
          id: makeId(level, variant, name, type),
          name,
          level,
          variant,
          type,
          stock: 0,
          source: "master",
          master_set: false
        });
      });
    });

    MASTER_SETS.forEach(([level, variant, name]) => {
      result.push({
        id: makeId(level, variant, name, "SET"),
        name,
        level,
        variant,
        type: "Set",
        stock: 0,
        source: "master",
        isi: ["necklace", "ring", "earring"],
        master_set: true
      });
    });

    return result;
  }


  /* =========================================================
     JSON NORMALIZATION (stok only, no harga)
     ========================================================= */

  function normalizeJsonItem(raw) {
    if (!raw || typeof raw !== "object") return null;

    const type = normalizeType(raw.tipe ?? raw.type);
    const name = normalizeText(raw.nama ?? raw.name);
    const level = safeNumber(raw.level);
    const variant = normalizeVariant(raw.varian ?? raw.variant);

    if (!name || !level || !type) return null;

    const stock = Math.max(0, safeNumber(raw.stok ?? raw.stock));

    return {
      id: raw.id || makeId(level, variant, name, type),
      name,
      level,
      variant,
      type,
      stock,
      source: "json",
      ...(type === "Set" && Array.isArray(raw.isi)
        ? { isi: raw.isi.map((x) => normalizeText(x)).filter(Boolean), master_set: true }
        : { master_set: false })
    };
  }


  /* =========================================================
     MERGE MASTER + JSON
     ========================================================= */

  function mergeCatalog(jsonData) {
    const master = buildMasterCatalog();
    const map = new Map();

    master.forEach((item) => map.set(keyFromObject(item), { ...item }));

    const applyList = (list, forceSet) => {
      (Array.isArray(list) ? list : []).forEach((raw) => {
        const item = normalizeJsonItem(forceSet ? { ...raw, tipe: "set" } : raw);
        if (!item) return;

        const key = keyFromObject(item);

        if (map.has(key)) {
          const current = map.get(key);
          current.stock = item.stock;
          if (item.id) current.id = item.id;
          if (forceSet && Array.isArray(item.isi)) current.isi = [...item.isi];
          if (forceSet) current.master_set = true;
          current.source = "master+json";
        } else {
          map.set(key, { ...item, master_set: forceSet || item.master_set, source: "json-only" });
        }
      });
    };

    applyList(jsonData?.items, false);
    applyList(jsonData?.sets, true);

    return Array.from(map.values());
  }


  /* =========================================================
     LOAD DATA / CACHE
     ========================================================= */

  async function loadData() {
    setSyncStatus(t("status_loading"));

    try {
      const response = await fetch(CONFIG.DATA_URL + "?t=" + Date.now(), { cache: "no-store" });
      if (!response.ok) throw new Error("HTTP " + response.status);

      const data = await response.json();
      catalog = mergeCatalog(data);
      lastUpdated = data.last_updated || data.updated_at || null;

      saveCatalogCache(data);
      setSyncStatus(t("status_online"));
      renderMeta();
      renderCatalog();
      return;

    } catch (error) {
      console.warn("Gagal mengambil accessories.json:", error);

      const cached = loadCatalogCache();

      if (cached) {
        catalog = mergeCatalog(cached);
        lastUpdated = cached.last_updated || cached.updated_at || null;
        setSyncStatus(t("status_cache"));
        renderMeta();
        renderCatalog();
        return;
      }

      catalog = buildMasterCatalog();
      lastUpdated = null;
      setSyncStatus(t("status_offline"));
      renderMeta();
      renderCatalog();
    }
  }

  function saveCatalogCache(data) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Tidak bisa menyimpan cache:", error);
    }
  }

  function loadCatalogCache() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }


  /* =========================================================
     THEME PREFERENCE
     ========================================================= */

  function loadTheme() {
    try {
      return localStorage.getItem(CONFIG.THEME_KEY) === "light" ? "light" : "dark";
    } catch (error) {
      return "dark";
    }
  }

  function saveThemePref() {
    try {
      localStorage.setItem(CONFIG.THEME_KEY, theme);
    } catch (error) {
      console.warn("Theme pref tidak bisa disimpan:", error);
    }
  }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme();
    saveThemePref();
    renderThemeToggle();
  }

  function renderThemeToggle() {
    const button = $("theme-toggle");
    if (!button) return;

    const label = $("theme-toggle-label");
    const icon = theme === "dark" ? "🌙" : "☀️";

    if (label) label.textContent = icon;
    else button.textContent = icon;

    button.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    button.title = theme === "dark" ? "Ganti ke tema terang" : "Ganti ke tema gelap";
  }

  function initThemeToggle() {
    applyTheme();
    const button = $("theme-toggle");
    if (!button) return;
    button.addEventListener("click", toggleTheme);
    renderThemeToggle();
  }


  /* =========================================================
     LANGUAGE PREFERENCE
     ========================================================= */

  function loadLanguage() {
    try {
      return localStorage.getItem(CONFIG.LANG_KEY) === "en" ? "en" : "id";
    } catch (error) {
      return "id";
    }
  }

  function saveLanguagePref() {
    try {
      localStorage.setItem(CONFIG.LANG_KEY, lang);
    } catch (error) {
      console.warn("Language pref tidak bisa disimpan:", error);
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
    if (!button) return;

    button.textContent = lang === "id" ? "EN" : "ID";
    button.setAttribute("aria-pressed", lang === "en" ? "true" : "false");
    button.title = lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia";
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

    if (search) search.placeholder = lang === "id" ? "Cari accessories..." : "Search accessories...";
    if (level) level.setAttribute("aria-label", t("filter_level_aria"));
    if (type) type.setAttribute("aria-label", t("filter_type_aria"));
    if (variant) variant.setAttribute("aria-label", t("filter_variant_aria"));
    if (reset) reset.textContent = t("reset_filter");
    if (cartButton) cartButton.setAttribute("aria-label", t("open_cart_aria"));
    if (cartTitle) cartTitle.textContent = t("cart_title");
    if (closeCart) closeCart.setAttribute("aria-label", t("close_aria"));
    if (totalLabel) totalLabel.textContent = t("price_label");
    if (checkout) checkout.textContent = t("checkout_btn");
    if (clearCartButton) clearCartButton.textContent = t("clear_cart");
    if (emptyTitle) emptyTitle.textContent = t("empty_title");
    if (emptyDesc) emptyDesc.textContent = t("empty_desc");

    const syncStatus = $("sync-status");
    if (syncStatus) {
      const map = { "Memuat...": "status_loading", "Loading...": "status_loading", Online: "status_online", Cache: "status_cache", Offline: "status_offline", Local: "status_local" };
      const key = map[syncStatus.textContent];
      if (key) syncStatus.textContent = t(key);
    }

    renderLanguageToggle();
  }

  function initLanguageToggle() {
    const button = $("lang-toggle");
    if (!button) return;
    button.addEventListener("click", toggleLanguage);
    renderLanguageToggle();
  }


  /* =========================================================
     CART
     ========================================================= */

  function loadCart() {
    try {
      const raw = localStorage.getItem(CONFIG.CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CONFIG.CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.warn("Cart tidak bisa disimpan:", error);
    }
    renderCart();
  }

  function addToCart(item) {
    if (!item || item.stock <= 0) return;

    const existing = cart.find((x) => x.id === item.id);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + 1, item.stock);
    } else {
      cart.push({ id: item.id, name: item.name, level: item.level, variant: item.variant, type: item.type, quantity: 1 });
    }

    saveCart();
    showToast(t("added_to_cart", { name: item.name, type: item.type }));
  }

  function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    saveCart();
  }

  function changeCartQuantity(id, delta) {
    const cartItem = cart.find((x) => x.id === id);
    if (!cartItem) return;

    const catalogItem = catalog.find((x) => x.id === id);
    if (!catalogItem) {
      removeFromCart(id);
      return;
    }

    const next = cartItem.quantity + delta;
    if (next <= 0) {
      removeFromCart(id);
      return;
    }

    cartItem.quantity = Math.min(next, catalogItem.stock);
    saveCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
  }

  function cartCount() {
    return cart.reduce((total, item) => total + safeNumber(item.quantity), 0);
  }


  /* =========================================================
     FILTER
     ========================================================= */

  function populateFilters() {
    const levelSelect = $("level-filter");
    const typeSelect = $("type-filter");
    const variantSelect = $("variant-filter");
    if (!levelSelect || !typeSelect || !variantSelect) return;

    const levels = [...new Set(catalog.map((item) => item.level))].sort((a, b) => b - a);
    const types = [...new Set(catalog.map((item) => item.type))].sort();
    const variants = [...new Set(catalog.map((item) => item.variant))].sort((a, b) => (a === "R" ? -1 : b === "R" ? 1 : a.localeCompare(b)));

    levelSelect.innerHTML = `<option value="all">${escapeHtml(t("filter_all_level"))}</option>` +
      levels.map((level) => `<option value="${escapeHtml(level)}">${escapeHtml(level)}</option>`).join("");

    typeSelect.innerHTML = `<option value="all">${escapeHtml(t("filter_all_type"))}</option>` +
      types.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("");

    variantSelect.innerHTML = `<option value="all">${escapeHtml(t("filter_all_variant"))}</option>` +
      variants.map((variant) => `<option value="${escapeHtml(variant)}">${escapeHtml(variant)}</option>`).join("");

    levelSelect.value = filters.level;
    typeSelect.value = filters.type;
    variantSelect.value = filters.variant;
  }

  function filteredCatalog() {
    const q = filters.q.trim().toLowerCase();

    return catalog
      .filter((item) => {
        if (q && ![item.name, item.type, item.variant, item.level].join(" ").toLowerCase().includes(q)) return false;
        if (filters.level !== "all" && String(item.level) !== String(filters.level)) return false;
        if (filters.type !== "all" && item.type !== filters.type) return false;
        if (filters.variant !== "all" && item.variant !== filters.variant) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.stock > 0 && b.stock <= 0) return -1;
        if (a.stock <= 0 && b.stock > 0) return 1;
        if (a.level !== b.level) return b.level - a.level;

        const nameCompare = a.name.localeCompare(b.name);
        if (nameCompare !== 0) return nameCompare;

        if (a.variant === "R" && b.variant !== "R") return -1;
        if (a.variant !== "R" && b.variant === "R") return 1;

        return a.type.localeCompare(b.type);
      });
  }


  /* =========================================================
     RENDER CATALOG
     ========================================================= */

  function groupCatalogItems(items) {
    const groups = new Map();

    items.forEach((item) => {
      if (item.type === "Set" || item.master_set === true) {
        const key = "set|" + item.id;
        groups.set(key, { kind: "set", key, item });
        return;
      }

      const key = itemKey(item.level, item.variant, item.name, "parts");

      if (!groups.has(key)) {
        groups.set(key, { kind: "parts", key, name: item.name, level: item.level, variant: item.variant, items: [] });
      }

      groups.get(key).items.push(item);
    });

    return Array.from(groups.values());
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
      resultInfo.textContent = t("result_info", { count: items.length, available });
    }

    if (!items.length) {
      if (empty) empty.hidden = false;
      renderCart();
      return;
    }

    if (empty) empty.hidden = true;

    /*
      Catalog dibagi menjadi 4 blok vertikal tetap:
      Base Lv 115, Base Lv 110, Set Lv 115, Set Lv 110.
    */
    const sections = [
      { key: "base-115", title: "GOD LORD ACCESSORY LV 115", subtitle: "Parts", kind: "base", level: 115 },
      { key: "base-110", title: "GOD LORD ACCESSORY LV 110", subtitle: "Parts", kind: "base", level: 110 },
      { key: "set-115", title: "GOD LORD ACCESSORY LV 115", subtitle: "Sets", kind: "set", level: 115 },
      { key: "set-110", title: "GOD LORD ACCESSORY LV 110", subtitle: "Sets", kind: "set", level: 110 }
    ];

    sections.forEach((sectionConfig) => {
      const sectionItems = items.filter((item) => {
        const isSet = item.type === "Set" || item.master_set === true;
        const sameKind = sectionConfig.kind === "set" ? isSet : !isSet;
        return sameKind && Number(item.level) === sectionConfig.level;
      });

      container.appendChild(createCatalogLevelSection(sectionConfig, sectionItems));
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
        <div class="catalog-level-count">${t("result_info", { count: items.length, available })}</div>
      </div>
      <div class="catalog-level-body"></div>
    `;

    const body = section.querySelector(".catalog-level-body");

    if (!items.length) {
      body.innerHTML = `<div class="catalog-section-empty">Tidak ada item yang cocok dengan filter.</div>`;
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

      sets.forEach((item) => body.appendChild(createSetGroup(item)));
      return section;
    }

    const groups = groupCatalogItems(items).filter((group) => group.kind === "parts");
    groups.forEach((group) => body.appendChild(createPartsGroup(group)));

    return section;
  }

  function createPartsGroup(group) {
    const section = document.createElement("section");
    section.className = "item-block";
    section.dataset.rarity = group.variant === "R" ? "r" : "common";

    const order = { Necklace: 0, Earring: 1, Ring: 2 };
    const items = [...group.items].sort((a, b) => (order[a.type] ?? 99) - (order[b.type] ?? 99));
    const available = items.filter((item) => item.stock > 0).length;

    section.innerHTML = `
      <div class="item-block-head">
        <div class="item-block-title">
          <span class="item-block-name">${escapeHtml(group.name)}</span>
          <span class="item-block-variant">${escapeHtml(group.variant)}</span>
        </div>
        <span class="item-block-count">${t("parts_available", { available, total: items.length })}</span>
      </div>
      <div class="part-list"></div>
    `;

    const list = section.querySelector(".part-list");
    items.forEach((item) => list.appendChild(createPartChip(item)));

    return section;
  }

  function createSetGroup(item) {
    const section = document.createElement("section");
    section.className = "set-block";
    section.dataset.rarity = item.variant === "R" ? "r" : "common";

    const contents = Array.isArray(item.isi) && item.isi.length ? item.isi.join(" · ") : t("set_contents_fallback");

    section.innerHTML = `
      <div class="item-block-head">
        <div class="item-block-title">
          <span class="item-block-name">${escapeHtml(item.name)}</span>
          <span class="item-block-variant">${escapeHtml(item.variant)}</span>
        </div>
        <span class="set-tag">${t("set_contents_label")}</span>
      </div>
      <div class="set-contents">${escapeHtml(contents)}</div>
    `;

    section.appendChild(createFullRow(item));

    return section;
  }

  /*
    Part chip: baris ringkas untuk satu tipe part (Necklace/Ring/Earring)
    di dalam satu item-block. Nama & varian sudah ada di head grup,
    jadi chip cukup nampilin tipe + status stok.
  */
  function createPartChip(item) {
    const chip = document.createElement("button");
    const soldOut = item.stock <= 0;
    const lowStock = item.stock > 0 && item.stock <= CONFIG.LOW_STOCK;

    chip.type = "button";
    chip.className = "part-chip" + (soldOut ? " sold-out" : "") + (lowStock ? " low-stock" : "");

    const stockLabel = soldOut ? t("sold_out") : lowStock ? t("low_stock", { count: item.stock }) : t("in_stock", { count: item.stock });

    chip.innerHTML = `
      <span class="part-chip-type">${getTypeIcon(item.type)}</span>
      <span class="part-chip-stock">${stockLabel}</span>
    `;

    if (!soldOut) {
      chip.classList.add("clickable");
      chip.addEventListener("click", () => showToast(t("tap_hint")));
      attachHoldToAdd(chip, item);
    }

    return chip;
  }

  /*
    Full row: baris stok untuk item yang berdiri sendiri (Set).
  */
  function createFullRow(item) {
    const row = document.createElement("div");
    const soldOut = item.stock <= 0;
    const lowStock = item.stock > 0 && item.stock <= CONFIG.LOW_STOCK;

    row.className = "full-row" + (soldOut ? " sold-out" : "");

    const stockLabel = soldOut ? t("sold_out") : lowStock ? t("low_stock", { count: item.stock }) : t("in_stock", { count: item.stock });

    row.innerHTML = `
      <span class="full-row-meta">Lv ${escapeHtml(item.level)}</span>
      <span class="full-row-stock ${soldOut ? "sold" : lowStock ? "low-stock" : "in-stock"}">${stockLabel}</span>
    `;

    if (!soldOut) {
      row.classList.add("clickable");
      row.addEventListener("click", () => showToast(t("tap_hint")));
      attachHoldToAdd(row, item);
    }

    return row;
  }

  function getTypeIcon(type) {
    switch (type) {
      case "Necklace": return "NEC";
      case "Ring": return "RNG";
      case "Earring": return "EAR";
      case "Set": return "SET";
      default: return "ITEM";
    }
  }

  function attachHoldToAdd(card, item) {
    const HOLD_MS = 450;
    const MOVE_LIMIT = 10;

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
      if (Math.abs(e.clientX - startX) > MOVE_LIMIT || Math.abs(e.clientY - startY) > MOVE_LIMIT) cancel();
    });

    card.addEventListener("pointerup", cancel);
    card.addEventListener("pointerleave", cancel);
    card.addEventListener("pointercancel", cancel);
    card.addEventListener("contextmenu", (e) => e.preventDefault());
  }


  /* =========================================================
     CART UI
     ========================================================= */

  function renderCart() {
    const count = $("cart-count");
    const itemsContainer = $("cart-items");
    const total = $("cart-total");

    if (count) count.textContent = cartCount();
    if (total) total.textContent = t("price_via_chat");
    if (!itemsContainer) return;

    if (!cart.length) {
      itemsContainer.innerHTML = `<div class="cart-empty"><div>🛒</div><p>${t("cart_empty_msg")}</p></div>`;
      return;
    }

    itemsContainer.innerHTML = cart.map((item) => {
      const catalogItem = catalog.find((x) => x.id === item.id);
      const maxStock = catalogItem ? catalogItem.stock : 0;
      const qty = Math.min(item.quantity, maxStock);

      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <strong>${escapeHtml(item.name)}</strong>
            <small>Lv ${escapeHtml(item.level)} · ${escapeHtml(item.variant)} · ${escapeHtml(item.type)}</small>
          </div>
          <div class="cart-controls">
            <button type="button" class="cart-qty" data-cart-minus="${escapeHtml(item.id)}">−</button>
            <span>${qty}</span>
            <button type="button" class="cart-qty" data-cart-plus="${escapeHtml(item.id)}" ${qty >= maxStock ? "disabled" : ""}>+</button>
          </div>
          <button type="button" class="cart-remove" data-cart-remove="${escapeHtml(item.id)}">×</button>
        </div>
      `;
    }).join("");

    itemsContainer.querySelectorAll("[data-cart-minus]").forEach((button) => {
      button.addEventListener("click", () => changeCartQuantity(button.dataset.cartMinus, -1));
    });

    itemsContainer.querySelectorAll("[data-cart-plus]").forEach((button) => {
      button.addEventListener("click", () => changeCartQuantity(button.dataset.cartPlus, 1));
    });

    itemsContainer.querySelectorAll("[data-cart-remove]").forEach((button) => {
      button.addEventListener("click", () => removeFromCart(button.dataset.cartRemove));
    });
  }


  /* =========================================================
     CHECKOUT (WhatsApp / Telegram)
     ========================================================= */

  function buildCheckoutMessage() {
    if (!cart.length) {
      showToast(t("cart_empty_msg"));
      return null;
    }

    const validItems = [];

    cart.forEach((cartItem) => {
      const catalogItem = catalog.find((item) => item.id === cartItem.id);
      if (!catalogItem || catalogItem.stock <= 0) return;

      const quantity = Math.min(cartItem.quantity, catalogItem.stock);
      if (quantity <= 0) return;

      validItems.push({ ...cartItem, quantity });
    });

    if (!validItems.length) {
      showToast(t("cart_items_out_of_stock"));
      cart = [];
      saveCart();
      return null;
    }

    const lines = [t("wa_greeting"), ""];

    validItems.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.name}`);
      lines.push(`   Lv ${item.level} · ${item.variant} · ${item.type}`);
      lines.push(`   Qty: ${item.quantity}`);
      lines.push("");
    });

    lines.push(t("wa_closing"));

    return encodeURIComponent(lines.join("\n"));
  }

  function checkoutWhatsApp() {
    const message = buildCheckoutMessage();
    if (!message) return;
    window.open(`https://wa.me/${CONFIG.WA_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  }

  function checkoutTelegram() {
    const message = buildCheckoutMessage();
    if (!message) return;
    window.open(`https://t.me/${CONFIG.TELEGRAM_USERNAME}?text=${message}`, "_blank", "noopener,noreferrer");
  }


  /* =========================================================
     UI EVENTS
     ========================================================= */

  function setupEvents() {
    const search = $("q");
    const level = $("level-filter");
    const type = $("type-filter");
    const variant = $("variant-filter");
    const reset = $("reset-btn");

    if (search) search.addEventListener("input", (e) => { filters.q = e.target.value; renderCatalog(); });
    if (level) level.addEventListener("change", (e) => { filters.level = e.target.value; renderCatalog(); });
    if (type) type.addEventListener("change", (e) => { filters.type = e.target.value; renderCatalog(); });
    if (variant) variant.addEventListener("change", (e) => { filters.variant = e.target.value; renderCatalog(); });

    if (reset) {
      reset.addEventListener("click", () => {
        filters = { q: "", level: "all", type: "all", variant: "all" };
        if (search) search.value = "";
        renderCatalog();
      });
    }

    const cartButton = $("cart-btn");
    const closeCart = $("close-cart");
    const backdrop = $("cart-backdrop");
    const clearCartButton = $("clear-cart");
    const checkout = $("checkout-btn");
    const checkoutTelegramBtn = $("checkout-telegram-btn");

    if (cartButton) cartButton.addEventListener("click", openCart);
    if (closeCart) closeCart.addEventListener("click", closeCartSheet);
    if (backdrop) backdrop.addEventListener("click", closeCartSheet);

    if (clearCartButton) {
      clearCartButton.addEventListener("click", () => {
        clearCart();
        showToast(t("cart_cleared"));
      });
    }

    if (checkout) checkout.addEventListener("click", checkoutWhatsApp);
    if (checkoutTelegramBtn) checkoutTelegramBtn.addEventListener("click", checkoutTelegram);
  }


  /* =========================================================
     CART DRAWER
     ========================================================= */

  function openCart() {
    const sheet = $("cart-sheet");
    if (!sheet) return;

    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");

    renderCart();
  }

  function closeCartSheet() {
    const sheet = $("cart-sheet");
    if (!sheet) return;

    sheet.classList.remove("open");
    sheet.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
  }


  /* =========================================================
     STATUS
     ========================================================= */

  function setSyncStatus(text) {
    const element = $("sync-status");
    if (element) element.textContent = text;
  }

  function renderMeta() {
    const meta = $("meta");
    if (!meta) return;

    if (!lastUpdated) {
      meta.textContent = "—";
      return;
    }

    const date = new Date(lastUpdated);

    if (Number.isNaN(date.getTime())) {
      meta.textContent = String(lastUpdated);
      return;
    }

    meta.textContent = date.toLocaleString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }


  /* =========================================================
     TOAST
     ========================================================= */

  let toastTimer = null;

  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }


  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    /*
      Penting: langsung tampilkan master dulu, jadi buyer
      tidak menunggu JSON untuk mengetahui daftar barang.
    */
    catalog = buildMasterCatalog();

    initThemeToggle();
    initLanguageToggle();
    renderLanguageUI();

    renderCatalog();
    renderCart();
    setupEvents();

    loadData();
  }

  init();

})();


/* =========================================================
   STICKY LEVEL CHIP (kayak sticky date label WhatsApp)
   ---------------------------------------------------------
   Blok mandiri, terpisah dari IIFE utama di atas — cuma
   "menonton" DOM #catalog via MutationObserver + mengamati
   header tiap section via IntersectionObserver. Tidak
   menyentuh/mengganggu satu pun fungsi/logic yang sudah ada.
   ========================================================= */

(() => {
  "use strict";

  const chip = document.getElementById("catalog-sticky-chip");
  const chipText = document.getElementById("catalog-sticky-chip-text");
  const catalogEl = document.getElementById("catalog");
  const hero = document.querySelector(".hero");

  if (!chip || !chipText || !catalogEl) return;

  const STRINGS = {
    id: { viewing: "Lagi liat" },
    en: { viewing: "Viewing" }
  };

  let headObserver = null;
  const stuckHeads = new Set();

  function currentLang() {
    return document.documentElement.lang === "en" ? "en" : "id";
  }

  function headerOffset() {
    return hero ? Math.ceil(hero.getBoundingClientRect().height) : 0;
  }

  function labelForHead(headEl) {
    const strong = headEl.querySelector(".catalog-level-heading strong");
    const span = headEl.querySelector(".catalog-level-heading span");

    const rawTitle = strong ? strong.textContent.trim() : "";
    const levelMatch = rawTitle.match(/(\d+)\s*$/);
    const levelLabel = levelMatch ? `Lv ${levelMatch[1]}` : rawTitle;
    const subtitle = span ? span.textContent.trim() : "";

    const prefix = (STRINGS[currentLang()] || STRINGS.id).viewing;

    return subtitle ? `${prefix} ${levelLabel} \u00b7 ${subtitle}` : `${prefix} ${levelLabel}`;
  }

  function refreshChipContent() {
    const heads = Array.from(catalogEl.querySelectorAll(".catalog-level-head"));
    let active = null;

    heads.forEach((head) => {
      if (stuckHeads.has(head)) active = head;
    });

    if (!active) {
      chip.hidden = true;
      return;
    }

    chipText.textContent = labelForHead(active);
    chip.hidden = false;
  }

  function onIntersect(entries) {
    entries.forEach((entry) => {
      const rootTop = entry.rootBounds ? entry.rootBounds.top : headerOffset();
      const targetTop = entry.boundingClientRect.top;
      const targetBottom = entry.boundingClientRect.bottom;

      if (targetTop < rootTop) {
        stuckHeads.add(entry.target);
      } else if (targetBottom >= rootTop) {
        stuckHeads.delete(entry.target);
      }
    });

    refreshChipContent();
  }

  function attachObserver() {
    if (headObserver) headObserver.disconnect();
    stuckHeads.clear();

    const offset = headerOffset();
    chip.style.top = offset + "px";

    headObserver = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: `-${offset}px 0px 0px 0px`,
      threshold: [0, 1]
    });

    catalogEl.querySelectorAll(".catalog-level-head").forEach((head) => {
      headObserver.observe(head);
    });

    refreshChipContent();
  }

  // Setiap kali #catalog di-render ulang (search/filter/reset/data baru),
  // childList-nya berubah → kita cukup pasang ulang observer di sini.
  const catalogWatcher = new MutationObserver(attachObserver);
  catalogWatcher.observe(catalogEl, { childList: true });

  window.addEventListener("resize", attachObserver);
  window.addEventListener("load", attachObserver);

  attachObserver();
})();
