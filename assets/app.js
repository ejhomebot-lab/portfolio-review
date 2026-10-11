/* Portfolio Review — client meeting prototype */
(function () {
  "use strict";

  const STORAGE_KEY = "pr_cases_v9";
  /** Set true to re-enable password gate (mose2026 / SHA-256 below). */
  const AUTH_ENABLED = false;
  const AUTH_KEY = "pr_auth_v1";
  // SHA-256("mose2026") — demo only, not bank-grade
  const PASS_HASH = "7074818e3f7915a08a954e030e3e2adfafb6a568f631e9c097f20842205b5dd4";
  const BOCOM_FUND_PORTAL =
    "https://www.hk.bankcomm.com/hk/shtml/hk/tw/2004980/2005004/2008356/2631959.shtml?channelId=2004980";
  const ETWEALTH_BASE = "https://fc11.etwealth.com/wfc-bocom-v3/ws";
  const fundEnrichCache = {};
  const fundDocCache = {};
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
        "本文件只供參考，並非投資建議、要約或招攬。過往表現並不代表將來表現。產品價格、結構性產品估值或有延遲。投資涉及風險，請細閱有關銷售文件。資料僅供客戶經理與客戶會面討論之用。",
      disclaimerThird:
        "交通銀行香港基金頁及環富通（ET Wealth）所顯示之 NAV、派息、圖表與基金文件均為第三方公開參考資料，並非本行正式報價或要約，可能延遲、不完整或與銀行系統不一致；請以銀行官方渠道及銷售文件為準。",
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
      colSwapStart: "起息日",
      colSwapMaturity: "到期日",
      colSwapPrincipal: "本金（美元存款金額）",
      colSwapInterest: "利息（美元收益）",
      colSwapRate: "利率（組合收益率）",
      colSwapMaturityAmt: "到期本加息（到期日所得美元）",
      swapTableTitle: "保本高息 Swap",
      advSearch: "進階搜尋",
      advSearchTitle: "進階搜尋條件",
      advAumMin: "AUM 下限（HKD）",
      advAumMax: "AUM 上限（HKD）",
      advProductType: "產品類型",
      advRisk: "風險取向",
      advMatFrom: "到期日起",
      advMatTo: "到期日止",
      advApply: "套用篩選",
      advClear: "清除篩選",
      advResults: "篩選結果",
      advMatchCount: "位客戶符合",
      advNoMatch: "沒有符合條件的客戶",
      advNextMaturity: "最近到期",
      advAny: "全部",
      riskConservative: "保守型",
      riskBalanced: "均衡型",
      riskGrowth: "增長型",
      riskAggressive: "進取型",
      homeTitle: "客戶一覽",
      homeLead: "選擇客戶開始投資組合檢視，或使用搜尋／進階篩選。",
      exportReports: "導出報表",
      reportMaturity90: "未來3個月到期客戶報表",
      reportFunds: "基金報表",
      reportEln90: "股票掛鈎未來3個月到期",
      reportCsv: "下載 CSV",
      reportPdf: "列印／PDF",
      reportEmpty: "此報表暫無資料",
      reportGenerated: "報表已準備",
      colClient: "客戶",
      fundInfo: "基金資料",
      fundCopyName: "複製名稱",
      fundCopied: "已複製基金名稱",
      fundNav: "最新 NAV",
      fundAsOf: "估值日",
      fundDiv: "最近派息",
      fundReport: "基金報告",
      fundReportUnavailable: "此基金暫無直連報告 PDF；已開啟 Morningstar 搜尋（或請複製基金名稱）",
      fundReportCopied: "已複製基金名稱，可於 Morningstar／銀行頁搜尋",
      fundPortalNote: "基金資料經交通銀行香港／環富通公開介面盡力更新 NAV。基金報告一律開啟環富通 getFdDocList 的 PDF（不經交行同意頁）；無 fdId／無 PDF 則改 Morningstar 搜尋。",

      moreMenu: "更多",
      downloadTemplate: "下載 Excel 範本",
      backupCases: "備份個案（JSON／ZIP）",
      toastBackup: "已下載個案備份",
      toastTemplate: "已下載 Excel 範本",
      toastImportedBatch: "已匯入多個個案",
      syncHintTitle: "資料流：Notion → Excel → CSV／XLSX → 本頁",
      syncHintNote: "基金 NAV／圖表經環富通公開介面盡力顯示，屬第三方參考，非銀行正式報價。",
      homeNearestMat: "最近到期",
      homeDays: "日",
      homeOpenOpps: "未完成機會",
      homeNoMaturity: "無近期到期",
      colNav: "最新 NAV",
      colMonthlyDiv: "月派息 %",
      colUnits: "持有單位",
      colFee: "費用",
      colPrincipalNet: "本金（扣費後）",
      fundChartTitle: "近1年價格",
      fundApiOk: "基金資料已更新（第三方參考）",
      fundApiFail: "基金 API 未能更新（顯示本機／示範數值）",
      fundApiNone: "無 fdId，無法自動抓取 NAV／圖表",
      fundTableTitle: "基金持倉",
      elnTableTitle: "股票掛鈎票據（ELN）",
      depositTableTitle: "定期存款",
      colUnderlying: "掛鈎標的",
      colStrike: "行使價 %",
      colRate: "利率 %",
      colStart: "起息日",
      colMaturity: "到期日",
      reportExcel: "下載 Excel",
      reportCsv: "下載 CSV",
      exportGroupCore: "核心報表",
      exportGroupMaturity: "到期／產品",
      exportGroupRisk: "風險／表現",
      exportGroupOther: "其他",
      reportSwap30: "Swap／保本高息 — 1個月內到期",
      reportSwap90: "Swap／保本高息 — 3個月內到期",
      reportSwap180: "Swap／保本高息 — 6個月內到期",
      reportDeposit: "定期存款到期報表",
      reportInsurance: "保險跟進報表",
      reportLosses: "虧損持倉（P&L < 0）",
      reportHighAum: "高 AUM／重點客戶排名",
      reportPnlRank: "期間盈虧排名",
      reportConcentration: "產品集中度（超配）",
      reportFx: "外匯／貨幣敞口摘要",
      reportSingle: "單一產品持有人",
      reportSinglePick: "選擇產品以列出持有人",
      reportOpps: "機會清單導出",
      advSegment: "客戶層級",
      advCurrency: "貨幣",
      advPnlSign: "盈虧方向",
      advPnlProfit: "整體盈利",
      advPnlLoss: "整體虧損",
      advPnlHasLoss: "有虧損持倉",
      advHasOpp: "有跟進機會",
      advYes: "是",
      advNo: "否",
      advProductMix: "產品組合",
      advMixSingle: "單一產品",
      advMixMulti: "多元產品",
      advSort: "排序",
      advSortAumDesc: "AUM 高→低",
      advSortAumAsc: "AUM 低→高",
      advSortName: "客戶名稱",
      advSortPnl: "盈虧 % 高→低",
      advSortMaturity: "最近到期",
      colSegment: "層級",
      colWeight: "佔比 %",
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
        "For reference only. Not investment advice, an offer or solicitation. Past performance is not indicative of future results. Prices and structured-product valuations may be delayed. Investment involves risks. Please read the offering documents. For RM–client meeting discussion only.",
      disclaimerThird:
        "Fund NAV, dividends, charts and documents from Bank of Communications (HK) / ET Wealth are third-party public reference only — not official bank quotes or offers. Data may be delayed, incomplete or differ from bank systems; rely on official bank channels and offering documents.",
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
      colSwapStart: "Start date",
      colSwapMaturity: "Maturity date",
      colSwapPrincipal: "Principal (USD deposit)",
      colSwapInterest: "Interest (USD gain)",
      colSwapRate: "Rate (portfolio yield)",
      colSwapMaturityAmt: "Principal + interest at maturity (USD)",
      swapTableTitle: "Principal-protected Swap",
      advSearch: "Advanced search",
      advSearchTitle: "Advanced filters",
      advAumMin: "AUM min (HKD)",
      advAumMax: "AUM max (HKD)",
      advProductType: "Product type",
      advRisk: "Risk profile",
      advMatFrom: "Maturity from",
      advMatTo: "Maturity to",
      advApply: "Apply filters",
      advClear: "Clear filters",
      advResults: "Filter results",
      advMatchCount: "clients match",
      advNoMatch: "No clients match these filters",
      advNextMaturity: "Next maturity",
      advAny: "Any",
      riskConservative: "Conservative",
      riskBalanced: "Balanced",
      riskGrowth: "Growth",
      riskAggressive: "Aggressive",
      homeTitle: "Client overview",
      homeLead: "Pick a client to start a portfolio review, or use search / advanced filters.",
      exportReports: "Export reports",
      reportMaturity90: "Maturities in next 3 months",
      reportFunds: "Fund holdings report",
      reportEln90: "ELN maturing in next 3 months",
      reportCsv: "Download CSV",
      reportPdf: "Print / PDF",
      reportEmpty: "No rows for this report",
      reportGenerated: "Report ready",
      colClient: "Client",
      fundInfo: "Fund info",
      fundCopyName: "Copy name",
      fundCopied: "Fund name copied",
      fundNav: "Latest NAV",
      fundAsOf: "As of",
      fundDiv: "Last dividend",
      fundReport: "Fund report",
      fundReportUnavailable: "No direct report PDF — opened Morningstar search (or copy the fund name)",
      fundReportCopied: "Fund name copied — search on Morningstar / bank portal",
      fundPortalNote: "Fund data via BOCOM HK / ET Wealth. Fund report always opens the ET Wealth getFdDocList PDF (never the bank agree wall). Without fdId/PDF, falls back to Morningstar search.",

      moreMenu: "More",
      downloadTemplate: "Download Excel template",
      backupCases: "Backup cases (JSON/ZIP)",
      toastBackup: "Cases backup downloaded",
      toastTemplate: "Excel template downloaded",
      toastImportedBatch: "Imported multiple cases",
      syncHintTitle: "Flow: Notion → Excel → CSV/XLSX → this page",
      syncHintNote: "Fund NAV/charts via ET Wealth are best-effort third-party reference, not official bank quotes.",
      homeNearestMat: "Nearest maturity",
      homeDays: "d",
      homeOpenOpps: "Open opportunities",
      homeNoMaturity: "No near maturity",
      colNav: "NAV",
      colMonthlyDiv: "Monthly div %",
      colUnits: "Units",
      colFee: "Fee",
      colPrincipalNet: "Principal (after fee)",
      fundChartTitle: "1Y price",
      fundApiOk: "Fund data updated (third-party reference)",
      fundApiFail: "Fund API unavailable (showing local/demo values)",
      fundApiNone: "No fdId — cannot auto-fetch NAV/chart",
      fundTableTitle: "Fund holdings",
      elnTableTitle: "Equity-linked notes (ELN)",
      depositTableTitle: "Time deposits",
      colUnderlying: "Underlying",
      colStrike: "Strike %",
      colRate: "Rate %",
      colStart: "Start",
      colMaturity: "Maturity",
      reportExcel: "Download Excel",
      reportCsv: "Download CSV",
      exportGroupCore: "Core reports",
      exportGroupMaturity: "Maturity / product",
      exportGroupRisk: "Risk / performance",
      exportGroupOther: "Other",
      reportSwap30: "Swap — mature within 1 month",
      reportSwap90: "Swap — mature within 3 months",
      reportSwap180: "Swap — mature within 6 months",
      reportDeposit: "Time-deposit maturities",
      reportInsurance: "Insurance follow-ups",
      reportLosses: "Loss-making holdings (P&L < 0)",
      reportHighAum: "High AUM / key clients",
      reportPnlRank: "Period P&L ranking",
      reportConcentration: "Concentration (overweight types)",
      reportFx: "FX / currency exposure",
      reportSingle: "Single-product holders",
      reportSinglePick: "Pick a product to list holders",
      reportOpps: "Opportunities checklist",
      advSegment: "Segment",
      advCurrency: "Currency",
      advPnlSign: "P&L direction",
      advPnlProfit: "Overall profit",
      advPnlLoss: "Overall loss",
      advPnlHasLoss: "Has losing holding",
      advHasOpp: "Has opportunity",
      advYes: "Yes",
      advNo: "No",
      advProductMix: "Product mix",
      advMixSingle: "Single product",
      advMixMulti: "Multi product",
      advSort: "Sort by",
      advSortAumDesc: "AUM high→low",
      advSortAumAsc: "AUM low→high",
      advSortName: "Client name",
      advSortPnl: "P&L % high→low",
      advSortMaturity: "Nearest maturity",
      colSegment: "Segment",
      colWeight: "Weight %",
      total: "Total",
    },
  };
  I18N["zh-Hans"] = Object.assign({}, I18N.zh, {
    brandSub: "客户投资组合检视",
    importCsv: "导入 Excel／CSV",
    exportPdf: "导出 PDF",
    clientMode: "客户模式",
    clientModeOn: "客户模式 ON",
    clearCases: "清除本机个案",
    caseLabel: "个案",
    loadDemo: "重载示范",
    coverTitle: "投资组合检视",
    coverSub: "Portfolio Review · 客户会议用",
    client: "客户",
    reviewDate: "检视日期",
    rm: "客户经理",
    risk: "风险取向",
    currency: "货币",
    aumLabel: "管理资产总值 AUM",
    aumHint: "持仓市值合计",
    snapTitle: "组合快照",
    totalAssets: "总资产",
    periodPnl: "期间盈亏",
    dayChg: "近期升跌",
    holdingCount: "持仓数目",
    vsCost: "相对成本",
    positions: "个产品",
    allocTitle: "资产配置",
    holdingsTitle: "持仓明细",
    all: "全部",
    colProduct: "产品",
    colType: "类型",
    colQty: "数量／名义",
    colCost: "成本",
    colMv: "市值",
    colPnl: "盈亏 $",
    colPnlPct: "盈亏 %",
    colDay: "升跌 %",
    moversTitle: "升跌焦点",
    gainers: "表现较佳",
    losers: "表现较弱",
    oppTitle: "跟进机会",
    notesTitle: "会议备注／下一步",
    logout: "登出",
    searchPh: "搜寻客户或产品…",
    searchClients: "客户",
    searchProducts: "产品",
    searchEmpty: "找不到结果",
    holdersTitle: "产品持有人",
    backToReview: "返回客户检视",
    holdersCount: "位客户持有",
    yieldLabel: "预期收益率",
    maturityLabel: "到期",
    startLabel: "起息",
    colSwapStart: "起息日",
    colSwapMaturity: "到期日",
    colSwapPrincipal: "本金（美元存款金额）",
    colSwapInterest: "利息（美元收益）",
    colSwapRate: "利率（组合收益率）",
    colSwapMaturityAmt: "到期本加息（到期日所得美元）",
    swapTableTitle: "保本高息 Swap",
    advSearch: "进阶搜寻",
    advSearchTitle: "进阶搜寻条件",
    advAumMin: "AUM 下限（HKD）",
    advAumMax: "AUM 上限（HKD）",
    advProductType: "产品类型",
    advRisk: "风险取向",
    advMatFrom: "到期日起",
    advMatTo: "到期日止",
    advApply: "套用筛选",
    advClear: "清除筛选",
    advResults: "筛选结果",
    advMatchCount: "位客户符合",
    advNoMatch: "没有符合条件的客户",
    advNextMaturity: "最近到期",
    advAny: "全部",
    riskConservative: "保守型",
    riskBalanced: "均衡型",
    riskGrowth: "增长型",
    riskAggressive: "进取型",
    homeTitle: "客户一览",
    homeLead: "选择客户开始投资组合检视，或使用搜寻／进阶筛选。",
    exportReports: "导出报表",
    reportMaturity90: "未来3个月到期客户报表",
    reportFunds: "基金报表",
    reportEln90: "股票挂钩未来3个月到期",
    reportCsv: "下载 CSV",
    reportPdf: "列印／PDF",
    reportEmpty: "此报表暂无资料",
    reportGenerated: "报表已准备",
    colClient: "客户",
    fundInfo: "基金资料",
    fundCopyName: "复制名称",
    fundCopied: "已复制基金名称",
    fundNav: "最新 NAV",
    fundAsOf: "估值日",
    fundDiv: "最近派息",
    fundReport: "基金报告",
    fundReportUnavailable: "此基金暂无直连报告 PDF；已打开 Morningstar 搜寻（或请复制基金名称）",
    fundReportCopied: "已复制基金名称，可于 Morningstar／银行页搜寻",
    fundPortalNote: "基金资料经交行／环富通尽力更新。基金报告一律打开环富通 getFdDocList 的 PDF（不经交行同意页）；无 fdId／无 PDF 则改 Morningstar 搜寻。",

    moreMenu: "更多",
    downloadTemplate: "下载 Excel 范本",
    backupCases: "备份个案（JSON／ZIP）",
    toastBackup: "已下载个案备份",
    toastTemplate: "已下载 Excel 范本",
    toastImportedBatch: "已导入多个个案",
    syncHintTitle: "资料流：Notion → Excel → CSV／XLSX → 本页",
    syncHintNote: "基金 NAV／图表经环富通公开接口尽力显示，属第三方参考，非银行正式报价。",
    homeNearestMat: "最近到期",
    homeDays: "日",
    homeOpenOpps: "未完成机会",
    homeNoMaturity: "无近期到期",
    colNav: "最新 NAV",
    colMonthlyDiv: "月派息 %",
    colUnits: "持有单位",
    colFee: "费用",
    colPrincipalNet: "本金（扣费后）",
    fundChartTitle: "近1年价格",
    fundApiOk: "基金资料已更新（第三方参考）",
    fundApiFail: "基金 API 未能更新（显示本机／示范数值）",
    fundApiNone: "无 fdId，无法自动抓取 NAV／图表",
    fundTableTitle: "基金持仓",
    elnTableTitle: "股票挂钩票据（ELN）",
    depositTableTitle: "定期存款",
    colUnderlying: "挂钩标的",
    colStrike: "行使价 %",
    colRate: "利率 %",
    colStart: "起息日",
    colMaturity: "到期日",
    reportExcel: "下载 Excel",
    reportCsv: "下载 CSV",
    exportGroupCore: "核心报表",
    exportGroupMaturity: "到期／产品",
    exportGroupRisk: "风险／表现",
    exportGroupOther: "其他",
    reportSwap30: "Swap／保本高息 — 1个月内到期",
    reportSwap90: "Swap／保本高息 — 3个月内到期",
    reportSwap180: "Swap／保本高息 — 6个月内到期",
    reportDeposit: "定期存款到期报表",
    reportInsurance: "保险跟进报表",
    reportLosses: "亏损持仓（P&L < 0）",
    reportHighAum: "高 AUM／重点客户排名",
    reportPnlRank: "期间盈亏排名",
    reportConcentration: "产品集中度（超配）",
    reportFx: "外汇／货币敞口摘要",
    reportSingle: "单一产品持有人",
    reportSinglePick: "选择产品以列出持有人",
    reportOpps: "机会清单导出",
    advSegment: "客户层级",
    advCurrency: "货币",
    advPnlSign: "盈亏方向",
    advPnlProfit: "整体盈利",
    advPnlLoss: "整体亏损",
    advPnlHasLoss: "有亏损持仓",
    advHasOpp: "有跟进机会",
    advYes: "是",
    advNo: "否",
    advProductMix: "产品组合",
    advMixSingle: "单一产品",
    advMixMulti: "多元产品",
    advSort: "排序",
    advSortAumDesc: "AUM 高→低",
    advSortAumAsc: "AUM 低→高",
    advSortName: "客户名称",
    advSortPnl: "盈亏 % 高→低",
    advSortMaturity: "最近到期",
    colSegment: "层级",
    colWeight: "占比 %",
    total: "合计",
    clientBanner: "客户模式：已隐藏内部销售备注与 RM 专用提示",
    disclaimerThird: "交通银行香港基金页及环富通（ET Wealth）所显示之 NAV、派息、图表与基金文件均为第三方公开参考资料，并非本行正式报价或要约，可能延迟、不完整或与银行系统不一致；请以银行官方渠道及销售文件为准。",
  });


  function applyFundMap(cases) {
    (cases || []).forEach((c) => {
      (c.holdings || []).forEach((h) => {
        if (h.type !== "Fund") return;
        const resolved = window.PR_resolveFdId ? window.PR_resolveFdId(h) : "";
        if (resolved && !h.fdId) h.fdId = resolved;
        if (h.units == null && h.quantity != null) h.units = h.quantity;
        if (h.principal_after_fee == null && h.cost_value != null) {
          const fee =
            h.fee_amount != null
              ? Number(h.fee_amount)
              : h.fee_pct != null
                ? (Number(h.cost_value) * Number(h.fee_pct)) / 100
                : 0;
          h.principal_after_fee = Number(h.cost_value) - fee;
          if (h.fee_amount == null && fee) h.fee_amount = fee;
        }
      });
    });
    return cases;
  }

  function getDemoCases() {
    const src = window.PR_DEMO_CASES || [];
    return applyFundMap(JSON.parse(JSON.stringify(src)));
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
    viewMode: "home", // home | review | holders
    holdersProduct: null,
    advOpen: false,
    advFilters: {
      aumMin: null,
      aumMax: null,
      productType: "",
      risk: "",
      segment: "",
      currency: "",
      pnlSign: "",
      hasOpp: "",
      productMix: "",
      sort: "aum_desc",
      matFrom: "",
      matTo: "",
    },
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
        const ok =
          Array.isArray(parsed) &&
          parsed.length >= 2 &&
          parsed.some(
            (c) =>
              c.id === "demo-hong-yiu" &&
              (c.holdings || []).some(
                (h) => h.type === "swap" && h.maturity_date === "2027-01-05"
              )
          ) &&
          parsed.some(
            (c) =>
              c.id === "demo-chen" &&
              (c.holdings || []).some((h) => h.fdId === "ETNSI36463")
          ) &&
          parsed.some((c) => c.id === "demo-lau") &&
          parsed.some(
            (c) =>
              c.id === "demo-wei-min" &&
              (c.holdings || []).some((h) => h.type === "Fund" && h.units != null)
          ) &&
          parsed.some((c) => c.segment);
        if (ok) {
          state.cases = applyFundMap(parsed);
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
    if (state.advOpen) {
      populateAdvSelects();
      if (advFiltersActive() || (document.getElementById("globalSearch") || {}).value) {
        renderAdvResults();
      }
    }
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
    const cidEl = document.getElementById("coverClientId");
    if (cidEl) cidEl.textContent = c.client_id || "—";
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

  function isSwapType(ty) {
    return ty === "swap" || ty === "Swap";
  }

  function fundPrincipal(h) {
    if (h.principal_after_fee != null && !isNaN(h.principal_after_fee)) return Number(h.principal_after_fee);
    const cost = Number(h.cost_value) || 0;
    const fee =
      h.fee_amount != null
        ? Number(h.fee_amount)
        : h.fee_pct != null
          ? (cost * Number(h.fee_pct)) / 100
          : 0;
    return cost - fee;
  }

  function fundFeeLabel(h) {
    if (h.fee_amount != null && h.fee_pct != null) {
      return fmtMoneyFull(h.fee_amount) + " (" + Number(h.fee_pct).toFixed(2) + "%)";
    }
    if (h.fee_amount != null) return fmtMoneyFull(h.fee_amount);
    if (h.fee_pct != null) return Number(h.fee_pct).toFixed(2) + "%";
    return "—";
  }

  function renderFundHoldingsTable(list) {
    if (!list.length) return "";
    const head = `<thead><tr>
      <th>${t("colProduct")}</th>
      <th class="num">${t("colNav")}</th>
      <th class="num">${t("colMonthlyDiv")}</th>
      <th class="num">${t("colUnits")}</th>
      <th class="num">${t("colFee")}</th>
      <th class="num">${t("colPrincipalNet")}</th>
      <th class="num">${t("colMv")}</th>
      <th class="num">${t("colPnl")}</th>
      <th class="num">${t("colDay")}</th>
    </tr></thead>`;
    const body = list
      .map((h, idx) => {
        const fdId = h.fdId || (window.PR_resolveFdId ? window.PR_resolveFdId(h) : "") || "";
        const units = h.units != null ? h.units : h.quantity;
        const nav = h.nav;
        const div = h.monthly_div_pct;
        const actions = `<div>
            <button type="button" class="fund-link" data-fund-portal="${escapeHtml(h.product_name)}" data-fund-code="${escapeHtml(h.fund_code || "")}">${t("fundInfo")}</button>
            <button type="button" class="fund-link" data-fund-report="${escapeHtml(fdId)}" data-fund-report-name="${escapeHtml(h.product_name || "")}" data-fund-report-isin="${escapeHtml(h.isin || "")}" data-fund-report-code="${escapeHtml(h.fund_code || "")}">${t("fundReport")}</button>
            <button type="button" class="fund-copy" data-copy-fund="${escapeHtml(h.product_name)}">${t("fundCopyName")}</button>
          </div>
          <div class="fund-api-status" data-fund-status="${escapeHtml(fdId || "none")}">${fdId ? "…" : t("fundApiNone")}</div>`;
        const row = `<tr class="fund-main-row" data-fund-row="${idx}">
          <td><strong>${escapeHtml(h.product_name)}</strong>
            <div class="holding-sub">${escapeHtml(h.fund_code || "")}${h.isin ? " · " + escapeHtml(h.isin) : ""}${fdId ? " · " + escapeHtml(fdId) : ""}</div>
            ${actions}
          </td>
          <td class="num" data-fund-nav="${escapeHtml(fdId)}">${nav != null ? fmtMoneyFull(nav, "", 4) : "—"}</td>
          <td class="num" data-fund-div="${escapeHtml(fdId)}">${div != null ? fmtPct(div) : "—"}</td>
          <td class="num">${fmtMoneyFull(units)}</td>
          <td class="num" data-fund-fee="${escapeHtml(fdId)}">${fundFeeLabel(h)}</td>
          <td class="num">${fmtMoneyFull(fundPrincipal(h))}</td>
          <td class="num">${fmtMoneyFull(h.market_value)}</td>
          <td class="num ${pnlClass(h.pnl_value)}">${fmtMoneyFull(h.pnl_value)}<div class="holding-sub ${pnlClass(h.pnl_pct)}">${fmtPct(h.pnl_pct)}</div></td>
          <td class="num ${pnlClass(h.day_change_pct)}">${fmtPct(h.day_change_pct)}</td>
        </tr>
        <tr class="fund-chart-row"><td colspan="9">
          <div class="holding-sub">${t("fundChartTitle")}</div>
          <div class="fund-enrich-slot" data-fund-enrich="${escapeHtml(fdId)}" data-fund-enrich-name="${escapeHtml(h.product_name || "")}"></div>
        </td></tr>`;
        return row;
      })
      .join("");
    return `<h3 class="fund-table-heading">${t("fundTableTitle")}</h3><div class="table-wrap"><table class="holdings holdings-fund">${head}<tbody>${body}</tbody></table></div>`;
  }

  function renderElnHoldingsTable(list) {
    if (!list.length) return "";
    const head = `<thead><tr>
      <th>${t("colProduct")}</th>
      <th>${t("colUnderlying")}</th>
      <th class="num">${t("colStrike")}</th>
      <th>${t("colStart")}</th>
      <th>${t("colMaturity")}</th>
      <th class="num">${t("colCost")}</th>
      <th class="num">${t("colMv")}</th>
      <th class="num">${t("colPnlPct")}</th>
    </tr></thead>`;
    const body = list
      .map(
        (h) => `<tr>
        <td><strong>${escapeHtml(h.product_name)}</strong></td>
        <td>${escapeHtml(h.underlying || "—")}</td>
        <td class="num">${h.strike_pct != null ? fmtPct(h.strike_pct) : "—"}</td>
        <td>${escapeHtml(h.start_date || "—")}</td>
        <td>${escapeHtml(h.maturity_date || "—")}</td>
        <td class="num">${fmtMoneyFull(h.cost_value)}</td>
        <td class="num">${fmtMoneyFull(h.market_value)}</td>
        <td class="num ${pnlClass(h.pnl_pct)}">${fmtPct(h.pnl_pct)}</td>
      </tr>`
      )
      .join("");
    return `<h3 class="eln-table-heading">${t("elnTableTitle")}</h3><div class="table-wrap"><table class="holdings holdings-eln">${head}<tbody>${body}</tbody></table></div>`;
  }

  function renderDepositHoldingsTable(list) {
    if (!list.length) return "";
    const head = `<thead><tr>
      <th>${t("colProduct")}</th>
      <th class="num">${t("colRate")}</th>
      <th>${t("colStart")}</th>
      <th>${t("colMaturity")}</th>
      <th class="num">${t("colCost")}</th>
      <th class="num">${t("colMv")}</th>
      <th class="num">${t("colPnl")}</th>
    </tr></thead>`;
    const body = list
      .map(
        (h) => `<tr>
        <td><strong>${escapeHtml(h.product_name)}</strong></td>
        <td class="num">${h.interest_rate_pct != null ? fmtPct(h.interest_rate_pct) : "—"}</td>
        <td>${escapeHtml(h.start_date || "—")}</td>
        <td>${escapeHtml(h.maturity_date || "—")}</td>
        <td class="num">${fmtMoneyFull(h.cost_value, h.currency)}</td>
        <td class="num">${fmtMoneyFull(h.market_value, h.currency)}</td>
        <td class="num ${pnlClass(h.pnl_value)}">${fmtMoneyFull(h.pnl_value)}</td>
      </tr>`
      )
      .join("");
    return `<h3 class="deposit-table-heading">${t("depositTableTitle")}</h3><div class="table-wrap"><table class="holdings holdings-deposit">${head}<tbody>${body}</tbody></table></div>`;
  }

  function renderNormalHoldingsTable(list) {
    if (!list.length) return "";
    const head = `<thead><tr>
      <th data-sort="product_name">${t("colProduct")}<span class="sort-ind">↕</span></th>
      <th data-sort="type">${t("colType")}<span class="sort-ind">↕</span></th>
      <th data-sort="quantity" class="num">${t("colQty")}<span class="sort-ind">↕</span></th>
      <th data-sort="cost_value" class="num">${t("colCost")}<span class="sort-ind">↕</span></th>
      <th data-sort="market_value" class="num">${t("colMv")}<span class="sort-ind">↕</span></th>
      <th data-sort="pnl_value" class="num">${t("colPnl")}<span class="sort-ind">↕</span></th>
      <th data-sort="pnl_pct" class="num">${t("colPnlPct")}<span class="sort-ind">↕</span></th>
      <th data-sort="day_change_pct" class="num">${t("colDay")}<span class="sort-ind">↕</span></th>
    </tr></thead>`;
    const body = list
      .map((h) => {
        return `<tr>
          <td><strong>${escapeHtml(h.product_name)}</strong></td>
          <td><span class="type-badge type-${escapeHtml(h.type)}">${typeLabel(h.type)}</span></td>
          <td class="num">${fmtMoneyFull(h.quantity)}</td>
          <td class="num">${fmtMoneyFull(h.cost_value)}</td>
          <td class="num">${fmtMoneyFull(h.market_value)}</td>
          <td class="num ${pnlClass(h.pnl_value)}">${fmtMoneyFull(h.pnl_value)}</td>
          <td class="num ${pnlClass(h.pnl_pct)}">${fmtPct(h.pnl_pct)}</td>
          <td class="num ${pnlClass(h.day_change_pct)}">${fmtPct(h.day_change_pct)}</td>
        </tr>`;
      })
      .join("");
    return `<div class="table-wrap"><table class="holdings">${head}<tbody>${body}</tbody></table></div>`;
  }

  function renderSwapHoldingsTable(list) {
    if (!list.length) return "";
    const head = `<thead><tr>
      <th>${t("colSwapStart")}</th>
      <th>${t("colSwapMaturity")}</th>
      <th class="num">${t("colSwapPrincipal")}</th>
      <th class="num">${t("colSwapInterest")}</th>
      <th class="num">${t("colSwapRate")}</th>
      <th class="num">${t("colSwapMaturityAmt")}</th>
    </tr></thead>`;
    const body = list
      .map((h) => {
        const principal = h.usd_notional != null ? h.usd_notional : h.quantity;
        const interest = h.usd_gain != null ? h.usd_gain : h.usd_interest;
        const rate = h.expected_yield_pct;
        const matAmt = h.maturity_usd;
        return `<tr>
          <td>${escapeHtml(h.start_date || "—")}</td>
          <td>${escapeHtml(h.maturity_date || "—")}</td>
          <td class="num">${fmtMoneyFull(principal, "USD", 2)}</td>
          <td class="num pos">${fmtMoneyFull(interest, "USD", 2)}</td>
          <td class="num">${fmtPct(rate)}</td>
          <td class="num">${fmtMoneyFull(matAmt, "USD", 2)}</td>
        </tr>`;
      })
      .join("");
    const title =
      list.length && state.typeFilter === "all"
        ? `<h3 class="swap-table-heading">${t("swapTableTitle")}</h3>`
        : "";
    return `${title}<div class="table-wrap"><table class="holdings holdings-swap">${head}<tbody>${body}</tbody></table></div>`;
  }

  function wireFundButtons(wrap) {
    wrap.querySelectorAll("[data-fund-portal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.open(BOCOM_FUND_PORTAL, "_blank", "noopener");
      });
    });
    wrap.querySelectorAll("[data-fund-report]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openFundReport({
          fdId: btn.getAttribute("data-fund-report") || "",
          name: btn.getAttribute("data-fund-report-name") || "",
          isin: btn.getAttribute("data-fund-report-isin") || "",
          fundCode: btn.getAttribute("data-fund-report-code") || "",
        });
      });
    });
    wrap.querySelectorAll("[data-copy-fund]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const name = btn.getAttribute("data-copy-fund");
        try {
          await navigator.clipboard.writeText(name);
          toast(t("fundCopied"));
        } catch (e) {
          toast(name);
        }
      });
    });
  }

  function renderHoldings(c) {
    const list = filteredHoldings(c);
    const wrap = document.getElementById("holdingsTables");
    const funds = list.filter((h) => h.type === "Fund");
    const swaps = list.filter((h) => isSwapType(h.type));
    const elns = list.filter((h) => h.type === "ELN");
    const deposits = list.filter((h) => h.type === "Deposit");
    const others = list.filter(
      (h) => h.type !== "Fund" && !isSwapType(h.type) && h.type !== "ELN" && h.type !== "Deposit"
    );
    let html = "";
    if (funds.length) html += renderFundHoldingsTable(funds);
    if (elns.length) html += renderElnHoldingsTable(elns);
    if (deposits.length) html += renderDepositHoldingsTable(deposits);
    if (swaps.length) html += renderSwapHoldingsTable(swaps);
    if (others.length) html += renderNormalHoldingsTable(others);
    if (!html) html = `<p style="color:var(--muted);font-size:13px">${t("searchEmpty")}</p>`;
    wrap.innerHTML = html;
    wrap.querySelectorAll("th[data-sort]").forEach((th) => {
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
    wireFundButtons(wrap);
    enrichFundCells();
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


  function reportAsOfDate() {
    return "2026-10-10"; // demo clock aligned with review_date
  }

  function addDaysISO(iso, days) {
    const d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function goHome() {
    state.viewMode = "home";
    state.holdersProduct = null;
    state.advOpen = false;
    state.typeFilter = "all";
    document.getElementById("exportMenu")?.classList.add("hidden");
    document.getElementById("btnExportMenu")?.classList.remove("active-toggle");
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openClientReview(caseId) {
    state.currentId = caseId;
    state.typeFilter = "all";
    state.viewMode = "review";
    state.holdersProduct = null;
    renderAll();
    document.getElementById("sec-cover")?.scrollIntoView({ behavior: "smooth" });
  }

  function daysUntil(iso) {
    if (!iso) return null;
    const a = reportAsOfDate();
    const t0 = Date.parse(a + "T00:00:00");
    const t1 = Date.parse(iso + "T00:00:00");
    if (isNaN(t0) || isNaN(t1)) return null;
    return Math.round((t1 - t0) / 86400000);
  }

  function openOppCount(c) {
    return (c.opportunities || []).filter((o) => !o.done).length;
  }

  function renderHome() {
    const el = document.getElementById("homeClientList");
    if (!el) return;
    const list = state.cases.slice().sort((a, b) => caseAum(b) - caseAum(a));
    el.innerHTML = list
      .map((c) => {
        const aum = caseAum(c);
        const mats = caseMaturities(c);
        const nearest = mats[0];
        const dLeft = daysUntil(nearest);
        const opps = openOppCount(c);
        const types = [
          ...new Set((c.holdings || []).map((h) => (h.type === "Swap" ? "swap" : h.type))),
        ]
          .map(typeLabel)
          .join(" · ");
        const matPill =
          dLeft == null
            ? `<span class="home-stat-pill">${t("homeNoMaturity")}</span>`
            : `<span class="home-stat-pill ${dLeft <= 90 ? "warn" : "ok"}">${t("homeNearestMat")}: ${dLeft}${t("homeDays")} (${nearest})</span>`;
        const oppPill = `<span class="home-stat-pill ${opps ? "warn" : ""}">${t("homeOpenOpps")}: ${opps}</span>`;
        return `<button type="button" class="adv-client-card" data-home-case="${escapeHtml(c.id)}">
          <div>
            <strong>${escapeHtml(clientDisplayName(c))}</strong>
            <div class="meta">
              <span>${escapeHtml(c.client_id || "")}</span>
              <span>${riskLabel(c.risk_profile)}</span>
              <span>${escapeHtml(c.segment || "")}</span>
              <span>AUM ${fmtMoneyFull(aum, c.currency || "HKD")}</span>
              <span class="${pnlClass(casePnl(c).pnl)}">${fmtPct(casePnl(c).pnlPct)}</span>
              <span>${escapeHtml(types)}</span>
            </div>
            <div class="home-stat-pills">${matPill}${oppPill}</div>
          </div>
          <span class="btn-link">${t("openReview")}</span>
        </button>`;
      })
      .join("");
    el.querySelectorAll("[data-home-case]").forEach((btn) => {
      btn.addEventListener("click", () => openClientReview(btn.getAttribute("data-home-case")));
    });
  }

  function collectMaturityRows(withinDays, typeFilterFn) {
    const start = reportAsOfDate();
    const end = addDaysISO(start, withinDays);
    const rows = [];
    state.cases.forEach((c) => {
      (c.holdings || []).forEach((h) => {
        if (!h.maturity_date) return;
        if (h.maturity_date < start || h.maturity_date > end) return;
        if (typeFilterFn && !typeFilterFn(h)) return;
        rows.push({
          client: clientDisplayName(c),
          client_id: c.client_id || "",
          product: h.product_name,
          type: h.type,
          start: h.start_date || "",
          maturity: h.maturity_date,
          quantity: h.quantity,
          usd_notional: h.usd_notional,
          expected_yield_pct: h.expected_yield_pct,
          cost_value: h.cost_value,
          market_value: h.market_value,
          pnl_value: h.pnl_value,
          pnl_pct: h.pnl_pct,
          currency: h.currency || c.currency || "HKD",
        });
      });
    });
    rows.sort((a, b) => a.maturity.localeCompare(b.maturity) || a.client.localeCompare(b.client));
    return rows;
  }

  function collectFundRows() {
    const rows = [];
    state.cases.forEach((c) => {
      (c.holdings || []).forEach((h) => {
        if (h.type !== "Fund") return;
        rows.push({
          client: clientDisplayName(c),
          client_id: c.client_id || "",
          product: h.product_name,
          fund_code: h.fund_code || "",
          fdId: h.fdId || "",
          quantity: h.quantity,
          cost_value: h.cost_value,
          market_value: h.market_value,
          pnl_value: h.pnl_value,
          pnl_pct: h.pnl_pct,
          currency: h.currency || "HKD",
        });
      });
    });
    rows.sort((a, b) => a.client.localeCompare(b.client) || a.product.localeCompare(b.product));
    return rows;
  }

  function csvEscape(v) {
    const s = v == null ? "" : String(v);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  function downloadCsv(filename, headers, rows) {
    const lines = [headers.join(",")];
    rows.forEach((r) => lines.push(r.map(csvEscape).join(",")));
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }


  function downloadXlsx(filename, headers, rows, sheetName) {
    if (typeof XLSX === "undefined") {
      downloadCsv(String(filename).replace(/\.xlsx$/i, ".csv"), headers, rows);
      return;
    }
    const aoa = [headers].concat(rows.map((r) => r.map((c) => (c == null ? "" : c))));
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, String(sheetName || "Report").slice(0, 31));
    let outName = String(filename || "report.xlsx");
    outName = outName.replace(/\.csv$/i, ".xlsx");
    if (!/\.xlsx$/i.test(outName)) outName += ".xlsx";
    XLSX.writeFile(wb, outName);
  }

  function buildReport(kind) {
    const simpleTable = (title, filename, headers, rows, mapCsv, mapHtml, headHtml) => ({
      title,
      filename,
      headers,
      csvRows: rows.map(mapCsv),
      htmlRows: rows.map(mapHtml),
      tableHead: headHtml,
    });

    if (kind === "maturity90") {
      const rows = collectMaturityRows(90, null);
      return simpleTable(
        t("reportMaturity90"),
        "maturities-90d.csv",
        [t("colClient"), "ID", t("colProduct"), t("colType"), t("colSwapMaturity"), t("colMv"), t("colPnl"), t("currency")],
        rows,
        (r) => [r.client, r.client_id, r.product, typeLabel(r.type), r.maturity, r.market_value, r.pnl_value, r.currency],
        (r) =>
          `<tr><td>${escapeHtml(r.client)}</td><td>${escapeHtml(r.product)}</td><td>${typeLabel(r.type)}</td><td>${r.maturity}</td><td class="num">${fmtMoneyFull(r.market_value)}</td><td class="num">${fmtMoneyFull(r.pnl_value)}</td></tr>`,
        `<tr><th>${t("colClient")}</th><th>${t("colProduct")}</th><th>${t("colType")}</th><th>${t("colSwapMaturity")}</th><th>${t("colMv")}</th><th>${t("colPnl")}</th></tr>`
      );
    }
    if (kind === "funds") {
      const rows = collectFundRows();
      return simpleTable(
        t("reportFunds"),
        "funds-report.csv",
        [t("colClient"), t("colProduct"), "Fund code", t("colQty"), t("colCost"), t("colMv"), t("colPnl"), t("colPnlPct")],
        rows,
        (r) => [r.client, r.product, r.fund_code, r.quantity, r.cost_value, r.market_value, r.pnl_value, r.pnl_pct],
        (r) =>
          `<tr><td>${escapeHtml(r.client)}</td><td>${escapeHtml(r.product)}</td><td>${escapeHtml(r.fund_code)}</td><td class="num">${fmtMoneyFull(r.quantity)}</td><td class="num">${fmtMoneyFull(r.cost_value)}</td><td class="num">${fmtMoneyFull(r.market_value)}</td><td class="num">${fmtMoneyFull(r.pnl_value)}</td><td class="num">${fmtPct(r.pnl_pct)}</td></tr>`,
        `<tr><th>${t("colClient")}</th><th>${t("colProduct")}</th><th>Code</th><th>${t("colQty")}</th><th>${t("colCost")}</th><th>${t("colMv")}</th><th>${t("colPnl")}</th><th>${t("colPnlPct")}</th></tr>`
      );
    }
    if (kind === "eln90") {
      const rows = collectMaturityRows(90, (h) => h.type === "ELN" || h.type === "ELI");
      return simpleTable(
        t("reportEln90"),
        "eln-maturities-90d.csv",
        [t("colClient"), t("colProduct"), t("colSwapMaturity"), t("colMv"), t("colPnl"), t("currency")],
        rows,
        (r) => [r.client, r.product, r.maturity, r.market_value, r.pnl_value, r.currency],
        (r) =>
          `<tr><td>${escapeHtml(r.client)}</td><td>${escapeHtml(r.product)}</td><td>${r.maturity}</td><td class="num">${fmtMoneyFull(r.market_value)}</td><td class="num">${fmtMoneyFull(r.pnl_value)}</td></tr>`,
        `<tr><th>${t("colClient")}</th><th>${t("colProduct")}</th><th>${t("colSwapMaturity")}</th><th>${t("colMv")}</th><th>${t("colPnl")}</th></tr>`
      );
    }

    const swapPred = (h) => h.type === "swap" || h.type === "Swap";
    if (kind === "swap30" || kind === "swap90" || kind === "swap180") {
      const days = kind === "swap30" ? 30 : kind === "swap90" ? 90 : 180;
      const titleKey = kind === "swap30" ? "reportSwap30" : kind === "swap90" ? "reportSwap90" : "reportSwap180";
      const rows = collectMaturityRows(days, swapPred);
      return simpleTable(
        t(titleKey),
        `swap-maturities-${days}d.csv`,
        [t("colClient"), t("colProduct"), t("colSwapStart"), t("colSwapMaturity"), t("colSwapPrincipal"), t("colMv"), t("colSwapRate")],
        rows,
        (r) => [r.client, r.product, r.start || "", r.maturity, r.usd_notional || r.quantity, r.market_value, r.expected_yield_pct],
        (r) =>
          `<tr><td>${escapeHtml(r.client)}</td><td>${escapeHtml(r.product)}</td><td>${r.maturity}</td><td class="num">${fmtMoneyFull(r.market_value)}</td></tr>`,
        `<tr><th>${t("colClient")}</th><th>${t("colProduct")}</th><th>${t("colSwapMaturity")}</th><th>${t("colMv")}</th></tr>`
      );
    }

    if (kind === "depositMat") {
      const rows = collectMaturityRows(180, (h) => h.type === "Deposit");
      return simpleTable(
        t("reportDeposit"),
        "deposit-maturities.csv",
        [t("colClient"), t("colProduct"), t("colSwapMaturity"), t("colMv"), t("currency")],
        rows,
        (r) => [r.client, r.product, r.maturity, r.market_value, r.currency],
        (r) =>
          `<tr><td>${escapeHtml(r.client)}</td><td>${escapeHtml(r.product)}</td><td>${r.maturity}</td><td class="num">${fmtMoneyFull(r.market_value)}</td><td>${r.currency}</td></tr>`,
        `<tr><th>${t("colClient")}</th><th>${t("colProduct")}</th><th>${t("colSwapMaturity")}</th><th>${t("colMv")}</th><th>${t("currency")}</th></tr>`
      );
    }

    if (kind === "insurance") {
      const rows = [];
      state.cases.forEach((c) => {
        (c.holdings || [])
          .filter((h) => h.type === "Insurance")
          .forEach((h) => {
            const related = (c.opportunities || []).filter(
              (o) => o.category === "Insurance Gap" || /保險|寿险|壽險|insurance/i.test(o.title || "")
            );
            rows.push({
              client: clientDisplayName(c),
              product: h.product_name,
              market_value: h.market_value,
              pnl_value: h.pnl_value,
              opp: related.map((o) => o.title).join("；") || "—",
              due: related.map((o) => o.due_date).filter(Boolean).join(", ") || "—",
            });
          });
      });
      return simpleTable(
        t("reportInsurance"),
        "insurance-followup.csv",
        [t("colClient"), t("colProduct"), t("colMv"), t("colPnl"), t("oppTitle"), t("colSwapMaturity")],
        rows,
        (r) => [r.client, r.product, r.market_value, r.pnl_value, r.opp, r.due],
        (r) =>
          `<tr><td>${escapeHtml(r.client)}</td><td>${escapeHtml(r.product)}</td><td class="num">${fmtMoneyFull(r.market_value)}</td><td>${escapeHtml(r.opp)}</td><td>${escapeHtml(r.due)}</td></tr>`,
        `<tr><th>${t("colClient")}</th><th>${t("colProduct")}</th><th>${t("colMv")}</th><th>${t("oppTitle")}</th><th>${t("advNextMaturity")}</th></tr>`
      );
    }

    if (kind === "losses") {
      const rows = [];
      state.cases.forEach((c) => {
        (c.holdings || [])
          .filter((h) => (Number(h.pnl_value) || 0) < 0)
          .forEach((h) => {
            rows.push({
              client: clientDisplayName(c),
              product: h.product_name,
              type: h.type,
              cost_value: h.cost_value,
              market_value: h.market_value,
              pnl_value: h.pnl_value,
              pnl_pct: h.pnl_pct,
            });
          });
      });
      rows.sort((a, b) => a.pnl_value - b.pnl_value);
      return simpleTable(
        t("reportLosses"),
        "loss-holdings.csv",
        [t("colClient"), t("colProduct"), t("colType"), t("colCost"), t("colMv"), t("colPnl"), t("colPnlPct")],
        rows,
        (r) => [r.client, r.product, typeLabel(r.type), r.cost_value, r.market_value, r.pnl_value, r.pnl_pct],
        (r) =>
          `<tr><td>${escapeHtml(r.client)}</td><td>${escapeHtml(r.product)}</td><td>${typeLabel(r.type)}</td><td class="num">${fmtMoneyFull(r.cost_value)}</td><td class="num">${fmtMoneyFull(r.market_value)}</td><td class="num neg">${fmtMoneyFull(r.pnl_value)}</td><td class="num neg">${fmtPct(r.pnl_pct)}</td></tr>`,
        `<tr><th>${t("colClient")}</th><th>${t("colProduct")}</th><th>${t("colType")}</th><th>${t("colCost")}</th><th>${t("colMv")}</th><th>${t("colPnl")}</th><th>${t("colPnlPct")}</th></tr>`
      );
    }

    if (kind === "highAum") {
      const rows = state.cases
        .map((c) => ({
          client: clientDisplayName(c),
          client_id: c.client_id || "",
          segment: c.segment || "",
          aum: caseAum(c),
          pnlPct: casePnl(c).pnlPct,
          holdings: (c.holdings || []).length,
        }))
        .sort((a, b) => b.aum - a.aum);
      return simpleTable(
        t("reportHighAum"),
        "high-aum-clients.csv",
        [t("colClient"), "ID", t("colSegment"), "AUM", t("colPnlPct"), t("holdingCount")],
        rows,
        (r) => [r.client, r.client_id, r.segment, r.aum, r.pnlPct, r.holdings],
        (r) =>
          `<tr><td>${escapeHtml(r.client)}</td><td>${escapeHtml(r.segment)}</td><td class="num">${fmtMoneyFull(r.aum)}</td><td class="num ${pnlClass(r.pnlPct)}">${fmtPct(r.pnlPct)}</td><td class="num">${r.holdings}</td></tr>`,
        `<tr><th>${t("colClient")}</th><th>${t("colSegment")}</th><th>AUM</th><th>${t("colPnlPct")}</th><th>${t("holdingCount")}</th></tr>`
      );
    }

    if (kind === "pnlRank") {
      const clientRows = state.cases
        .map((c) => {
          const p = casePnl(c);
          return { level: "client", name: clientDisplayName(c), product: "—", pnl: p.pnl, pnlPct: p.pnlPct };
        })
        .sort((a, b) => b.pnlPct - a.pnlPct);
      const prodRows = [];
      state.cases.forEach((c) => {
        (c.holdings || []).forEach((h) => {
          prodRows.push({
            level: "product",
            name: clientDisplayName(c),
            product: h.product_name,
            pnl: h.pnl_value,
            pnlPct: h.pnl_pct,
          });
        });
      });
      prodRows.sort((a, b) => (b.pnlPct || 0) - (a.pnlPct || 0));
      const rows = clientRows.concat(prodRows.slice(0, 25));
      return simpleTable(
        t("reportPnlRank"),
        "pnl-ranking.csv",
        ["Level", t("colClient"), t("colProduct"), t("colPnl"), t("colPnlPct")],
        rows,
        (r) => [r.level, r.name, r.product, r.pnl, r.pnlPct],
        (r) =>
          `<tr><td>${r.level}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.product)}</td><td class="num ${pnlClass(r.pnl)}">${fmtMoneyFull(r.pnl)}</td><td class="num ${pnlClass(r.pnlPct)}">${fmtPct(r.pnlPct)}</td></tr>`,
        `<tr><th>Level</th><th>${t("colClient")}</th><th>${t("colProduct")}</th><th>${t("colPnl")}</th><th>${t("colPnlPct")}</th></tr>`
      );
    }

    if (kind === "concentration") {
      const rows = [];
      state.cases.forEach((c) => {
        const aum = caseAum(c) || 1;
        const byType = {};
        (c.holdings || []).forEach((h) => {
          const ty = h.type === "Swap" ? "swap" : h.type;
          byType[ty] = (byType[ty] || 0) + (Number(h.market_value) || 0);
        });
        Object.keys(byType).forEach((ty) => {
          const w = (byType[ty] / aum) * 100;
          if (w >= 35) {
            rows.push({
              client: clientDisplayName(c),
              type: ty,
              weight: w,
              value: byType[ty],
            });
          }
        });
      });
      rows.sort((a, b) => b.weight - a.weight);
      return simpleTable(
        t("reportConcentration"),
        "concentration-overweight.csv",
        [t("colClient"), t("colType"), t("colWeight"), t("colMv")],
        rows,
        (r) => [r.client, typeLabel(r.type), r.weight.toFixed(2), r.value],
        (r) =>
          `<tr><td>${escapeHtml(r.client)}</td><td>${typeLabel(r.type)}</td><td class="num">${r.weight.toFixed(1)}%</td><td class="num">${fmtMoneyFull(r.value)}</td></tr>`,
        `<tr><th>${t("colClient")}</th><th>${t("colType")}</th><th>${t("colWeight")}</th><th>${t("colMv")}</th></tr>`
      );
    }

    if (kind === "fxExposure") {
      const rows = [];
      state.cases.forEach((c) => {
        const byCcy = {};
        (c.holdings || []).forEach((h) => {
          const ccy = h.currency || c.currency || "HKD";
          byCcy[ccy] = (byCcy[ccy] || 0) + (Number(h.market_value) || 0);
        });
        const aum = caseAum(c) || 1;
        Object.keys(byCcy).forEach((ccy) => {
          rows.push({
            client: clientDisplayName(c),
            currency: ccy,
            value: byCcy[ccy],
            weight: (byCcy[ccy] / aum) * 100,
            isFx: ccy !== "HKD" || (c.holdings || []).some((h) => h.type === "FX"),
          });
        });
      });
      rows.sort((a, b) => b.value - a.value);
      return simpleTable(
        t("reportFx"),
        "fx-currency-exposure.csv",
        [t("colClient"), t("currency"), t("colMv"), t("colWeight")],
        rows,
        (r) => [r.client, r.currency, r.value, r.weight.toFixed(2)],
        (r) =>
          `<tr><td>${escapeHtml(r.client)}</td><td>${r.currency}</td><td class="num">${fmtMoneyFull(r.value)}</td><td class="num">${r.weight.toFixed(1)}%</td></tr>`,
        `<tr><th>${t("colClient")}</th><th>${t("currency")}</th><th>${t("colMv")}</th><th>${t("colWeight")}</th></tr>`
      );
    }

    if (kind === "singleProduct") {
      // rows filled after product pick — placeholder empty triggers picker
      return { needsProductPick: true };
    }

    if (kind === "singleProductRun") {
      const product = state._singleProductName;
      const rows = [];
      state.cases.forEach((c) => {
        (c.holdings || [])
          .filter((h) => h.product_name === product)
          .forEach((h) => {
            rows.push({
              client: clientDisplayName(c),
              product: h.product_name,
              type: h.type,
              quantity: h.quantity,
              market_value: h.market_value,
              pnl_pct: h.pnl_pct,
            });
          });
      });
      // Also include clients whose ONLY holding is this product
      return simpleTable(
        t("reportSingle") + " — " + product,
        "single-product-holders.csv",
        [t("colClient"), t("colProduct"), t("colType"), t("colQty"), t("colMv"), t("colPnlPct")],
        rows,
        (r) => [r.client, r.product, typeLabel(r.type), r.quantity, r.market_value, r.pnl_pct],
        (r) =>
          `<tr><td>${escapeHtml(r.client)}</td><td>${escapeHtml(r.product)}</td><td>${typeLabel(r.type)}</td><td class="num">${fmtMoneyFull(r.quantity)}</td><td class="num">${fmtMoneyFull(r.market_value)}</td><td class="num">${fmtPct(r.pnl_pct)}</td></tr>`,
        `<tr><th>${t("colClient")}</th><th>${t("colProduct")}</th><th>${t("colType")}</th><th>${t("colQty")}</th><th>${t("colMv")}</th><th>${t("colPnlPct")}</th></tr>`
      );
    }

    if (kind === "opportunities") {
      const rows = [];
      state.cases.forEach((c) => {
        (c.opportunities || []).forEach((o) => {
          rows.push({
            client: clientDisplayName(c),
            title: o.title,
            category: o.category,
            priority: o.priority,
            due_date: o.due_date || "",
            amount: o.amount,
            done: o.done ? "Y" : "N",
            talking: o.talking_point || "",
            hide: o.hide_in_client_mode ? "RM" : "",
          });
        });
      });
      rows.sort((a, b) => (a.due_date || "9999").localeCompare(b.due_date || "9999"));
      return simpleTable(
        t("reportOpps"),
        "opportunities.csv",
        [t("colClient"), "Title", "Category", "Priority", "Due", "Amount", "Done", "Talking point"],
        rows,
        (r) => [r.client, r.title, r.category, r.priority, r.due_date, r.amount, r.done, r.talking],
        (r) =>
          `<tr><td>${escapeHtml(r.client)}</td><td>${escapeHtml(r.title)}</td><td>${escapeHtml(r.category || "")}</td><td>${escapeHtml(r.priority || "")}</td><td>${escapeHtml(r.due_date)}</td><td class="num">${r.amount != null ? fmtMoneyFull(r.amount) : "—"}</td><td>${r.done}</td></tr>`,
        `<tr><th>${t("colClient")}</th><th>Title</th><th>Category</th><th>Priority</th><th>Due</th><th>Amount</th><th>Done</th></tr>`
      );
    }

    return null;
  }

  function showReportPrint(report) {
    let root = document.getElementById("reportPrintRoot");
    if (!root) {
      root = document.createElement("div");
      root.id = "reportPrintRoot";
      root.className = "report-print-root";
      document.body.appendChild(root);
    }
    root.innerHTML = `<div class="report-sheet section">
      <h1>${escapeHtml(report.title)}</h1>
      <div class="meta">As of ${reportAsOfDate()} · RM Mose Lee · Portfolio Review</div>
      <div class="table-wrap"><table class="holdings"><thead>${report.tableHead}</thead><tbody>${
      report.htmlRows.join("") || `<tr><td colspan="8">${t("reportEmpty")}</td></tr>`
    }</tbody></table></div>
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap" class="no-print-actions">
        <button type="button" class="btn btn-gold" id="btnReportPdf">${t("reportPdf")}</button>
        <button type="button" class="btn btn-gold" id="btnReportXlsx">${t("reportExcel")}</button>
        <button type="button" class="btn btn-outline" id="btnReportCsv">${t("reportCsv")}</button>
      </div>
    </div>`;
    root.classList.add("print-active");
    root.style.display = "block";
    document.getElementById("btnReportPdf").onclick = () => {
      document.body.classList.add("printing-report");
      window.print();
      setTimeout(() => document.body.classList.remove("printing-report"), 500);
    };
    document.getElementById("btnReportCsv").onclick = () => {
      if (!report.csvRows.length) {
        toast(t("reportEmpty"));
        return;
      }
      downloadCsv(report.filename, report.headers, report.csvRows);
    };
    document.getElementById("btnReportXlsx").onclick = () => {
      if (!report.csvRows.length) {
        toast(t("reportEmpty"));
        return;
      }
      downloadXlsx(report.filename, report.headers, report.csvRows, report.title || "Report");
    };
    root.scrollIntoView({ behavior: "smooth", block: "start" });
    toast(t("reportGenerated"));
  }

  function openSingleProductPicker() {
    const products = new Map();
    state.cases.forEach((c) => {
      (c.holdings || []).forEach((h) => {
        if (!h.product_name) return;
        products.set(h.product_name, (products.get(h.product_name) || 0) + 1);
      });
    });
    const sel = document.getElementById("singleProductSelect");
    const modal = document.getElementById("singleProductPicker");
    if (!sel || !modal) {
      // fallback: first product with 2+ holders or any
      const sorted = [...products.entries()].sort((a, b) => b[1] - a[1]);
      state._singleProductName = sorted[0] && sorted[0][0];
      const report = buildReport("singleProductRun");
      if (report) showReportPrint(report);
      return;
    }
    sel.innerHTML = [...products.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], "zh"))
      .map(([name, n]) => `<option value="${escapeHtml(name)}">${escapeHtml(name)} (${n})</option>`)
      .join("");
    modal.classList.remove("hidden");
    applyI18n();
  }

  function runExportReport(kind) {
    document.getElementById("exportMenu")?.classList.add("hidden");
    document.getElementById("btnExportMenu")?.classList.remove("active-toggle");
    if (kind === "singleProduct") {
      openSingleProductPicker();
      return;
    }
    const report = buildReport(kind);
    if (!report) return;
    if (report.needsProductPick) {
      openSingleProductPicker();
      return;
    }
    showReportPrint(report);
  }

  async function fetchFundSummary(fdId) {
    if (!fdId) return null;
    if (fundEnrichCache[fdId]) return fundEnrichCache[fdId];
    try {
      const url = `${ETWEALTH_BASE}/getFdSummary?fdId=${encodeURIComponent(fdId)}&lang=zh_TW`;
      const res = await fetch(url, { method: "GET", mode: "cors" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const row = Array.isArray(data) ? data[0] : data;
      fundEnrichCache[fdId] = row;
      return row;
    } catch (e) {
      fundEnrichCache[fdId] = null;
      return null;
    }
  }

  async function fetchFundDiv(fdId) {
    try {
      const url = `${ETWEALTH_BASE}/getDivHistory?fdId=${encodeURIComponent(fdId)}&lang=zh_TW`;
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || data === "NO_DATA_FOUND") return null;
      const arr = Array.isArray(data) ? data : data.list || [];
      return arr[0] || null;
    } catch (e) {
      return null;
    }
  }

  async function fetchFundSpark(fdId) {
    try {
      const url = `${ETWEALTH_BASE}/getPriceChartData?fdId=${encodeURIComponent(
        fdId
      )}&jsArray=true&period=12&lang=zh_TW`;
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data) ? data.slice(-30) : null;
    } catch (e) {
      return null;
    }
  }

  async function fetchFundDocList(fdId) {
    if (!fdId) return [];
    if (Object.prototype.hasOwnProperty.call(fundDocCache, fdId)) return fundDocCache[fdId];
    try {
      const url = `${ETWEALTH_BASE}/getFdDocList?fdId=${encodeURIComponent(fdId)}&lang=zh_TW`;
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      fundDocCache[fdId] = list;
      return list;
    } catch (e) {
      fundDocCache[fdId] = [];
      return [];
    }
  }

  function absolutizeDocUrl(doc) {
    if (!doc || !doc.url) return null;
    const u = String(doc.url);
    if (/^https?:\/\//i.test(u)) return u.replace(/^http:\/\//i, "https://");
    let prefix = doc.urlPrefix || "https://www02.etwealth.com/wms_chart/fd_sheet/";
    prefix = prefix.replace(/^http:\/\//i, "https://");
    if (!prefix.endsWith("/")) prefix += "/";
    return prefix + u.replace(/^\//, "");
  }

  function pickBestFundReportPdf(docs) {
    if (!docs || !docs.length) return null;
    const seen = new Set();
    const uniq = [];
    docs.forEach((d) => {
      const key = (d.sheetName || "") + "|" + (d.url || "");
      if (seen.has(key)) return;
      seen.add(key);
      uniq.push(d);
    });
    const preferLang = (d) => {
      const u = (d.url || "") + "|" + (d.urlPrefix || "");
      if (/zh_TW|zh-TW|zh_HK|\btc\b/i.test(u)) return 0;
      if (/zh_CN|\bsc\b/i.test(u)) return 1;
      return 2;
    };
    const typeRank = (name) => {
      const n = String(name || "").toUpperCase();
      if (/FUND_REPORT|基金報告|基金报告/.test(n)) return 0;
      if (n === "ANNUAL_REPORT" || /ANNUAL/.test(n)) return 1;
      if (n === "INTERIM" || /INTERIM|中期/.test(n)) return 2;
      if (n === "FACT_SHEET" || /FACT/.test(n)) return 3;
      if (n === "KFS") return 4;
      if (n === "PROSPECTUS") return 5;
      return 9;
    };
    uniq.sort((a, b) => {
      const tr = typeRank(a.sheetName) - typeRank(b.sheetName);
      if (tr) return tr;
      const lr = preferLang(a) - preferLang(b);
      if (lr) return lr;
      return String(b.asOfDate || "").localeCompare(String(a.asOfDate || ""));
    });
    const best = uniq[0];
    const href = absolutizeDocUrl(best);
    if (!href) return null;
    return { href, sheetName: best.sheetName, asOfDate: best.asOfDate };
  }

  function morningstarSearchUrl(meta) {
    const q = (meta && (meta.isin || meta.name || meta.fundCode)) || "";
    const term = String(q).trim();
    if (!term) return null;
    // Prefer Morningstar.com search (HK site redirects / may wall); open in new tab for user browser.
    return "https://www.morningstar.com/search?query=" + encodeURIComponent(term);
  }

  function navigateOrOpen(win, href) {
    if (!href) return false;
    if (win && !win.closed) {
      try {
        win.location.href = href;
        return true;
      } catch (e) {
        /* fall through */
      }
    }
    window.open(href, "_blank", "noopener");
    return true;
  }

  async function openFundReport(meta) {
    // Never send 基金報告 to the BOCOM agree/disclaimer wall.
    const fdId = typeof meta === "string" ? meta : (meta && meta.fdId) || "";
    const info = typeof meta === "object" && meta ? meta : { fdId };
    // Open blank tab synchronously so the PDF survives async fetch / popup blockers.
    let win = null;
    try {
      win = window.open("about:blank", "_blank");
    } catch (e) {
      win = null;
    }

    async function fallbackNoPdf() {
      const ms = morningstarSearchUrl(info);
      if (ms) {
        toast(t("fundReportUnavailable"));
        navigateOrOpen(win, ms);
        return;
      }
      if (win && !win.closed) {
        try {
          win.close();
        } catch (e) {}
      }
      const name = info.name || info.fundCode || "";
      if (name) {
        try {
          await navigator.clipboard.writeText(name);
          toast(t("fundReportCopied"));
        } catch (e) {
          toast(t("fundReportUnavailable") + (name ? ": " + name : ""));
        }
      } else {
        toast(t("fundReportUnavailable"));
      }
    }

    if (fdId) {
      const docs = await fetchFundDocList(fdId);
      const best = pickBestFundReportPdf(docs);
      if (best && best.href && /\.pdf($|\?)/i.test(best.href)) {
        navigateOrOpen(win, best.href);
        return;
      }
      if (best && best.href) {
        // Still prefer ET Wealth doc URL even if extension not .pdf
        navigateOrOpen(win, best.href);
        return;
      }
      const summary = await fetchFundSummary(fdId);
      if (summary) {
        let prefix = summary.urlPrefix || "https://www02.etwealth.com/wms_chart/fd_sheet/";
        prefix = String(prefix).replace(/^http:\/\//i, "https://");
        if (!prefix.endsWith("/")) prefix += "/";
        for (const key of ["annualReport", "factSheet", "interimReport", "kfs", "prospectus"]) {
          const rel = summary[key];
          if (!rel) continue;
          const href = /^https?:\/\//i.test(rel)
            ? String(rel).replace(/^http:\/\//i, "https://")
            : prefix + String(rel).replace(/^\//, "");
          // Only accept PDF-like document paths — never bank portal HTML
          if (/bankcomm\.com|disclaimer|agree/i.test(href)) continue;
          navigateOrOpen(win, href);
          return;
        }
      }
    }
    await fallbackNoPdf();
  }


  function sparkSvg(points, w, h) {
    if (!points || points.length < 2) return "";
    const vals = points.map((p) => Number(p[1])).filter((n) => !isNaN(n));
    if (vals.length < 2) return "";
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    w = w || 72;
    h = h || 22;
    const span = max - min || 1;
    const coords = vals
      .map((v, i) => {
        const x = (i / (vals.length - 1)) * w;
        const y = h - ((v - min) / span) * (h - 2) - 1;
        return x.toFixed(1) + "," + y.toFixed(1);
      })
      .join(" ");
    const up = vals[vals.length - 1] >= vals[0];
    return `<svg class="fund-spark fund-year-chart" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline fill="none" stroke="${
      up ? "#0d7a4f" : "#c0392b"
    }" stroke-width="1.5" points="${coords}"/></svg>`;
  }

  function enrichFundCells() {
    document.querySelectorAll("[data-fund-enrich]").forEach(async (el) => {
      const fdId = el.getAttribute("data-fund-enrich") || "";
            if (!fdId) {
        el.innerHTML = `<span class="fund-api-status err">${t("fundApiNone")}</span>`;
        return;
      }
      try {
        const summary = await fetchFundSummary(fdId);
        const div = await fetchFundDiv(fdId);
        const spark = await fetchFundSpark(fdId);
        if (!summary && !div && !spark) {
          el.innerHTML = `<span class="fund-api-status err">${t("fundApiFail")}</span>`;
          document.querySelectorAll(`[data-fund-status="${fdId}"]`).forEach((s) => {
            s.textContent = t("fundApiFail");
            s.classList.add("err");
          });
          return;
        }
        if (summary && summary.fdPrice != null) {
          document.querySelectorAll(`[data-fund-nav="${fdId}"]`).forEach((cell) => {
            cell.textContent = fmtMoneyFull(summary.fdPrice, "", 4);
          });
        }
        if (summary && summary.managementFee) {
          document.querySelectorAll(`[data-fund-fee="${fdId}"]`).forEach((cell) => {
            const cur = cell.textContent;
            if (!cur || cur === "—") cell.textContent = String(summary.managementFee);
            else cell.innerHTML = escapeHtml(cell.textContent) + `<div class="holding-sub">${escapeHtml(summary.managementFee)}</div>`;
          });
        }
        let divPct = null;
        if (div) {
          const amt = div.dividAmt != null ? Number(div.dividAmt) : null;
          const px = summary && summary.fdPrice != null ? Number(summary.fdPrice) : null;
          if (amt != null && px) divPct = (amt / px) * 100;
        }
        if (divPct != null) {
          document.querySelectorAll(`[data-fund-div="${fdId}"]`).forEach((cell) => {
            cell.textContent = fmtPct(divPct);
          });
        }
        const chart = sparkSvg(spark, 220, 48);
        const nav =
          summary && summary.fdPrice != null
            ? `${t("fundNav")} ${summary.fdCcy || ""} ${Number(summary.fdPrice).toFixed(4)}`
            : "";
        const asof = summary && summary.asOfDate ? `${t("fundAsOf")} ${summary.asOfDate}` : "";
        el.innerHTML = `<div class="fund-enrich">${chart}<span>${[nav, asof].filter(Boolean).map(escapeHtml).join(" · ")}</span>
          <div class="fund-api-status ok">${t("fundApiOk")}</div></div>`;
        document.querySelectorAll(`[data-fund-status="${fdId}"]`).forEach((s) => {
          s.textContent = t("fundApiOk");
          s.classList.remove("err");
          s.classList.add("ok");
        });
      } catch (e) {
        el.innerHTML = `<span class="fund-api-status err">${t("fundApiFail")}</span>`;
        document.querySelectorAll(`[data-fund-status="${fdId}"]`).forEach((s) => {
          s.textContent = t("fundApiFail");
          s.classList.add("err");
        });
      }
    });
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


  function caseAum(c) {
    return (c.holdings || []).reduce((s, h) => s + (Number(h.market_value) || 0), 0);
  }

  function caseMaturities(c) {
    return (c.holdings || [])
      .map((h) => h.maturity_date)
      .filter(Boolean)
      .sort();
  }

  function riskLabel(risk) {
    const map = {
      Conservative: "riskConservative",
      Balanced: "riskBalanced",
      Growth: "riskGrowth",
      Aggressive: "riskAggressive",
    };
    return map[risk] ? t(map[risk]) : risk || "—";
  }

  function casePnl(c) {
    const cost = (c.holdings || []).reduce((s, h) => s + (Number(h.cost_value) || 0), 0);
    const aum = caseAum(c);
    return { pnl: aum - cost, pnlPct: cost ? ((aum - cost) / cost) * 100 : 0 };
  }

  function populateAdvSelects() {
    const typeSel = document.getElementById("advProductType");
    const riskSel = document.getElementById("advRisk");
    const segSel = document.getElementById("advSegment");
    const ccySel = document.getElementById("advCurrency");
    if (!typeSel || !riskSel) return;
    const types = new Set();
    const risks = new Set();
    const segs = new Set();
    const ccys = new Set();
    state.cases.forEach((c) => {
      if (c.risk_profile) risks.add(c.risk_profile);
      if (c.segment) segs.add(c.segment);
      if (c.currency) ccys.add(c.currency);
      (c.holdings || []).forEach((h) => {
        if (h.type) types.add(h.type === "Swap" ? "swap" : h.type);
        if (h.currency) ccys.add(h.currency);
      });
    });
    const typeOrder = ["Fund", "Stock", "ELN", "FX", "Deposit", "Insurance", "swap"];
    const sortedTypes = [...types].sort(
      (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b) || a.localeCompare(b)
    );
    const f = state.advFilters;
    typeSel.innerHTML =
      `<option value="">${t("advAny")}</option>` +
      sortedTypes.map((ty) => `<option value="${ty}">${typeLabel(ty)}</option>`).join("");
    riskSel.innerHTML =
      `<option value="">${t("advAny")}</option>` +
      [...risks].sort().map((r) => `<option value="${r}">${riskLabel(r)}</option>`).join("");
    if (segSel) {
      segSel.innerHTML =
        `<option value="">${t("advAny")}</option>` +
        [...segs].sort().map((s) => `<option value="${s}">${s}</option>`).join("");
      segSel.value = f.segment || "";
    }
    if (ccySel) {
      ccySel.innerHTML =
        `<option value="">${t("advAny")}</option>` +
        [...ccys].sort().map((s) => `<option value="${s}">${s}</option>`).join("");
      ccySel.value = f.currency || "";
    }
    typeSel.value = f.productType || "";
    riskSel.value = f.risk || "";
    const pnlSel = document.getElementById("advPnlSign");
    const oppSel = document.getElementById("advHasOpp");
    const mixSel = document.getElementById("advProductMix");
    const sortSel = document.getElementById("advSort");
    if (pnlSel) pnlSel.value = f.pnlSign || "";
    if (oppSel) oppSel.value = f.hasOpp || "";
    if (mixSel) mixSel.value = f.productMix || "";
    if (sortSel) sortSel.value = f.sort || "aum_desc";
  }

  function readAdvFiltersFromForm() {
    const minV = document.getElementById("advAumMin").value;
    const maxV = document.getElementById("advAumMax").value;
    state.advFilters = {
      aumMin: minV === "" ? null : Number(minV),
      aumMax: maxV === "" ? null : Number(maxV),
      productType: document.getElementById("advProductType").value || "",
      risk: document.getElementById("advRisk").value || "",
      segment: (document.getElementById("advSegment") || {}).value || "",
      currency: (document.getElementById("advCurrency") || {}).value || "",
      pnlSign: (document.getElementById("advPnlSign") || {}).value || "",
      hasOpp: (document.getElementById("advHasOpp") || {}).value || "",
      productMix: (document.getElementById("advProductMix") || {}).value || "",
      sort: (document.getElementById("advSort") || {}).value || "aum_desc",
      matFrom: document.getElementById("advMatFrom").value || "",
      matTo: document.getElementById("advMatTo").value || "",
    };
  }

  function advFiltersActive() {
    const f = state.advFilters;
    return (
      f.aumMin != null ||
      f.aumMax != null ||
      !!f.productType ||
      !!f.risk ||
      !!f.segment ||
      !!f.currency ||
      !!f.pnlSign ||
      !!f.hasOpp ||
      !!f.productMix ||
      !!f.matFrom ||
      !!f.matTo
    );
  }

  function clientMatchesAdv(c, f) {
    const aum = caseAum(c);
    if (f.aumMin != null && !isNaN(f.aumMin) && aum < f.aumMin) return false;
    if (f.aumMax != null && !isNaN(f.aumMax) && aum > f.aumMax) return false;
    if (f.risk && c.risk_profile !== f.risk) return false;
    if (f.segment && c.segment !== f.segment) return false;
    if (f.currency) {
      const hasCcy =
        c.currency === f.currency ||
        (c.holdings || []).some((h) => h.currency === f.currency);
      if (!hasCcy) return false;
    }
    if (f.productType) {
      const want = f.productType === "Swap" ? "swap" : f.productType;
      const has = (c.holdings || []).some((h) => {
        const ty = h.type === "Swap" ? "swap" : h.type;
        return ty === want;
      });
      if (!has) return false;
    }
    if (f.productMix === "single" && (c.holdings || []).length !== 1) return false;
    if (f.productMix === "multi" && (c.holdings || []).length < 2) return false;
    const opps = (c.opportunities || []).filter((o) => !o.done);
    if (f.hasOpp === "yes" && !opps.length) return false;
    if (f.hasOpp === "no" && opps.length) return false;
    const { pnl } = casePnl(c);
    if (f.pnlSign === "profit" && pnl <= 0) return false;
    if (f.pnlSign === "loss" && pnl >= 0) return false;
    if (f.pnlSign === "hasLoss" && !(c.holdings || []).some((h) => (h.pnl_value || 0) < 0))
      return false;
    if (f.matFrom || f.matTo) {
      const mats = caseMaturities(c);
      if (!mats.length) return false;
      const ok = mats.some((d) => {
        if (f.matFrom && d < f.matFrom) return false;
        if (f.matTo && d > f.matTo) return false;
        return true;
      });
      if (!ok) return false;
    }
    return true;
  }

  function sortClientsAdv(list) {
    const sort = state.advFilters.sort || "aum_desc";
    return list.slice().sort((a, b) => {
      if (sort === "name") {
        return clientDisplayName(a).localeCompare(clientDisplayName(b), "zh");
      }
      if (sort === "pnl_pct") {
        return casePnl(b).pnlPct - casePnl(a).pnlPct;
      }
      if (sort === "maturity") {
        const ma = caseMaturities(a)[0] || "9999";
        const mb = caseMaturities(b)[0] || "9999";
        return ma.localeCompare(mb);
      }
      if (sort === "aum_asc") return caseAum(a) - caseAum(b);
      return caseAum(b) - caseAum(a);
    });
  }

  function filterClientsAdvanced(keyword) {
    const q = (keyword || "").trim().toLowerCase();
    const filtered = state.cases.filter((c) => {
      if (advFiltersActive() && !clientMatchesAdv(c, state.advFilters)) return false;
      if (!q) return true;
      const names = [c.display_name, c.display_name_en, c.client_id, c.segment]
        .filter(Boolean)
        .map((x) => String(x).toLowerCase());
      if (names.some((n) => n.includes(q))) return true;
      return (c.holdings || []).some((h) =>
        (h.product_name || "").toLowerCase().includes(q)
      );
    });
    return sortClientsAdv(filtered);
  }

  function renderAdvResults() {
    const box = document.getElementById("advResults");
    if (!box) return;
    const kw = document.getElementById("globalSearch").value || "";
    const matches = filterClientsAdvanced(kw);
    if (!state._forceAdvResults && !matches.length && !advFiltersActive() && !kw.trim()) {
      box.classList.add("hidden");
      box.innerHTML = "";
      return;
    }
    box.classList.remove("hidden");
    if (!matches.length) {
      box.innerHTML = `<div class="adv-results-meta">${t("advNoMatch")}</div>`;
      return;
    }
    const cards = matches
      .map((c) => {
        const aum = caseAum(c);
        const mats = caseMaturities(c);
        const types = [
          ...new Set(
            (c.holdings || []).map((h) => (h.type === "Swap" ? "swap" : h.type))
          ),
        ]
          .map(typeLabel)
          .join(" · ");
        return `<button type="button" class="adv-client-card" data-open-case="${escapeHtml(c.id)}">
          <div>
            <strong>${escapeHtml(clientDisplayName(c))}</strong>
            <div class="meta">
              <span>${escapeHtml(c.client_id || "")}</span>
              <span>${riskLabel(c.risk_profile)}</span>
              <span>AUM ${fmtMoneyFull(aum, c.currency || "HKD")}</span>
              ${mats.length ? `<span>${t("advNextMaturity")}: ${mats[0]}</span>` : ""}
              <span>${escapeHtml(types)}</span>
            </div>
          </div>
          <span class="btn-link">${t("openReview")}</span>
        </button>`;
      })
      .join("");
    box.innerHTML =
      `<div class="adv-results-meta">${t("advResults")} · ${matches.length} ${t("advMatchCount")}</div>` +
      cards;
    box.querySelectorAll("[data-open-case]").forEach((btn) => {
      btn.addEventListener("click", () => openClientReview(btn.getAttribute("data-open-case")));
    });
  }

  function syncAdvPanel() {
    const panel = document.getElementById("advPanel");
    const btn = document.getElementById("btnAdvSearch");
    if (!panel) return;
    panel.classList.toggle("hidden", !state.advOpen);
    document.querySelectorAll("#btnAdvSearch, #btnAdvSearchBar").forEach((b) => {
      if (b) b.classList.toggle("active-toggle", state.advOpen);
    });
    if (state.advOpen) {
      populateAdvSelects();
      document.getElementById("advAumMin").value =
        state.advFilters.aumMin != null ? state.advFilters.aumMin : "";
      document.getElementById("advAumMax").value =
        state.advFilters.aumMax != null ? state.advFilters.aumMax : "";
      document.getElementById("advMatFrom").value = state.advFilters.matFrom || "";
      document.getElementById("advMatTo").value = state.advFilters.matTo || "";
      populateAdvSelects();
      if (advFiltersActive() || state.advFilters.sort) renderAdvResults();
    }
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
      if (advFiltersActive() && !clientMatchesAdv(c, state.advFilters)) return;
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
        document.getElementById("globalSearch").value = "";
        dd.classList.add("hidden");
        openClientReview(btn.getAttribute("data-search-client"));
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
    const logout = document.getElementById("btnLogout");
    if (!AUTH_ENABLED) {
      state.authenticated = true;
      if (gate) gate.classList.add("hidden");
      if (shell) shell.classList.remove("hidden");
      ["btnLogout", "btnLogoutDesk"].forEach((id) => {
        document.getElementById(id)?.classList.add("hidden");
      });
      return;
    }
    ["btnLogout", "btnLogoutDesk"].forEach((id) => {
      document.getElementById(id)?.classList.remove("hidden");
    });
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
    if (AUTH_ENABLED && !state.authenticated) return;
    ensureCurrent();
    const c = currentCase();
    renderCaseSelect();
    renderBanner();
    syncAdvPanel();
    const homeEl = document.getElementById("sec-home");
    const reviewEl = document.getElementById("reviewSections");
    const holdersEl = document.getElementById("sec-product-holders");
    if (state.viewMode === "home") {
      if (homeEl) homeEl.classList.remove("hidden");
      if (reviewEl) reviewEl.classList.add("hidden");
      if (holdersEl) holdersEl.classList.add("hidden");
      renderHome();
    } else if (state.viewMode === "holders" && state.holdersProduct) {
      if (homeEl) homeEl.classList.add("hidden");
      if (reviewEl) reviewEl.classList.add("hidden");
      if (holdersEl) holdersEl.classList.remove("hidden");
      renderProductHolders(state.holdersProduct);
    } else {
      state.viewMode = "review";
      if (homeEl) homeEl.classList.add("hidden");
      if (holdersEl) holdersEl.classList.add("hidden");
      if (reviewEl) reviewEl.classList.remove("hidden");
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
    const raw = text.replace(/^\uFEFF/, "");
    const blocks = raw.split(/\r?\n-{3,}\r?\n/);
    if (blocks.length > 1) {
      return blocks
        .map((b) => b.trim())
        .filter(Boolean)
        .map((b) => parseCsvSingle(b));
    }
    return parseCsvSingle(raw);
  }

  function parseCsvSingle(text) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
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
    const byClient = new Map();
    dataRows.forEach((row) => {
      if (!row.length || row.every((c) => !String(c).trim())) return;
      const get = (k) => (idx[k] != null ? row[idx[k]] : "");
      const client_id = get("client_id") || "imported";
      const display_name = get("display_name") || client_id;
      if (!byClient.has(client_id)) {
        byClient.set(client_id, {
          id: "case-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
          client_id,
          display_name,
          display_name_en: get("display_name_en") || display_name,
          review_date: get("review_date") || new Date().toISOString().slice(0, 10),
          rm_name: get("rm_name") || "Mose Lee",
          currency: get("currency") || "HKD",
          risk_profile: get("risk_profile") || "Balanced",
          notes: get("notes") || "",
          holdings: [],
          opportunities: [],
        });
      }
      const c = byClient.get(client_id);
      if (get("display_name")) c.display_name = get("display_name");
      const h = {
        product_name: get("product_name"),
        type: get("type") || "Fund",
        fund_code: get("fund_code") || "",
        isin: get("isin") || "",
        fdId: get("fdid") || get("fd_id") || "",
        units: get("units"),
        nav: get("nav"),
        fee_pct: get("fee_pct"),
        fee_amount: get("fee_amount"),
        monthly_div_pct: get("monthly_div_pct"),
        principal_after_fee: get("principal_after_fee"),
        quantity: get("quantity"),
        cost_value: get("cost_value"),
        market_value: get("market_value"),
        day_change_pct: get("day_change_pct"),
        pnl_value: get("pnl_value"),
        pnl_pct: get("pnl_pct"),
        currency: get("currency") || c.currency || "HKD",
        start_date: get("start_date") || "",
        maturity_date: get("maturity_date") || "",
        underlying: get("underlying") || "",
        strike_pct: get("strike_pct"),
        interest_rate_pct: get("interest_rate_pct"),
      };
      if (h.product_name) {
        normalizeHolding(h);
        c.holdings.push(h);
      }
    });
    const cases = [...byClient.values()];
    if (cases.length === 1) return cases[0];
    if (cases.length > 1) return cases;
    return {
      id: "case-" + Date.now(),
      client_id: "imported",
      display_name: "Imported Client",
      display_name_en: "Imported Client",
      review_date: new Date().toISOString().slice(0, 10),
      rm_name: "Mose Lee",
      currency: "HKD",
      risk_profile: "Balanced",
      notes: "",
      holdings: [],
      opportunities: [],
    };
  }

  function normalizeHolding(h) {
    [
      "quantity",
      "cost_value",
      "market_value",
      "day_change_pct",
      "pnl_value",
      "pnl_pct",
      "units",
      "nav",
      "fee_pct",
      "fee_amount",
      "monthly_div_pct",
      "principal_after_fee",
      "strike_pct",
      "interest_rate_pct",
    ].forEach((k) => {
      if (h[k] != null && h[k] !== "") h[k] = Number(h[k]);
    });
    if (!h.fdId && window.PR_resolveFdId) {
      const r = window.PR_resolveFdId(h);
      if (r) h.fdId = r;
    }
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

    function triggerImport() {
      document.getElementById("fileInput").click();
    }
    document.getElementById("btnImport")?.addEventListener("click", triggerImport);
    document.getElementById("btnImportDesk")?.addEventListener("click", triggerImport);

    async function ingestImportedCases(cases) {
      const list = Array.isArray(cases) ? cases : [cases];
      applyFundMap(list);
      list.forEach((cas) => {
        if (!cas.id) cas.id = "case-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
        state.cases.push(cas);
      });
      state.currentId = list[0].id;
      state.typeFilter = "all";
      saveCases();
      renderAll();
      toast(list.length > 1 ? t("toastImportedBatch") + " (" + list.length + ")" : t("toastImported"));
    }

    document.getElementById("fileInput").addEventListener("change", async (e) => {
      const files = e.target.files ? [...e.target.files] : [];
      if (!files.length) return;
      try {
        const all = [];
        for (const file of files) {
          const name = (file.name || "").toLowerCase();
          if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
            if (typeof XLSX === "undefined") throw new Error("SheetJS not loaded");
            const buf = await file.arrayBuffer();
            const wb = XLSX.read(buf, { type: "array" });
            const sheet = wb.Sheets[wb.SheetNames[0]];
            const csv = XLSX.utils.sheet_to_csv(sheet);
            const parsed = parseCsv(csv);
            if (Array.isArray(parsed)) all.push(...parsed);
            else all.push(parsed);
          } else {
            const textContent = await file.text();
            const parsed = parseCsv(textContent);
            if (Array.isArray(parsed)) all.push(...parsed);
            else all.push(parsed);
          }
        }
        await ingestImportedCases(all);
      } catch (err) {
        toast(String(err.message || err));
      }
      e.target.value = "";
    });

    function downloadExcelTemplate() {
      const headers = [
        "client_id","display_name","product_name","type","fund_code","isin","fdId",
        "units","nav","fee_pct","fee_amount","monthly_div_pct","quantity","cost_value",
        "market_value","pnl_value","pnl_pct","day_change_pct","currency","start_date",
        "maturity_date","underlying","strike_pct","interest_rate_pct"
      ];
      const sample = [
        ["C-DEMO-01","範本客戶","聯博美元收益 A2/港元","Fund","AMAIA2HX","HK0000784949","ETNSI36463",1000,100.38,1.1,1100,0.35,1000,100000,100380,380,0.38,0.1,"HKD","","","","",""],
        ["C-DEMO-01","範本客戶","港元定期 3.2% 6M","Deposit","","","","","","","","",500000,500000,508000,8000,1.6,0.01,"HKD","2026-09-15","2027-03-15","","",3.2]
      ];
      downloadXlsx("portfolio-review-template.xlsx", headers, sample, "Holdings");
      toast(t("toastTemplate"));
    }
    document.getElementById("btnDownloadTemplate")?.addEventListener("click", downloadExcelTemplate);
    document.getElementById("btnDownloadTemplateDesk")?.addEventListener("click", downloadExcelTemplate);

    async function backupCases() {
      const payload = { exported_at: new Date().toISOString(), app: "portfolio-review", cases: state.cases };
      const json = JSON.stringify(payload, null, 2);
      if (typeof JSZip !== "undefined") {
        const zip = new JSZip();
        zip.file("portfolio-review-cases.json", json);
        const blob = await zip.generateAsync({ type: "blob" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "portfolio-review-backup.zip";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      } else {
        const blob = new Blob([json], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "portfolio-review-cases.json";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }
      toast(t("toastBackup"));
    }
    document.getElementById("btnBackup")?.addEventListener("click", backupCases);
    document.getElementById("btnBackupDesk")?.addEventListener("click", backupCases);

    const moreBtn = document.getElementById("btnMore");
    const moreMenu = document.getElementById("moreMenu");
    moreBtn?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      moreMenu?.classList.toggle("hidden");
      moreBtn.setAttribute("aria-expanded", moreMenu && !moreMenu.classList.contains("hidden") ? "true" : "false");
    });
    document.addEventListener("click", () => { moreMenu?.classList.add("hidden"); });
    moreMenu?.addEventListener("click", (ev) => ev.stopPropagation());


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
      openClientReview(e.target.value);
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
          state.viewMode = "review";
          renderAll();
        }
        document.querySelectorAll(".nav-tab").forEach((x) => x.classList.remove("active"));
        tab.classList.add("active");
        const target = document.querySelector(tab.getAttribute("data-target"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    ["btnLogout", "btnLogoutDesk"].forEach((id) => {
      document.getElementById(id)?.addEventListener("click", () => {
      sessionStorage.removeItem(AUTH_KEY);
      state.authenticated = false;
      document.getElementById("loginPassword").value = "";
      applyAuthUI();
      applyI18n();
    });
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

    function toggleAdvPanel() {
      state.advOpen = !state.advOpen;
      syncAdvPanel();
      applyI18n();
      if (state.advOpen) {
        document.getElementById("advPanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
    document.getElementById("btnAdvSearch").addEventListener("click", toggleAdvPanel);
    const barBtn = document.getElementById("btnAdvSearchBar");
    if (barBtn) barBtn.addEventListener("click", toggleAdvPanel);

    document.getElementById("btnHome").addEventListener("click", () => goHome());

    const exportBtn = document.getElementById("btnExportMenu");
    const exportMenu = document.getElementById("exportMenu");
    if (exportBtn && exportMenu) {
      exportBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = exportMenu.classList.toggle("hidden") === false;
        exportBtn.classList.toggle("active-toggle", open);
        exportBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      exportMenu.querySelectorAll("[data-report]").forEach((item) => {
        item.addEventListener("click", () => {
          runExportReport(item.getAttribute("data-report"));
        });
      });
      document.addEventListener("click", (ev) => {
        if (!exportBtn.contains(ev.target) && !exportMenu.contains(ev.target)) {
          exportMenu.classList.add("hidden");
          exportBtn.classList.remove("active-toggle");
        }
      });
    }

    const spGo = document.getElementById("btnSingleProductGo");
    const spCancel = document.getElementById("btnSingleProductCancel");
    if (spGo) {
      spGo.addEventListener("click", () => {
        const sel = document.getElementById("singleProductSelect");
        state._singleProductName = sel.value;
        document.getElementById("singleProductPicker").classList.add("hidden");
        const report = buildReport("singleProductRun");
        if (report) showReportPrint(report);
      });
    }
    if (spCancel) {
      spCancel.addEventListener("click", () => {
        document.getElementById("singleProductPicker").classList.add("hidden");
      });
    }
    document.getElementById("btnAdvApply").addEventListener("click", () => {
      readAdvFiltersFromForm();
      state.advOpen = true;
      state._forceAdvResults = true;
      renderAdvResults();
      state._forceAdvResults = false;
      toast(t("advResults"));
    });
    document.getElementById("btnAdvClear").addEventListener("click", () => {
      state.advFilters = {
        aumMin: null,
        aumMax: null,
        productType: "",
        risk: "",
        segment: "",
        currency: "",
        pnlSign: "",
        hasOpp: "",
        productMix: "",
        sort: "aum_desc",
        matFrom: "",
        matTo: "",
      };
      [
        "advAumMin",
        "advAumMax",
        "advProductType",
        "advRisk",
        "advSegment",
        "advCurrency",
        "advPnlSign",
        "advHasOpp",
        "advProductMix",
        "advSort",
        "advMatFrom",
        "advMatTo",
      ].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = id === "advSort" ? "aum_desc" : "";
      });
      populateAdvSelects();
      document.getElementById("advResults").classList.add("hidden");
      document.getElementById("advResults").innerHTML = "";
    });

    const searchInput = document.getElementById("globalSearch");
    let searchTimer = null;
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        runSearch(searchInput.value);
        if (state.advOpen && advFiltersActive()) renderAdvResults();
      }, 150);
    });
    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim()) runSearch(searchInput.value);
    });
    document.addEventListener("click", (ev) => {
      const cluster = document.querySelector(".search-cluster") || document.querySelector(".search-wrap");
      if (cluster && !cluster.contains(ev.target)) {
        document.getElementById("searchDropdown").classList.add("hidden");
      }
    });

    document.getElementById("btnCloseHolders").addEventListener("click", () => {
      showReviewView();
      renderAll();
    });
  }

  function init() {
    state.authenticated = !AUTH_ENABLED || sessionStorage.getItem(AUTH_KEY) === "1";
    loadCases();
    ensureCurrent();
    if (!state.currentId && state.cases.length) state.currentId = state.cases[0].id;
    wireEvents();
    applyI18n();
    applyAuthUI();
    if (state.authenticated) {
      state.viewMode = "home";
      renderAll();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
