# Portfolio Review — Data Schema

## Overview

```
Notion (CRM)  →  Excel (prices / P&L)  →  CSV export  →  This web app (client review)
```

- **Notion**: clients, holdings master, sales opportunities (relationship data).
- **Excel / Google Sheets**: market prices, day change %, computed P&L.
- **Web**: presentation layer for client meetings; stores imported cases in `localStorage` only.

---

## Notion Database: Clients

| Field | Type | Notes |
|-------|------|-------|
| Name | Title | Internal name (e.g. 陳大文) |
| Display Name | Text | Client-facing (e.g. 陳先生) |
| Client ID | Text / Unique | e.g. C-2024-0188 |
| Segment | Select | Private / Affluent / Priority |
| RM | Person / Text | Relationship manager |
| Currency | Select | HKD / USD / CNY |
| AUM (manual) | Number | Optional override; else sum of holdings |
| Last Review | Date | |
| Risk Profile | Select | Conservative / Balanced / Growth / Aggressive |
| Notes | Text | Internal only |
| Status | Select | Active / Prospect / Dormant |

---

## Notion Database: Holdings

| Field | Type | Notes |
|-------|------|-------|
| Product Name | Title | e.g. 環球股票基金 A |
| Client | Relation → Clients | |
| Type | Select | Fund / Stock / ELN / FX / Deposit / Insurance / **swap** (保本高息) |
| Ticker / Code | Text | For price lookup (stocks/ETFs) |
| Quantity / Notional | Number | Units or notional amount |
| Currency | Select | |
| Cost Price | Number | Per unit or total cost basis |
| Cost Value | Number | Total acquisition cost (CCY) |
| Purchase Date | Date | |
| Maturity Date | Date | Deposits / ELN / structured |
| Coupon Date | Date | Next coupon if any |
| Bank Quote Flag | Checkbox | True = manual/bank price (ELN, insurance) |
| Notes | Text | |

Price fields below are **refreshed in Excel**, then written back or exported:

| Field (Excel-refreshed) | Type | Notes |
|-------------------------|------|-------|
| Market Price | Number | Latest price / NAV |
| Market Value | Number | Qty × price (or bank MTM) |
| Day Change % | Number | |
| P&L $ | Number | Market Value − Cost Value |
| P&L % | Number | P&L $ / Cost Value |
| As Of | DateTime | Price timestamp |

---

## Notion Database: Opportunities

| Field | Type | Notes |
|-------|------|-------|
| Title | Title | e.g. 定期存款 30 日後到期 |
| Client | Relation → Clients | |
| Category | Select | Maturity / Coupon / Rebalance / Insurance Gap / Cash / Other |
| Due Date | Date | |
| Priority | Select | High / Medium / Low |
| Amount | Number | Related notional if any |
| Status | Select | Open / Done / Dismissed |
| Talking Point | Text | Suggested script for meeting |
| Hide in Client Mode | Checkbox | If true, hidden when「客戶模式」on |

---

## Excel / Sheets — Price Refresh Columns

Recommended sheet `Holdings_Prices` (one row per holding):

| Column | Example | Source |
|--------|---------|--------|
| holding_id | H-001 | Notion export / key |
| client_id | C-2024-0188 | |
| product_name | 騰訊控股 | |
| type | Stock | |
| ticker | 0700.HK | |
| quantity | 2000 | |
| cost_value | 580000 | |
| market_price | 412.40 | `STOCK()` / `GOOGLEFINANCE` / Bloomberg |
| market_value | 824800 | `=quantity*market_price` |
| day_change_pct | -1.25 | Formula or API |
| pnl_value | 244800 | `=market_value-cost_value` |
| pnl_pct | 42.21 | `=pnl_value/cost_value*100` |
| currency | HKD | |
| as_of | 2026-10-10 | |
| price_source | Excel-Stock / Manual / Bank | |

**Price refresh tips**

