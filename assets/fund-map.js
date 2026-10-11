/**
 * Best-effort fund_code / ISIN → ET Wealth fdId map (BOCOM HK list).
 * HSBC GIF Ultra Short (PM2HKD / LU2334458945) not found on ET Wealth as of 2026-10 — leave unmapped.
 */
window.PR_FUND_MAP = {
  byCode: {
    AMAIA2HX: "ETNSI36463",
    AMAIA2UX: "ETNSI28727",
    // common aliases
    "AMAIA2 HX": "ETNSI36463",
    "AMAIA2 UX": "ETNSI28727",
  },
  byIsin: {
    HK0000784949: "ETNSI36463", // AB USD Income A2 HKD (from getFdSummary)
    // LU2334458945: null — HSBC Ultra Short not in BOCOM/ET Wealth list
  },
  /** Optional static enrichment hints when API missing */
  hints: {
    PM2HKD: { isin: "LU2334458945", name_en: "HSBC GIF Ultra Short Duration Bond", note: "no_fdId" },
    LU2334458945: { fund_code: "PM2HKD", note: "no_fdId" },
  },
};

window.PR_resolveFdId = function (holding) {
  if (!holding) return "";
  if (holding.fdId) return holding.fdId;
  const map = window.PR_FUND_MAP || {};
  const code = String(holding.fund_code || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
  const isin = String(holding.isin || holding.ISIN || "")
    .trim()
    .toUpperCase();
  if (code && map.byCode && map.byCode[code]) return map.byCode[code];
  if (code && map.byCode && map.byCode[holding.fund_code]) return map.byCode[holding.fund_code];
  if (isin && map.byIsin && map.byIsin[isin]) return map.byIsin[isin];
  return "";
};
