import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

test("the static entry point exposes the core journey and accessibility hooks", () => {
  assert.match(html, /<html[^>]+lang=["']ko["']/i);
  assert.match(html, /<main\b/i);
  assert.match(html, /id=["']destination-list["']/);
  assert.match(html, /id=["']draw-button["']/);
  assert.match(html, /id=["']result["'][^>]+aria-live=/);
  assert.match(html, /id=["']route-tabs["'][^>]+role=["']tablist["']/);
  assert.match(html, /id=["']route-panel["']/);
  assert.match(html, /id=["']empty-state["']/);
  assert.match(html, /id=["']participant-form["']/);
  assert.match(html, /id=["']participant-name["']/);
  assert.match(html, /id=["']participant-list["']/);
  assert.match(html, /id=["']participant-draw-button["'][^>]+disabled/);
  assert.match(html, /id=["']participant-result["'][^>]+aria-live=/);
  assert.match(html, /<script[^>]+type=["']module["'][^>]+src=["'][^"']*src\/app\.js["']/);
});

test("the mobile stylesheet includes a narrow-screen layout without forced page width", () => {
  assert.match(css, /@media\s*\([^)]*max-width/i);
  assert.doesNotMatch(css, /body\s*\{[^}]*min-width\s*:\s*[4-9]\d{2}px/is);
  assert.doesNotMatch(css, /html\s*\{[^}]*min-width\s*:\s*[4-9]\d{2}px/is);
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
