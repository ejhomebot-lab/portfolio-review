# 投資組合檢視 · Portfolio Review

Client-facing portfolio review webpage for bank relationship managers (demo / prototype).

**Live:** https://ejhomebot-lab.github.io/portfolio-review/

Also open locally in a browser.

## Access (temporary password)

The whole site is locked behind a **login gate**. Session is kept in `sessionStorage` until the browser tab is closed or you click **登出 / Log out**.

| | |
|--|--|
| Temporary password | `mose2026` |
| Storage | `sessionStorage` key `pr_auth_v1` |
| Hashing | Client-side **SHA-256** compare only |

**This is not bank-grade security.** Anyone who can read the page source can recover or bypass the check. Use only for UX demos on an RM laptop — never as real access control for client data.

## Notion → Excel → CSV → Web

1. **Notion** — maintain Clients, Holdings, Opportunities (see `schema.md`).
2. **Excel / Google Sheets** — refresh stock/ETF prices; paste fund NAV and bank MTM for ELN/insurance; compute P&L.
3. **Export CSV** — use the schema in `schema.md` (full portfolio or flat holdings).
4. **This web app** — sign in → **搜尋** client or product →「匯入 Excel／CSV」→「客戶模式」→「匯出 PDF」.

Cases are stored only in the browser `localStorage` (`pr_cases_v2`). No server.

## Search

- **By client name** (or client ID) → jump to that client’s review.
- **By product name** (e.g. `環球多元資產基金`) → cross-client **holders table** listing every demo client who holds it.
- Demo pack includes **4 clients** with overlapping products (see `assets/demo-data.js`).

## Quick start

```bash
cd /workspace/portfolio-review
python3 -m http.server 8877
# visit http://localhost:8877
# password: mose2026
```

## Compliance note

Real client data must remain on **bank-approved** systems. Do not put CIF / ID / account numbers into personal Notion, Google, or public GitHub. This prototype uses anonymized demo data only.

## Brand

Separate from PF · Premium Financing. Product name: **投資組合檢視 / Portfolio Review**.
