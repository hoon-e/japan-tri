import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
const app = await readFile(new URL("../src/app.js", import.meta.url), "utf8");
const routeHtml = await readFile(
  new URL("../route.html", import.meta.url),
  "utf8",
);
const routeCss = await readFile(
  new URL("../src/route-detail.css", import.meta.url),
  "utf8",
);
const routeApp = await readFile(
  new URL("../src/route-detail.js", import.meta.url),
  "utf8",
);

test("the static entry point exposes the core journey and accessibility hooks", () => {
  assert.match(html, /<html[^>]+lang=["']ko["']/i);
  assert.match(html, /<main\b/i);
  assert.match(html, /id=["']destination-list["']/);
  assert.match(html, /id=["']draw-button["']/);
  assert.match(html, /id=["']result["'][^>]+aria-live=/);
  assert.match(html, /id=["']route-tabs["'][^>]+role=["']tablist["']/);
  assert.match(html, /id=["']route-panel["']/);
  assert.match(html, /id=["']empty-state["']/);
  assert.match(html, /id=["']flight-search["']/);
  assert.doesNotMatch(html, /participant-|5명 중 한 명 뽑기/);
  assert.match(html, /<script[^>]+type=["']module["'][^>]+src=["'][^"']*src\/app\.js["']/);
});

test("flight search shortcuts are static, destination-specific, and safe", () => {
  const links = [...html.matchAll(
    /<a(?=[^>]+class=["'][^"']*flight-search-link[^"']*["'])(?=[^>]+href=["']([^"']+)["'])(?=[^>]+target=["']_blank["'])(?=[^>]+rel=["']noopener noreferrer["'])[^>]*>/gi,
  )].map((match) => match[1]);

  assert.equal(links.length, 4);
  assert.ok(links.every((href) => href.startsWith("https://")));
  assert.ok(links.some((href) => href.includes("google.com/travel/flights")));
  assert.ok(links.some((href) => href.includes("skyscanner.co.kr/routes/sela/tak/")));
  assert.ok(links.some((href) => href.includes("skyscanner.co.kr/routes/sela/ygj/")));
  assert.match(html, /서울\s*→\s*다카마쓰/);
  assert.match(html, /서울\s*→\s*요나고/);
  assert.doesNotMatch(html, /최저가 Top 5|flight-deals-list|flight-deals-updated|flight-deals-empty/);
  assert.doesNotMatch(app, /flight-prices\.json|initializeFlightDeals|normalizeFlightDeals|fetch\(/);
});

test("the mobile stylesheet includes a narrow-screen layout without forced page width", () => {
  assert.match(css, /@media\s*\([^)]*max-width/i);
  assert.doesNotMatch(css, /body\s*\{[^}]*min-width\s*:\s*[4-9]\d{2}px/is);
  assert.doesNotMatch(css, /html\s*\{[^}]*min-width\s*:\s*[4-9]\d{2}px/is);
  assert.match(css, /@media\s*\([^)]*max-width[^}]+\}[\s\S]*\.route-detail-link\s*\{[^}]*width\s*:\s*100%/i);
});

test("the overview components keep mobile-safe grids and touch targets", () => {
  assert.match(
    css,
    /\.destination-grid\s*\{[^}]*grid-template-columns\s*:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/is,
  );
  assert.match(
    css,
    /@media\s*\([^)]*max-width\s*:\s*40rem[^}]*\}[\s\S]*?\.destination-grid\s*\{[^}]*grid-template-columns\s*:\s*1fr/is,
  );
  assert.match(css, /\.destination-card\s*\{[^}]*min-width\s*:\s*0/is);
  assert.match(css, /\.route-tabs\s*\{[^}]*overflow-x\s*:\s*auto/is);
  assert.match(css, /\.route-tab\s*\{[^}]*min-height\s*:\s*2\.75rem/is);
  assert.match(
    css,
    /@media\s*\([^)]*max-width\s*:\s*40rem[^}]*\}[\s\S]*?\.flight-search-actions\s*\{[^}]*display\s*:\s*grid/is,
  );
  assert.match(
    css,
    /@media\s*\([^)]*max-width\s*:\s*40rem[^}]*\}[\s\S]*?\.flight-search-link\s*\{[^}]*width\s*:\s*100%/is,
  );
});

test("the selected route exposes a descriptive, query-driven detail link", () => {
  assert.match(app, /className:\s*["']route-detail-link["']/);
  assert.match(app, /destination:\s*destinationId/);
  assert.match(app, /duration/);
  assert.match(app, /setAttribute\(\s*["']aria-label["']/);
  assert.match(css, /\.route-detail-link:focus-visible|a:focus-visible/);
});

test("the overview keeps comparable shortlist and selected route facts", () => {
  assert.match(app, /className:\s*["']destination-facts["']/);
  assert.match(app, /className:\s*["']result-dashboard["']/);
  assert.match(app, /className:\s*["']result-facts["']/);
  assert.match(app, /className:\s*["']result-cautions["']/);
  assert.match(app, /className:\s*["']route-dashboard["']/);
  assert.match(app, /className:\s*["']route-dashboard__stops["']/);
  assert.match(app, /총 거리/);
  assert.match(app, /운전 시간/);
  assert.match(app, /일자별 빠른 보기/);
  assert.match(css, /\.result-facts\s*\{/);
  assert.match(css, /\.route-dashboard__facts\s*\{/);
});

test("destination cards expose categorized safe travel references", () => {
  assert.match(app, /className:\s*["']travel-references["']/);
  assert.match(app, /className:\s*["']travel-reference__category["']/);
  assert.match(app, /link\.target\s*=\s*["']_blank["']/);
  assert.match(app, /link\.rel\s*=\s*["']noopener noreferrer["']/);
  assert.match(
    css,
    /@media\s*\([^)]*max-width\s*:\s*40rem[^}]*\}[\s\S]*?\.travel-reference-list li\s*\{[^}]*grid-template-columns\s*:\s*1fr/is,
  );
});

test("the duration tabs preserve accessible state and keyboard navigation", () => {
  assert.match(app, /tab\.setAttribute\(\s*["']role["'],\s*["']tab["']\s*\)/);
  assert.match(app, /tab\.setAttribute\(\s*["']aria-controls["'],\s*["']route-panel["']\s*\)/);
  assert.match(app, /tab\.setAttribute\(\s*["']aria-selected["'],\s*String\(isActive\)\s*\)/);
  assert.match(app, /event\.key === ["']ArrowRight["']/);
  assert.match(app, /event\.key === ["']ArrowLeft["']/);
  assert.match(app, /event\.key === ["']Home["']/);
  assert.match(app, /event\.key === ["']End["']/);
  assert.match(app, /event\.preventDefault\(\)/);
});

test("the detail page keeps map controls and a textual itinerary accessible", () => {
  assert.match(routeHtml, /<html[^>]+lang=["']ko["']/i);
  assert.match(routeHtml, /class=["']skip-link["'][^>]+href=["']#main-content["']/);
  assert.match(routeHtml, /id=["']route-error["'][^>]+aria-live=["']polite["']/);
  assert.match(routeHtml, /id=["']day-filter["'][^>]+role=["']group["']/);
  assert.match(routeHtml, /id=["']route-map["'][^>]+role=["']region["']/);
  assert.match(routeHtml, /id=["']map-status["'][^>]+role=["']status["']/);
  assert.match(routeHtml, /id=["']itinerary-list["']/);
  assert.match(routeHtml, /OpenStreetMap/);
  assert.match(routeHtml, /Leaflet/);
  assert.match(routeHtml, /실제 내비게이션 경로가 아닙니다/);
  assert.match(routeCss, /@media\s*\([^)]*max-width\s*:\s*760px/i);
  assert.match(
    routeCss,
    /\[hidden\]\s*\{[^}]*display\s*:\s*none\s*!important[^}]*\}/is,
  );
  assert.doesNotMatch(routeCss, /body\s*\{[^}]*min-width\s*:/is);
});

test("Leaflet CDN assets cannot block the textual route detail", () => {
  assert.match(
    routeHtml,
    /<link(?=[^>]+leaflet\.css)(?=[^>]+media=["']print["'])(?=[^>]+onload=["'][^"']*media\s*=\s*['"]all['"])[^>]*>/is,
  );
  assert.match(
    routeHtml,
    /<script(?=[^>]+\basync\b)(?=[^>]+leaflet\.js)[^>]*>/is,
  );
  assert.match(
    routeHtml,
    /<script[^>]+type=["']module["'][^>]+src=["'][^"']*route-detail\.js["']/is,
  );
});

test("the map uses policy-compatible tiles without runtime geocoding or prefetch", () => {
  assert.match(
    routeApp,
    /https:\/\/tile\.openstreetmap\.org\/\{z\}\/\{x\}\/\{y\}\.png/,
  );
  assert.match(routeApp, /OpenStreetMap<\/a> contributors/);
  assert.doesNotMatch(routeApp, /nominatim|geocod|prefetch|no-cache/i);
});

test("the page does not advertise excluded product capabilities", () => {
  assert.doesNotMatch(html, /회원가입|로그인|결제하기|예약하기|AI\s*채팅/i);
});

test("the hosting worker delegates requests to the platform asset binding", async () => {
  const { default: worker } = await import("../hosting/worker.js");
  const expected = new Response("ok");
  const response = await worker.fetch(new Request("https://example.com/"), {
    ASSETS: { fetch: () => expected },
  });

  assert.equal(response, expected);
  assert.equal(
    (await worker.fetch(new Request("https://example.com/"), {})).status,
    503,
  );
});
