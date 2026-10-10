/* Portfolio Review — client meeting prototype */
(function () {
  "use strict";

  const STORAGE_KEY = "pr_cases_v4";
  const AUTH_KEY = "pr_auth_v1";
  // SHA-256("mose2026") — demo only, not bank-grade
  const PASS_HASH = "7074818e3f7915a08a954e030e3e2adfafb6a568f631e9c097f20842205b5dd4";
  const TYPE_COLORS = {
    Fund: "#1a56db",
    Stock: "#d97706",
    ELN: "#7c3aed",
    FX: "#059669",
    Deposit: "#0284c7",
    Insurance: "#e11d48",
    swap: "#0e7490",
    Swap: "#0e7490",
  };
  const TYPE_LABELS = {
    zh: {
      Fund: "基金",
      Stock: "股票",
      ELN: "股票掛鈎",
      FX: "外匯",
      Deposit: "定期存款",
      Insurance: "保險",
      swap: "保本高息",
      Swap: "保本高息",
      Maturity: "到期",
      Coupon: "派息／票息",
      Rebalance: "再平衡",
      "Insurance Gap": "保障缺口",
      Cash: "現金",
      Other: "其他",
    },
    en: {
      Fund: "Fund",
      Stock: "Stock",
      ELN: "ELN",
      FX: "FX",
      Deposit: "Deposit",
      Insurance: "Insurance",
      swap: "Swap",
      Swap: "Swap",
      Maturity: "Maturity",
      Coupon: "Coupon",
      Rebalance: "Rebalance",
      "Insurance Gap": "Insurance Gap",
      Cash: "Cash",
      Other: "Other",
    },
    "zh-Hans": {
      Fund: "基金",
      Stock: "股票",
      ELN: "股票挂钩",
      FX: "外汇",
      Deposit: "定期存款",
      Insurance: "保险",
      swap: "保本高息",
      Swap: "保本高息",
      Maturity: "到期",
      Coupon: "派息／票息",
      Rebalance: "再平衡",
      "Insurance Gap": "保障缺口",
      Cash: "现金",
      Other: "其他",
    },
  };

  const I18N = {
    zh: {
      brandSub: "客戶投資組合檢視",
      brandEn: "Portfolio Review",
      importCsv: "匯入 Excel／CSV",
      exportPdf: "匯出 PDF",
      lang: "EN",
      clientMode: "客戶模式",
      clientModeOn: "客戶模式 ON",
      clearCases: "清除本機個案",
      caseLabel: "個案",
      loadDemo: "重載示範",
      coverTitle: "投資組合檢視",
      coverSub: "Portfolio Review · 客戶會議用",
      client: "客戶",
      reviewDate: "檢視日期",
      rm: "客戶經理",
      risk: "風險取向",
      currency: "貨幣",
      aumLabel: "管理資產總值 AUM",
      aumHint: "持倉市值合計",
      snapTitle: "組合快照",
      totalAssets: "總資產",
      periodPnl: "期間盈虧",
      dayChg: "近期升跌",
      holdingCount: "持倉數目",
      vsCost: "相對成本",
      positions: "個產品",
      allocTitle: "資產配置",
      holdingsTitle: "持倉明細",
      all: "全部",
      colProduct: "產品",
      colType: "類型",
      colQty: "數量／名義",
      colCost: "成本",
      colMv: "市值",
      colPnl: "盈虧 $",
      colPnlPct: "盈虧 %",
      colDay: "升跌 %",
      moversTitle: "升跌焦點",
      gainers: "表現較佳",
      losers: "表現較弱",
      oppTitle: "跟進機會",
      oppEmpty: "暫無未完成機會",
      notesTitle: "會議備註／下一步",
      notesPlaceholder: "記錄客戶意向、下次行動、需要準備的材料…",
      disclaimer:
        "本文件只供參考，並非投資建議、要約或招攬。過往表現並不代表將來表現。產品價格、基金 NAV 及結構性產品估值或有延遲或由銀行報價提供。投資涉及風險，請細閱有關銷售文件。資料僅供客戶經理與客戶會面討論之用。",
      clientBanner: "客戶模式：已隱藏內部銷售備註與 RM 專用提示",
      toastImported: "已匯入並儲存個案",
      toastCleared: "已清除本機個案，已重載示範",
      toastSaved: "備註已儲存",
      due: "到期",
      amount: "金額",
      talking: "建議話術",
      rmOnly: "RM",
      logout: "登出",
      loginTitle: "登入",
      loginHint: "請輸入密碼以開啟投資組合檢視（示範用，非銀行級保安）",
      password: "密碼",
      loginBtn: "進入",
      loginError: "密碼不正確",
      searchPh: "搜尋客戶或產品…",
      searchClients: "客戶",
      searchProducts: "產品",
      searchEmpty: "找不到結果",
      holdersTitle: "產品持有人",
      holdersSub: "以下客戶持有此產品（跨個案）",
      openReview: "開啟檢視",
      backToReview: "返回客戶檢視",
      holdersCount: "位客戶持有",
      yieldLabel: "預期收益率",
      maturityLabel: "到期",
      startLabel: "起息",
      total: "合計",
    },
    en: {
      brandSub: "Client Portfolio Review",
      brandEn: "Portfolio Review",
      importCsv: "Import Excel/CSV",
      exportPdf: "Export PDF",
      lang: "中文",
      clientMode: "Client mode",
      clientModeOn: "Client mode ON",
      clearCases: "Clear local cases",
      caseLabel: "Case",
      loadDemo: "Reload demo",
      coverTitle: "Portfolio Review",
      coverSub: "For client meeting discussion",
      client: "Client",
      reviewDate: "Review date",
      rm: "Relationship manager",
      risk: "Risk profile",
      currency: "Currency",
      aumLabel: "Assets under management",
      aumHint: "Sum of market values",
      snapTitle: "Snapshot",
      totalAssets: "Total assets",
      periodPnl: "Period P&L",
      dayChg: "Recent change",
      holdingCount: "Holdings",
      vsCost: "vs cost",
      positions: "products",
      allocTitle: "Asset allocation",
      holdingsTitle: "Holdings",
      all: "All",
      colProduct: "Product",
      colType: "Type",
      colQty: "Qty / Notional",
      colCost: "Cost",
      colMv: "Market value",
      colPnl: "P&L $",
      colPnlPct: "P&L %",
      colDay: "Day %",
      moversTitle: "Movers",
      gainers: "Top gainers",
      losers: "Top losers",
      oppTitle: "Follow-ups / Opportunities",
      oppEmpty: "No open opportunities",
      notesTitle: "Notes / Next steps",
      notesPlaceholder: "Client intent, next actions, materials to prepare…",
      disclaimer:
        "For reference only. Not investment advice, an offer or solicitation. Past performance is not indicative of future results. Prices, fund NAVs and structured-product valuations may be delayed or bank-quoted. Investment involves risks. Please read the offering documents. For RM–client meeting discussion only.",
      clientBanner: "Client mode: internal sales notes and RM-only tips are hidden",
      toastImported: "Case imported and saved",
      toastCleared: "Local cases cleared; demo reloaded",
      toastSaved: "Notes saved",
      due: "Due",
      amount: "Amount",
      talking: "Talking point",
      rmOnly: "RM",
      logout: "Log out",
      loginTitle: "Sign in",
      loginHint: "Enter the password to open Portfolio Review (demo only — not bank-grade security).",
      password: "Password",
      loginBtn: "Enter",
      loginError: "Incorrect password",
      searchPh: "Search client or product…",
      searchClients: "Clients",
      searchProducts: "Products",
      searchEmpty: "No results",
      holdersTitle: "Product holders",
      holdersSub: "Clients holding this product (cross-case)",
      openReview: "Open review",
      backToReview: "Back to client review",
      holdersCount: "clients hold this",
      yieldLabel: "Expected yield",
      maturityLabel: "Maturity",
      startLabel: "Start",
      total: "Total",
    },
  };

  function getDemoCases() {
    const src = window.PR_DEMO_CASES || [];
    return JSON.parse(JSON.stringify(src));
  }

  let state = {
    lang: "zh",
    clientMode: false,
    cases: [],
    currentId: null,
    typeFilter: "all",
    sortKey: "market_value",
    sortDir: "desc",
    chart: null,
    authenticated: false,
    viewMode: "review", // review | holders
    holdersProduct: null,
  };

  function t(key) {
    const pack = I18N[state.lang] || I18N.zh;
    if (pack[key] != null) return pack[key];
    if (state.lang === "zh-Hans" && I18N.zh[key] != null) return I18N.zh[key];
    return key;
  }

  function typeLabel(type) {
    return (TYPE_LABELS[state.lang] && TYPE_LABELS[state.lang][type]) || type;
  }

  function fmtMoney(n, ccy) {
    if (n == null || isNaN(n)) return "—";
    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : "";
    let body;
    if (abs >= 1e6) body = (abs / 1e6).toFixed(2) + "M";
    else if (abs >= 1e3) body = (abs / 1e3).toFixed(1) + "K";
    else body = abs.toFixed(0);
    return sign + (ccy ? ccy + " " : "") + body;
  }

  function fmtMoneyFull(n, ccy, digits) {
    if (n == null || isNaN(n)) return "—";
    const d = digits == null ? (Math.abs(n % 1) > 1e-9 ? 2 : 0) : digits;
    const formatted = new Intl.NumberFormat("en-HK", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }).format(n);
    return (ccy ? ccy + " " : "") + formatted;
  }

  function fmtPct(n, digits) {
    if (n == null || isNaN(n)) return "—";
    const d = digits == null ? 2 : digits;
    const sign = n > 0 ? "+" : "";
    return sign + Number(n).toFixed(d) + "%";
  }

  function pnlClass(n) {
    if (n > 0) return "pos";
    if (n < 0) return "neg";
    return "";
  }

  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2400);
  }

  function loadCases() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          Array.isArray(parsed) &&
          parsed.length >= 2 &&
          parsed.some(
            (c) =>
              c.id === "demo-hong-yiu" &&
              (c.holdings || []).some((h) => h.type === "swap" && h.maturity_date === "2027-01-11")
          )
        ) {
          state.cases = parsed;
          return;
        }
      }
    } catch (e) {}
    state.cases = getDemoCases();
    saveCases();
  }

  function saveCases() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cases));
  }

  function currentCase() {
    return state.cases.find((c) => c.id === state.currentId) || state.cases[0];
  }

  function ensureCurrent() {
    if (!state.currentId || !state.cases.find((c) => c.id === state.currentId)) {
      state.currentId = state.cases[0].id;
    }
  }

  function computeAum(c) {
    return (c.holdings || []).reduce((s, h) => s + (Number(h.market_value) || 0), 0);
  }

  function computeCost(c) {
    return (c.holdings || []).reduce((s, h) => s + (Number(h.cost_value) || 0), 0);
  }

  function computePnl(c) {
    return computeAum(c) - computeCost(c);
  }

  function weightedDayChange(c) {
    const aum = computeAum(c);
    if (!aum) return 0;
    return (c.holdings || []).reduce((s, h) => {
      const mv = Number(h.market_value) || 0;
      const d = Number(h.day_change_pct) || 0;
      return s + (mv / aum) * d;
    }, 0);
  }

  function allocation(c) {
    const map = {};
    (c.holdings || []).forEach((h) => {
      map[h.type] = (map[h.type] || 0) + (Number(h.market_value) || 0);
    });
    const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    return Object.keys(map)
      .map((type) => ({
        type,
        value: map[type],
        pct: (map[type] / total) * 100,
      }))
      .sort((a, b) => b.value - a.value);
  }

  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });
    const nextLangLabel = state.lang === "zh" ? "EN" : state.lang === "en" ? "简" : "繁";
    document.querySelectorAll("#btnLang, #btnLoginLang").forEach((btn) => {
      if (btn) btn.textContent = nextLangLabel;
    });
    const cm = document.getElementById("btnClientMode");
    if (cm) {
      cm.textContent = state.clientMode ? t("clientModeOn") : t("clientMode");
      cm.classList.toggle("active-toggle", state.clientMode);
    }
    document.documentElement.lang =
      state.lang === "en" ? "en" : state.lang === "zh-Hans" ? "zh-Hans" : "zh-Hant";
  }

  function renderCaseSelect() {
    const sel = document.getElementById("caseSelect");
    sel.innerHTML = state.cases
      .map((c) => {
        const name =
          state.lang === "en" && c.display_name_en ? c.display_name_en : c.display_name;
        return `<option value="${c.id}">${name}</option>`;
      })
      .join("");
    sel.value = state.currentId;
  }

  function renderCover(c) {
    const name =
      state.lang === "en" && c.display_name_en ? c.display_name_en : c.display_name;
    const risk =
      state.lang === "zh" && c.risk_profile_zh ? c.risk_profile_zh : c.risk_profile;
    document.getElementById("coverName").textContent = name;
    document.getElementById("coverDate").textContent = c.review_date || "—";
    document.getElementById("coverRm").textContent = c.rm_name || "—";
    document.getElementById("coverRisk").textContent = risk || "—";
    document.getElementById("coverCcy").textContent = c.currency || "HKD";
    document.getElementById("coverAum").textContent = fmtMoneyFull(
      computeAum(c),
      c.currency || "HKD"
    );
  }

  function renderSnapshot(c) {
    const aum = computeAum(c);
    const pnl = computePnl(c);
    const pnlPct = computeCost(c) ? (pnl / computeCost(c)) * 100 : 0;
    const day = weightedDayChange(c);
    const count = (c.holdings || []).length;

    document.getElementById("snapAum").textContent = fmtMoney(aum, c.currency);
    document.getElementById("snapAum").className = "value";

    const pnlEl = document.getElementById("snapPnl");
    pnlEl.textContent = fmtMoney(pnl, c.currency);
    pnlEl.className = "value " + pnlClass(pnl);
    document.getElementById("snapPnlSub").textContent =
      t("vsCost") + " " + fmtPct(pnlPct);

    const dayEl = document.getElementById("snapDay");
    dayEl.textContent = fmtPct(day);
    dayEl.className = "value " + pnlClass(day);

    document.getElementById("snapCount").textContent = String(count);
    document.getElementById("snapCountSub").textContent = t("positions");
  }

  function renderAllocation(c) {
    const alloc = allocation(c);
    const canvas = document.getElementById("allocChart");
    const legend = document.getElementById("allocLegend");
    const total = computeAum(c);

    legend.innerHTML = alloc
      .map(
        (a) => `
      <div class="legend-row">
        <span class="swatch" style="background:${TYPE_COLORS[a.type] || "#999"}"></span>
        <span>${typeLabel(a.type)}</span>
        <span class="pct">${a.pct.toFixed(1)}%</span>
        <span class="amt">${fmtMoney(a.value, c.currency)}</span>
      </div>`
      )
      .join("");

    document.getElementById("donutTotal").textContent = fmtMoney(total, "");
    document.getElementById("donutLabel").textContent = t("total");

    if (state.chart) {
      state.chart.destroy();
      state.chart = null;
    }

    state.chart = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: alloc.map((a) => typeLabel(a.type)),
        datasets: [
          {
            data: alloc.map((a) => a.value),
            backgroundColor: alloc.map((a) => TYPE_COLORS[a.type] || "#999"),
            borderWidth: 2,
            borderColor: "#fff",
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "68%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const v = ctx.raw;
                const pct = total ? ((v / total) * 100).toFixed(1) : 0;
                return " " + fmtMoneyFull(v, c.currency) + " (" + pct + "%)";
              },
            },
          },
        },
      },
    });
  }

  function filteredHoldings(c) {
    let list = (c.holdings || []).slice();
    if (state.typeFilter !== "all") {
      list = list.filter((h) => h.type === state.typeFilter);
    }
    const key = state.sortKey;
    const dir = state.sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      let va = a[key];
      let vb = b[key];
      if (typeof va === "string") {
        return va.localeCompare(vb) * dir;
      }
      va = Number(va) || 0;
      vb = Number(vb) || 0;
      return (va - vb) * dir;
    });
    return list;
  }

  function renderFilters(c) {
    const types = ["all", ...new Set((c.holdings || []).map((h) => h.type))];
    const el = document.getElementById("typeFilters");
    el.innerHTML = types
      .map((ty) => {
        const label = ty === "all" ? t("all") : typeLabel(ty);
        const active = state.typeFilter === ty ? "active" : "";
        return `<button type="button" class="chip ${active}" data-type="${ty}">${label}</button>`;
      })
      .join("");
    el.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.typeFilter = btn.getAttribute("data-type");
        renderHoldings(currentCase());
        renderFilters(currentCase());
      });
    });
  }

  function holdingSubline(h) {
    const bits = [];
    if (h.start_date) bits.push(t("startLabel") + " " + h.start_date);
    if (h.maturity_date) bits.push(t("maturityLabel") + " " + h.maturity_date);
    if (h.tenor_days) bits.push(h.tenor_days + "d");
    if (h.expected_yield_pct != null) bits.push(t("yieldLabel") + " " + fmtPct(h.expected_yield_pct));
    if (h.currency_note) bits.push(h.currency_note);
    return bits.length
      ? `<div class="holding-sub">${bits.map(escapeHtml).join(" · ")}</div>`
      : "";
  }

  function renderHoldings(c) {
    const list = filteredHoldings(c);
    const tbody = document.getElementById("holdingsBody");
    tbody.innerHTML = list
      .map((h) => {
        const qtyDigits = h.type === "swap" || h.type === "Swap" ? 2 : undefined;
        return `<tr>
          <td><strong>${escapeHtml(h.product_name)}</strong>${holdingSubline(h)}</td>
          <td><span class="type-badge type-${escapeHtml(h.type)}">${typeLabel(h.type)}</span></td>
          <td class="num">${fmtMoneyFull(h.quantity, "", qtyDigits)}</td>
          <td class="num">${fmtMoneyFull(h.cost_value)}</td>
          <td class="num">${fmtMoneyFull(h.market_value)}</td>
          <td class="num ${pnlClass(h.pnl_value)}">${fmtMoneyFull(h.pnl_value)}</td>
          <td class="num ${pnlClass(h.pnl_pct)}">${fmtPct(h.pnl_pct)}</td>
          <td class="num ${pnlClass(h.day_change_pct)}">${fmtPct(h.day_change_pct)}</td>
        </tr>`;
      })
      .join("");
  }

  function renderMovers(c) {
    const list = (c.holdings || []).slice();
    const byDay = list.slice().sort((a, b) => (b.day_change_pct || 0) - (a.day_change_pct || 0));
    const gainers = byDay.filter((h) => (h.day_change_pct || 0) > 0).slice(0, 3);
    const losers = byDay
      .filter((h) => (h.day_change_pct || 0) < 0)
      .sort((a, b) => (a.day_change_pct || 0) - (b.day_change_pct || 0))
      .slice(0, 3);

    document.getElementById("gainersList").innerHTML =
      gainers
        .map(
          (h) => `<div class="mover-item up">
            <span class="name">${escapeHtml(h.product_name)}</span>
            <span class="chg pos">${fmtPct(h.day_change_pct)}</span>
          </div>`
        )
        .join("") || `<div class="mover-item">—</div>`;

    document.getElementById("losersList").innerHTML =
      losers
        .map(
          (h) => `<div class="mover-item down">
            <span class="name">${escapeHtml(h.product_name)}</span>
            <span class="chg neg">${fmtPct(h.day_change_pct)}</span>
          </div>`
        )
        .join("") || `<div class="mover-item">—</div>`;
  }

  function renderOpps(c) {
    let opps = (c.opportunities || []).slice();
    if (state.clientMode) {
      opps = opps.filter((o) => !o.hide_in_client_mode);
    }
    const el = document.getElementById("oppList");
    if (!opps.length) {
      el.innerHTML = `<div style="color:var(--muted);font-size:13px">${t("oppEmpty")}</div>`;
      return;
    }
    el.innerHTML = opps
      .map((o) => {
        const hideTag =
          o.hide_in_client_mode && !state.clientMode
            ? `<span class="rm-only-tag">${t("rmOnly")}</span>`
            : "";
        let talkHtml = "";
        if (o.talking_point) {
          if (state.clientMode) {
            talkHtml = `<div class="opp-talk">${escapeHtml(o.talking_point)}</div>`;
          } else {
            talkHtml = `<div class="opp-talk"><strong>${t("talking")}：</strong>${escapeHtml(
              o.talking_point
            )}</div>`;
          }
        }
        return `<label class="opp-item ${o.done ? "done" : ""}">
          <input type="checkbox" data-opp="${escapeHtml(o.id)}" ${o.done ? "checked" : ""} />
          <div>
            <div class="opp-title">${escapeHtml(o.title)}${hideTag}</div>
            <div class="opp-meta">
              <span class="prio prio-${escapeHtml(o.priority || "Low")}">${escapeHtml(
                o.priority || "Low"
              )}</span>
              <span>${typeLabel(o.category || "Other")}</span>
              ${o.due_date ? `<span>${t("due")}: ${escapeHtml(o.due_date)}</span>` : ""}
              ${
                o.amount != null
                  ? `<span>${t("amount")}: ${fmtMoneyFull(o.amount)}</span>`
                  : ""
              }
            </div>
            ${talkHtml}
          </div>
          <div></div>
        </label>`;
      })
      .join("");

    el.querySelectorAll("input[data-opp]").forEach((input) => {
      input.addEventListener("change", () => {
        const id = input.getAttribute("data-opp");
        const cas = currentCase();
        const opp = (cas.opportunities || []).find((x) => x.id === id);
        if (opp) {
          opp.done = input.checked;
          saveCases();
          renderOpps(cas);
        }
      });
    });
  }

  function renderNotes(c) {
    const ta = document.getElementById("notesArea");
    ta.value = c.notes || "";
  }

  function renderBanner() {
    const b = document.getElementById("clientBanner");
    b.classList.toggle("hidden", !state.clientMode);
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function showReviewView() {
    state.viewMode = "review";
    state.holdersProduct = null;
    document.getElementById("sec-product-holders").classList.add("hidden");
    document.getElementById("reviewSections").classList.remove("hidden");
  }

  function showHoldersView(productName) {
    state.viewMode = "holders";
    state.holdersProduct = productName;
    document.getElementById("reviewSections").classList.add("hidden");
    document.getElementById("sec-product-holders").classList.remove("hidden");
    renderProductHolders(productName);
    document.getElementById("sec-product-holders").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clientDisplayName(c) {
    return state.lang === "en" && c.display_name_en ? c.display_name_en : c.display_name;
  }

  function findHoldersOfProduct(productName) {
    const rows = [];
    const q = (productName || "").toLowerCase();
    state.cases.forEach((c) => {
      (c.holdings || []).forEach((h) => {
        if ((h.product_name || "").toLowerCase() === q) {
          rows.push({ caseId: c.id, client: c, holding: h });
        }
      });
    });
    rows.sort((a, b) => (b.holding.market_value || 0) - (a.holding.market_value || 0));
    return rows;
  }

  function renderProductHolders(productName) {
    const rows = findHoldersOfProduct(productName);
    document.getElementById("productHoldersTitle").textContent =
      t("holdersTitle") + " · " + productName;
    document.getElementById("productHoldersSub").textContent =
      t("holdersSub") + " — " + rows.length + " " + t("holdersCount");
    const body = document.getElementById("productHoldersBody");
    body.innerHTML = rows
      .map((r) => {
        const h = r.holding;
        return `<tr>
          <td><strong>${escapeHtml(clientDisplayName(r.client))}</strong><br/><span style="font-size:11px;color:var(--muted)">${escapeHtml(r.client.client_id || "")}</span></td>
          <td><span class="type-badge type-${h.type}">${typeLabel(h.type)}</span></td>
          <td class="num">${fmtMoneyFull(h.quantity)}</td>
          <td class="num">${fmtMoneyFull(h.market_value)}</td>
          <td class="num ${pnlClass(h.pnl_pct)}">${fmtPct(h.pnl_pct)}</td>
          <td class="num ${pnlClass(h.day_change_pct)}">${fmtPct(h.day_change_pct)}</td>
          <td><button type="button" class="btn-link" data-open-case="${escapeHtml(r.caseId)}">${t("openReview")}</button></td>
        </tr>`;
      })
      .join("") || `<tr><td colspan="7">${t("searchEmpty")}</td></tr>`;
    body.querySelectorAll("[data-open-case]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.currentId = btn.getAttribute("data-open-case");
        state.typeFilter = "all";
        showReviewView();
        renderAll();
        document.getElementById("sec-cover").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function runSearch(query) {
    const q = (query || "").trim().toLowerCase();
    const dd = document.getElementById("searchDropdown");
    if (!q) {
      dd.classList.add("hidden");
      dd.innerHTML = "";
      return;
    }
    const clients = [];
    state.cases.forEach((c) => {
      const names = [c.display_name, c.display_name_en, c.client_id]
        .filter(Boolean)
        .map((x) => String(x).toLowerCase());
      if (names.some((n) => n.includes(q))) clients.push(c);
    });
    const productMap = new Map();
    state.cases.forEach((c) => {
      (c.holdings || []).forEach((h) => {
        const pn = h.product_name || "";
        if (pn.toLowerCase().includes(q)) {
          if (!productMap.has(pn)) productMap.set(pn, { name: pn, type: h.type, count: 0 });
          productMap.get(pn).count += 1;
        }
      });
    });
    const products = Array.from(productMap.values()).sort((a, b) => b.count - a.count);

    if (!clients.length && !products.length) {
      dd.innerHTML = `<div class="search-empty">${t("searchEmpty")}</div>`;
      dd.classList.remove("hidden");
      return;
    }
    let html = "";
    if (clients.length) {
      html += `<div class="search-group"><div class="search-group-title">${t("searchClients")}</div>`;
      clients.forEach((c) => {
        html += `<button type="button" class="search-item" data-search-client="${escapeHtml(c.id)}">
          <strong>${escapeHtml(clientDisplayName(c))}</strong>
          <span>${escapeHtml(c.client_id || "")} · ${(c.holdings || []).length} holdings</span>
        </button>`;
      });
      html += `</div>`;
    }
    if (products.length) {
      html += `<div class="search-group"><div class="search-group-title">${t("searchProducts")}</div>`;
      products.forEach((p) => {
        html += `<button type="button" class="search-item" data-search-product="${escapeHtml(p.name)}">
          <strong>${escapeHtml(p.name)}</strong>
          <span>${typeLabel(p.type)} · ${p.count} ${t("holdersCount")}</span>
        </button>`;
      });
      html += `</div>`;
    }
    dd.innerHTML = html;
    dd.classList.remove("hidden");
    dd.querySelectorAll("[data-search-client]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.currentId = btn.getAttribute("data-search-client");
        state.typeFilter = "all";
        document.getElementById("globalSearch").value = "";
        dd.classList.add("hidden");
        showReviewView();
        renderAll();
        document.getElementById("sec-cover").scrollIntoView({ behavior: "smooth" });
      });
    });
    dd.querySelectorAll("[data-search-product]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-search-product");
        document.getElementById("globalSearch").value = name;
        dd.classList.add("hidden");
        showHoldersView(name);
      });
    });
  }

  async function sha256Hex(str) {
    const data = new TextEncoder().encode(str);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function applyAuthUI() {
    const gate = document.getElementById("loginGate");
    const shell = document.getElementById("appShell");
    if (state.authenticated) {
      gate.classList.add("hidden");
      shell.classList.remove("hidden");
    } else {
      gate.classList.remove("hidden");
      shell.classList.add("hidden");
    }
  }

  function renderAll() {
    applyI18n();
    applyAuthUI();
    if (!state.authenticated) return;
    ensureCurrent();
    const c = currentCase();
    renderCaseSelect();
    renderBanner();
    if (state.viewMode === "holders" && state.holdersProduct) {
      document.getElementById("reviewSections").classList.add("hidden");
      document.getElementById("sec-product-holders").classList.remove("hidden");
      renderProductHolders(state.holdersProduct);
    } else {
      document.getElementById("sec-product-holders").classList.add("hidden");
      document.getElementById("reviewSections").classList.remove("hidden");
      renderCover(c);
      renderSnapshot(c);
      renderAllocation(c);
      renderFilters(c);
      renderHoldings(c);
      renderMovers(c);
      renderOpps(c);
      renderNotes(c);
    }
  }

  /* CSV parsing */
  function parseCsv(text) {
    const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim());
    if (!lines.length) throw new Error("Empty CSV");
    const rows = lines.map(splitCsvLine);
    const header = rows[0].map((h) => h.trim().toLowerCase());

    if (header[0] === "section" && header.includes("field")) {
      return parseSectionCsv(rows);
    }
    return parseFlatCsv(header, rows.slice(1));
  }

  function splitCsvLine(line) {
    const out = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQ) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') {
          inQ = false;
        } else {
          cur += ch;
        }
      } else if (ch === '"') {
        inQ = true;
      } else if (ch === ",") {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out;
  }

  function parseSectionCsv(rows) {
    const meta = {};
    const holdings = [];
    const opportunities = [];
    let holding = null;
    let opportunity = null;

    function flushHolding() {
      if (holding && holding.product_name) {
        normalizeHolding(holding);
        holdings.push(holding);
      }
      holding = null;
    }
    function flushOpp() {
      if (opportunity && opportunity.title) {
        opportunity.id = opportunity.id || "o-" + Math.random().toString(36).slice(2, 8);
        opportunity.done = false;
        if (opportunity.hide_in_client_mode === "true" || opportunity.hide_in_client_mode === true) {
          opportunity.hide_in_client_mode = true;
        } else {
          opportunity.hide_in_client_mode = false;
        }
        if (opportunity.amount != null) opportunity.amount = Number(opportunity.amount);
        opportunities.push(opportunity);
      }
      opportunity = null;
    }

    for (let i = 1; i < rows.length; i++) {
      const [section, field, value] = rows[i];
      if (!section) continue;
      const sec = section.trim().toLowerCase();
      const f = (field || "").trim().toLowerCase();
      const v = (value || "").trim();

      if (sec === "meta") {
        flushHolding();
        flushOpp();
        meta[f] = v;
      } else if (sec === "holding") {
        flushOpp();
        if (f === "product_name") {
          flushHolding();
          holding = {};
        }
        if (!holding) holding = {};
        holding[f] = v;
      } else if (sec === "opportunity") {
        flushHolding();
        if (f === "title") {
          flushOpp();
          opportunity = {};
        }
        if (!opportunity) opportunity = {};
        opportunity[f] = v;
      }
    }
    flushHolding();
    flushOpp();

    const id = "case-" + Date.now();
    return {
      id,
      client_id: meta.client_id || id,
      display_name: meta.display_name || "Imported Client",
      display_name_en: meta.display_name_en || meta.display_name,
      review_date: meta.review_date || new Date().toISOString().slice(0, 10),
      rm_name: meta.rm_name || "Mose Lee",
      currency: meta.currency || "HKD",
      risk_profile: meta.risk_profile || "Balanced",
      risk_profile_zh: meta.risk_profile_zh || "",
      notes: meta.notes || "",
      holdings,
      opportunities,
    };
  }

  function parseFlatCsv(header, dataRows) {
    const idx = {};
    header.forEach((h, i) => {
      idx[h] = i;
    });
    const holdings = [];
    let display_name = "Imported Client";
    let client_id = "case-" + Date.now();
    dataRows.forEach((row) => {
      if (!row.length || row.every((c) => !c.trim())) return;
      const get = (k) => (idx[k] != null ? row[idx[k]] : "");
      if (get("display_name")) display_name = get("display_name");
      if (get("client_id")) client_id = get("client_id");
      const h = {
        product_name: get("product_name"),
        type: get("type") || "Fund",
        quantity: get("quantity"),
        cost_value: get("cost_value"),
        market_value: get("market_value"),
        day_change_pct: get("day_change_pct"),
        pnl_value: get("pnl_value"),
        pnl_pct: get("pnl_pct"),
        currency: get("currency") || "HKD",
      };
      if (h.product_name) {
        normalizeHolding(h);
        holdings.push(h);
      }
    });
    return {
      id: "case-" + Date.now(),
      client_id,
      display_name,
      display_name_en: display_name,
      review_date: new Date().toISOString().slice(0, 10),
      rm_name: "Mose Lee",
      currency: "HKD",
      risk_profile: "Balanced",
      notes: "",
      holdings,
      opportunities: [],
    };
  }

  function normalizeHolding(h) {
    ["quantity", "cost_value", "market_value", "day_change_pct", "pnl_value", "pnl_pct"].forEach(
      (k) => {
        if (h[k] != null && h[k] !== "") h[k] = Number(h[k]);
      }
    );
    if ((h.pnl_value == null || isNaN(h.pnl_value)) && h.market_value != null && h.cost_value != null) {
      h.pnl_value = h.market_value - h.cost_value;
    }
    if ((h.pnl_pct == null || isNaN(h.pnl_pct)) && h.cost_value) {
      h.pnl_pct = (h.pnl_value / h.cost_value) * 100;
    }
    const valid = ["Fund", "Stock", "ELN", "FX", "Deposit", "Insurance", "swap", "Swap"];
    if (!valid.includes(h.type)) {
      const map = {
        基金: "Fund",
        股票: "Stock",
        股票掛鈎: "ELN",
        股票挂钩: "ELN",
        外匯: "FX",
        外汇: "FX",
        定期: "Deposit",
        定期存款: "Deposit",
        保險: "Insurance",
        保险: "Insurance",
        保本高息: "swap",
        Swap: "swap",
        SWAP: "swap",
      };
      h.type = map[h.type] || "Fund";
    } else if (h.type === "Swap") {
      h.type = "swap";
    }
  }

  function wireEvents() {
    document.getElementById("btnLang").addEventListener("click", () => {
      state.lang = state.lang === "zh" ? "en" : state.lang === "en" ? "zh-Hans" : "zh";
      renderAll();
    });

    document.getElementById("btnClientMode").addEventListener("click", () => {
      state.clientMode = !state.clientMode;
      renderAll();
    });

    document.getElementById("btnPdf").addEventListener("click", () => {
      window.print();
    });

    document.getElementById("btnImport").addEventListener("click", () => {
      document.getElementById("fileInput").click();
    });

    document.getElementById("fileInput").addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const cas = parseCsv(String(reader.result));
          state.cases.push(cas);
          state.currentId = cas.id;
          state.typeFilter = "all";
          saveCases();
          renderAll();
          toast(t("toastImported"));
        } catch (err) {
          toast("CSV error: " + (err.message || err));
        }
        e.target.value = "";
      };
      reader.readAsText(file, "UTF-8");
    });

    document.getElementById("btnClear").addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      state.cases = getDemoCases();
      state.currentId = state.cases[0].id;
      state.viewMode = "review";
      saveCases();
      renderAll();
      toast(t("toastCleared"));
    });

    document.getElementById("btnDemo").addEventListener("click", () => {
      state.cases = getDemoCases();
      state.currentId = state.cases[0].id;
      state.viewMode = "review";
      saveCases();
      renderAll();
    });

    document.getElementById("caseSelect").addEventListener("change", (e) => {
      state.currentId = e.target.value;
      state.typeFilter = "all";
      showReviewView();
      renderAll();
    });

    document.getElementById("notesArea").addEventListener("change", (e) => {
      const c = currentCase();
      c.notes = e.target.value;
      saveCases();
      toast(t("toastSaved"));
    });

    document.querySelectorAll("th[data-sort]").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.getAttribute("data-sort");
        if (state.sortKey === key) {
          state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
        } else {
          state.sortKey = key;
          state.sortDir = key === "product_name" || key === "type" ? "asc" : "desc";
        }
        renderHoldings(currentCase());
      });
    });

    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        if (state.viewMode !== "review") {
          showReviewView();
          renderAll();
        }
        document.querySelectorAll(".nav-tab").forEach((x) => x.classList.remove("active"));
        tab.classList.add("active");
        const target = document.querySelector(tab.getAttribute("data-target"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    document.getElementById("btnLogout").addEventListener("click", () => {
      sessionStorage.removeItem(AUTH_KEY);
      state.authenticated = false;
      document.getElementById("loginPassword").value = "";
      applyAuthUI();
      applyI18n();
    });

    document.getElementById("btnLoginLang").addEventListener("click", () => {
      state.lang = state.lang === "zh" ? "en" : state.lang === "en" ? "zh-Hans" : "zh";
      applyI18n();
    });

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const pw = document.getElementById("loginPassword").value || "";
      const err = document.getElementById("loginError");
      try {
        const hex = await sha256Hex(pw);
        if (hex === PASS_HASH) {
          sessionStorage.setItem(AUTH_KEY, "1");
          state.authenticated = true;
          err.classList.add("hidden");
          document.getElementById("loginPassword").value = "";
          renderAll();
        } else {
          err.classList.remove("hidden");
        }
      } catch (ex) {
        err.classList.remove("hidden");
      }
    });

    const searchInput = document.getElementById("globalSearch");
    let searchTimer = null;
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => runSearch(searchInput.value), 150);
    });
    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim()) runSearch(searchInput.value);
    });
    document.addEventListener("click", (ev) => {
      const wrap = document.querySelector(".search-wrap");
      if (wrap && !wrap.contains(ev.target)) {
        document.getElementById("searchDropdown").classList.add("hidden");
      }
    });

    document.getElementById("btnCloseHolders").addEventListener("click", () => {
      showReviewView();
      renderAll();
    });
  }

  function init() {
    state.authenticated = sessionStorage.getItem(AUTH_KEY) === "1";
    loadCases();
    ensureCurrent();
    if (!state.currentId && state.cases.length) state.currentId = state.cases[0].id;
    wireEvents();
    applyI18n();
    applyAuthUI();
    if (state.authenticated) renderAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