| Product type | Typical refresh |
|--------------|-----------------|
| Stock / ETF | Excel Stocks datatype or `GOOGLEFINANCE` (often delayed) |
| Fund | Daily NAV (Morningstar / fund house / bank feed) |
| ELN / structured | Bank MTM quote — manual or internal export |
| FX | Spot from Sheets / bank board |
| Time deposit | Par / accrued; no market mark usually |
| Insurance | Cash value from illustration / insurer statement |
| swap / 保本高息 | Bank / desk MTM or structured-product quote — usually manual |

---

## CSV Schema for Web Import

File encoding: **UTF-8**. Header row required. Two modes:

### A) Full portfolio CSV (recommended for meetings)

One file = one client review pack.

```csv
section,field,value
meta,client_id,C-2024-0188
meta,display_name,陳先生
meta,review_date,2026-10-10
meta,rm_name,Mose Lee
meta,currency,HKD
meta,risk_profile,Balanced
meta,notes,下季檢視保險保障缺口
holding,product_name,環球多元資產基金
holding,type,Fund
holding,quantity,12500
holding,cost_value,2500000
holding,market_value,2687500
holding,day_change_pct,0.35
holding,pnl_value,187500
holding,pnl_pct,7.50
holding,currency,HKD
opportunity,title,美金定期 45 日後到期
opportunity,category,Maturity
opportunity,due_date,2026-11-24
opportunity,priority,High
opportunity,amount,800000
opportunity,talking_point,可轉高息定存或短債基金
opportunity,hide_in_client_mode,false
```

### B) Flat holdings-only CSV

```csv
client_id,display_name,product_name,type,quantity,cost_value,market_value,day_change_pct,pnl_value,pnl_pct,currency
C-2024-0188,陳先生,騰訊控股,Stock,2000,580000,824800,-1.25,244800,42.21,HKD
```

Types must be one of: `Fund`, `Stock`, `ELN`, `FX`, `Deposit`, `Insurance`, `swap`.

| Key | EN | 繁中 | 简中 |
|-----|----|------|------|
| Fund | Fund | 基金 | 基金 |
| Stock | Stock | 股票 | 股票 |
| ELN | ELN | 股票掛鈎 | 股票挂钩 |
| FX | FX | 外匯 | 外汇 |
| Deposit | Deposit | 定期存款 | 定期存款 |
| Insurance | Insurance | 保險 | 保险 |
| **swap** | Swap | 保本高息 | 保本高息 |


---

## Web App Storage

- Imported / demo cases → `localStorage` key `pr_cases_v1`
- No server upload; suitable for offline demo on RM laptop
- Clear data via UI「清除本機個案」

---

## Compliance

Client-identifiable data must stay on **bank-approved** devices and tools. Do not sync Notion/Sheets with personal cloud accounts unless compliance has approved. This prototype is for UX validation only.

---

## Cross-client product search

The web app indexes all loaded cases (demo + imported). Searching a **product name** returns every client holding that exact product name, with qty / MV / P&L / day change, and a link to open that client’s review.

For reliable matches, keep **Product Name** identical across Notion rows (same spelling and ticker suffix).

Demo overlapping products (see `assets/demo-data.js`):

| Product | Held by |
|---------|---------|
| 環球多元資產基金 A | 陳先生, 王女士, 李太太 |
| 騰訊控股 (0700.HK) | 陳先生, 王女士, 何先生 |
| 美金定期存款 5.1% 3M | 陳先生, 李太太, 何先生 |
| 美股掛鈎票據 12M (NVDA) | 陳先生, 王女士, 何先生 |
| 萬用壽險（現金價值） | 陳先生, 何先生 |


## Demo client: Hong Yiu / 匡耀

- Display: Hong Yiu / 匡耀
- Client no. on UI: masked `****4935` (do not publish full account numbers)
- Notion TOTAL AMT ≈ HKD 24,504,544 — holdings in demo are a **placeholder split** including one `swap` line「保本高息 Swap」; real line-level detail pending CSV/Notion import
- REV note (RM-only opportunity): swap-related revenue recorded 2026-10-09 — hidden in client mode
