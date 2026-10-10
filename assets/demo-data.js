/* Multi-client demo portfolios — overlapping products for cross-client search */
window.PR_DEMO_CASES = [
  {
    id: "demo-hong-yiu",
    client_id: "****4935",
    // Full Notion client no. masked above for public UI; internal ref ends …4935
    display_name: "匡耀",
    display_name_en: "Hong Yiu",
    review_date: "2026-10-10",
    rm_name: "Mose Lee",
    currency: "HKD",
    risk_profile: "Balanced",
    risk_profile_zh: "均衡型",
    // Notion TOTAL AMT ~24,504,544; current book = HKD swap principal below
    notes: "保本高息 Swap（3M）：2026-10-09 → 2027-01-05（94 日）。USD 名義 3,054,386.39 @ spot 7.8420 = HKD 本金 23,952,498.07；HKD FD 3.41%；遠期 7.829097；組合預期收益率 4.00%。到期 HKD 24,162,846.94／USD 3,086,287.85。Notion TOTAL AMT 約 24,504,544（含其他未拆明細）。",
    holdings: [
      {
        product_name: "保本高息 Swap 3M",
        type: "swap",
        quantity: 3054386.39,
        cost_value: 23952498.07,
        market_value: 23952498.07,
        day_change_pct: 0.02,
        pnl_value: 0,
        pnl_pct: 0,
        currency: "HKD",
        start_date: "2026-10-09",
        maturity_date: "2027-01-05",
        tenor_days: 94,
        expected_yield_pct: 4.0,
        usd_notional: 3054386.39,
        spot_fx: 7.8420,
        forward_fx: 7.829097,
        hkd_fd_rate_pct: 3.41,
        hkd_interest: 210348.87,
        maturity_hkd: 24162846.94,
        usd_gain: 31901.46,
        maturity_usd: 3086287.85,
        currency_note: "USD 3,054,386.39 @ 7.8420 ↔ HKD"
      }
    ],
    opportunities: [
      { id: "hy-o1", title: "Swap 到期續作（2027-01-05）", category: "Maturity", due_date: "2027-01-05", priority: "High", amount: 23952498.07, talking_point: "3M 保本高息 Swap 將於 2027-01-05 到期（預期組合收益率 4.00%／到期 HKD 約 24.16M）。可預先談 rollover 或轉其他保本高息結構。", hide_in_client_mode: false, done: false },
      { id: "hy-o2", title: "Swap 銷售紀錄跟進（RM）", category: "Other", due_date: "2026-10-09", priority: "Medium", amount: 31162, talking_point: "Notion REV：2026-10-09 錄得 swap 相關收入 HKD 31,162（內部數字，勿向客戶展示）。", hide_in_client_mode: true, done: false }
    ]
  },
  {
    id: "demo-chen",
    client_id: "C-2024-0188",
    display_name: "陳先生",
    display_name_en: "Mr. Chan (Demo)",
    review_date: "2026-10-10",
    rm_name: "Mose Lee",
    currency: "HKD",
    risk_profile: "Balanced",
    risk_profile_zh: "均衡型",
    notes: "客戶關注美元利率回落後之再配置；下季檢視人壽保障缺口。",
    holdings: [
      { product_name: "聯博 (香港) - 美元收益基金 - A2/港元", type: "Fund", fund_code: "AMAIA2HX", fdId: "ETNSI36463", quantity: 12500, cost_value: 2500000, market_value: 2687500, day_change_pct: 0.35, pnl_value: 187500, pnl_pct: 7.5, currency: "HKD" },
      { product_name: "聯博 (香港) - 美元收益基金 - A2/美元", type: "Fund", fund_code: "AMAIA2UX", fdId: "ETNSI28727", quantity: 8000, cost_value: 1600000, market_value: 1544000, day_change_pct: -0.22, pnl_value: -56000, pnl_pct: -3.5, currency: "USD" },
      { product_name: "騰訊控股 (0700.HK)", type: "Stock", quantity: 2000, cost_value: 580000, market_value: 824800, day_change_pct: -1.25, pnl_value: 244800, pnl_pct: 42.21, currency: "HKD" },
      { product_name: "滙豐控股 (0005.HK)", type: "Stock", quantity: 5000, cost_value: 275000, market_value: 312500, day_change_pct: 0.48, pnl_value: 37500, pnl_pct: 13.64, currency: "HKD" },
      { product_name: "恒生科技 ETF (3033.HK)", type: "Stock", quantity: 10000, cost_value: 420000, market_value: 398000, day_change_pct: -0.85, pnl_value: -22000, pnl_pct: -5.24, currency: "HKD" },
      { product_name: "美股掛鈎票據 12M (NVDA)", type: "ELN", quantity: 1, cost_value: 1000000, market_value: 972000, day_change_pct: -0.4, pnl_value: -28000, pnl_pct: -2.8, currency: "USD", start_date: "2025-12-20", maturity_date: "2026-12-20" },
      { product_name: "USD/HKD 遠期套保", type: "FX", quantity: 500000, cost_value: 500000, market_value: 512500, day_change_pct: 0.12, pnl_value: 12500, pnl_pct: 2.5, currency: "USD" },
      { product_name: "美金定期存款 5.1% 3M", type: "Deposit", quantity: 800000, cost_value: 800000, market_value: 806800, day_change_pct: 0.02, pnl_value: 6800, pnl_pct: 0.85, currency: "USD", start_date: "2026-08-26", maturity_date: "2026-11-24" },
      { product_name: "港元定期存款 3.2% 6M", type: "Deposit", quantity: 1200000, cost_value: 1200000, market_value: 1214400, day_change_pct: 0.01, pnl_value: 14400, pnl_pct: 1.2, currency: "HKD", start_date: "2026-09-15", maturity_date: "2027-03-15" },
      { product_name: "萬用壽險（現金價值）", type: "Insurance", quantity: 1, cost_value: 1500000, market_value: 1582000, day_change_pct: 0.05, pnl_value: 82000, pnl_pct: 5.47, currency: "USD" }
    ],
    opportunities: [
      { id: "c1-o1", title: "美金定期存款 45 日後到期", category: "Maturity", due_date: "2026-11-24", priority: "High", amount: 800000, talking_point: "可比較續存、短債基金或貨幣市場基金。", hide_in_client_mode: false, done: false },
      { id: "c1-o2", title: "人壽保障缺口（家庭責任）", category: "Insurance Gap", due_date: "2026-12-01", priority: "High", amount: null, talking_point: "建議補定期壽險保障額。", hide_in_client_mode: true, done: false }
    ]
  },
  {
    id: "demo-wong",
    client_id: "C-2023-0441",
    display_name: "王女士",
    display_name_en: "Ms. Wong (Demo)",
    review_date: "2026-10-10",
    rm_name: "Mose Lee",
    currency: "HKD",
    risk_profile: "Growth",
    risk_profile_zh: "增長型",
    notes: "偏好科技股與主動基金；可談再平衡。",
    holdings: [
      { product_name: "聯博 (香港) - 美元收益基金 - A2/港元", type: "Fund", fund_code: "AMAIA2HX", fdId: "ETNSI36463", quantity: 6000, cost_value: 1200000, market_value: 1290000, day_change_pct: 0.35, pnl_value: 90000, pnl_pct: 7.5, currency: "HKD" },
      { product_name: "騰訊控股 (0700.HK)", type: "Stock", quantity: 3500, cost_value: 980000, market_value: 1443400, day_change_pct: -1.25, pnl_value: 463400, pnl_pct: 47.29, currency: "HKD" },
      { product_name: "恒生科技 ETF (3033.HK)", type: "Stock", quantity: 20000, cost_value: 900000, market_value: 796000, day_change_pct: -0.85, pnl_value: -104000, pnl_pct: -11.56, currency: "HKD" },
      { product_name: "美股掛鈎票據 12M (NVDA)", type: "ELN", quantity: 1, cost_value: 500000, market_value: 486000, day_change_pct: -0.4, pnl_value: -14000, pnl_pct: -2.8, currency: "USD", start_date: "2026-02-28", maturity_date: "2026-12-28" },
      { product_name: "滙豐控股 (0005.HK)", type: "Stock", quantity: 8000, cost_value: 440000, market_value: 500000, day_change_pct: 0.48, pnl_value: 60000, pnl_pct: 13.64, currency: "HKD" }
    ],
    opportunities: [
      { id: "c2-o1", title: "科技倉位偏高，可再平衡", category: "Rebalance", due_date: "2026-10-25", priority: "Medium", amount: null, talking_point: "騰訊＋恒生科技佔比較高。", hide_in_client_mode: false, done: false }
    ]
  },
  {
    id: "demo-lee",
    client_id: "C-2025-0042",
    display_name: "李太太",
    display_name_en: "Mrs. Lee (Demo)",
    review_date: "2026-10-10",
    rm_name: "Mose Lee",
    currency: "HKD",
    risk_profile: "Conservative",
    risk_profile_zh: "保守型",
    notes: "保守型客戶，存款到期可談短債。",
    holdings: [
      { product_name: "聯博 (香港) - 美元收益基金 - A2/美元", type: "Fund", fund_code: "AMAIA2UX", fdId: "ETNSI28727", quantity: 4000, cost_value: 800000, market_value: 772000, day_change_pct: -0.22, pnl_value: -28000, pnl_pct: -3.5, currency: "USD" },
      { product_name: "聯博 (香港) - 美元收益基金 - A2/港元", type: "Fund", fund_code: "AMAIA2HX", fdId: "ETNSI36463", quantity: 2500, cost_value: 500000, market_value: 537500, day_change_pct: 0.35, pnl_value: 37500, pnl_pct: 7.5, currency: "HKD" },
      { product_name: "美金定期存款 5.1% 3M", type: "Deposit", quantity: 1500000, cost_value: 1500000, market_value: 1512750, day_change_pct: 0.02, pnl_value: 12750, pnl_pct: 0.85, currency: "USD", start_date: "2026-08-26", maturity_date: "2026-11-24" },
      { product_name: "港元定期存款 3.2% 6M", type: "Deposit", quantity: 2000000, cost_value: 2000000, market_value: 2024000, day_change_pct: 0.01, pnl_value: 24000, pnl_pct: 1.2, currency: "HKD", start_date: "2026-10-01", maturity_date: "2027-04-01" },
      { product_name: "港元定期存款 3.0% 12M", type: "Deposit", quantity: 1000000, cost_value: 1000000, market_value: 1015000, day_change_pct: 0.01, pnl_value: 15000, pnl_pct: 1.5, currency: "HKD" }
    ],
    opportunities: [
      { id: "c3-o1", title: "美金定期 45 日後到期", category: "Maturity", due_date: "2026-11-24", priority: "High", amount: 1500000, talking_point: "可談續存或轉短債基金。", hide_in_client_mode: false, done: false },
      { id: "c3-o2", title: "現金／存款比重偏高", category: "Cash", due_date: "2026-10-18", priority: "Medium", amount: 4500000, talking_point: "存款佔比較高，逐步再配置。", hide_in_client_mode: true, done: false }
    ]
  },
  {
    id: "demo-ho",
    client_id: "C-2022-1107",
    display_name: "何先生",
    display_name_en: "Mr. Ho (Demo)",
    review_date: "2026-10-09",
    rm_name: "Mose Lee",
    currency: "HKD",
    risk_profile: "Balanced",
    risk_profile_zh: "均衡型",
    notes: "保險與結構性產品為主；關注票息。",
    holdings: [
      { product_name: "萬用壽險（現金價值）", type: "Insurance", quantity: 1, cost_value: 2200000, market_value: 2356000, day_change_pct: 0.05, pnl_value: 156000, pnl_pct: 7.09, currency: "USD" },
      { product_name: "美金定期存款 5.1% 3M", type: "Deposit", quantity: 400000, cost_value: 400000, market_value: 403400, day_change_pct: 0.02, pnl_value: 3400, pnl_pct: 0.85, currency: "USD", start_date: "2026-09-10", maturity_date: "2026-12-10" },
      { product_name: "美股掛鈎票據 12M (NVDA)", type: "ELN", quantity: 1, cost_value: 750000, market_value: 729000, day_change_pct: -0.4, pnl_value: -21000, pnl_pct: -2.8, currency: "USD", start_date: "2026-02-15", maturity_date: "2027-02-15" },
      { product_name: "騰訊控股 (0700.HK)", type: "Stock", quantity: 800, cost_value: 240000, market_value: 329920, day_change_pct: -1.25, pnl_value: 89920, pnl_pct: 37.47, currency: "HKD" },
      { product_name: "USD/HKD 遠期套保", type: "FX", quantity: 200000, cost_value: 200000, market_value: 205000, day_change_pct: 0.12, pnl_value: 5000, pnl_pct: 2.5, currency: "USD" }
    ],
    opportunities: [
      { id: "c4-o1", title: "美股掛鈎票據票息日", category: "Coupon", due_date: "2026-10-28", priority: "Medium", amount: 750000, talking_point: "確認收息或滾存。", hide_in_client_mode: false, done: false },
      { id: "c4-o2", title: "人壽保障缺口", category: "Insurance Gap", due_date: "2026-12-15", priority: "Low", amount: null, talking_point: "現有萬用為主，可評估定期壽險。", hide_in_client_mode: true, done: false }
    ]
  }
];
