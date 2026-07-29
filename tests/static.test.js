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
  assert.match(html, /id=["']flight-deals["']/);
  assert.match(html, /id=["']flight-deals-list["'][^>]+aria-live=/);
  assert.match(html, /id=["']flight-deals-updated["']/);
  assert.match(html, /id=["']flight-deals-empty["']/);
  assert.doesNotMatch(html, /participant-|5명 중 한 명 뽑기/);
  assert.match(html, /<script[^>]+type=["']module["'][^>]+src=["'][^"']*src\/app\.js["']/);
});

test("the mobile stylesheet includes a narrow-screen layout without forced page width", () => {
  assert.match(css, /@media\s*\([^)]*max-width/i);
  assert.doesNotMatch(css, /body\s*\{[^}]*min-width\s*:\s*[4-9]\d{2}px/is);
  assert.doesNotMatch(css, /html\s*\{[^}]*min-width\s*:\s*[4-9]\d{2}px/is);
  assert.match(css, /@media\s*\([^)]*max-width[^}]+\}[\s\S]*\.route-detail-link\s*\{[^}]*width\s*:\s*100%/i);
});

test("the selected route exposes a descriptive, query-driven detail link", () => {
  assert.match(app, /className:\s*["']route-detail-link["']/);
  assert.match(app, /destination:\s*destinationId/);
  assert.match(app, /duration/);
  assert.match(app, /setAttribute\(\s*["']aria-label["']/);
  assert.match(css, /\.route-detail-link:focus-visible|a:focus-visible/);
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
