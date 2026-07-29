import test from "node:test";
import assert from "node:assert/strict";

import {
  createRouteDetailUrl,
  getDefaultDuration,
  getRouteForDuration,
  formatRouteEstimate,
  parseDriveEstimate,
  normalizeDestinations,
  normalizeFlightDeals,
  selectRandomDestination,
  summarizeRouteMetrics,
} from "../src/app.js";
import { destinations } from "../src/data.js";

const routes = [
  {
    duration: "2n3d",
    label: "2박 3일",
    summary: "짧은 검수 루트",
    days: [
      {
        day: 1,
        title: "첫째 날",
        base: "테스트 숙박지",
        drive: "약 30분",
        stops: ["테스트 명소"],
      },
    ],
  },
  {
    duration: "3n4d",
    label: "3박 4일",
    summary: "긴 검수 루트",
    days: [
      {
        day: 1,
        title: "첫째 날",
        base: "테스트 숙박지",
        drive: "약 45분",
        stops: ["테스트 명소"],
      },
    ],
  },
];

const destination = {
  id: "sample",
  name: "샘플",
  routes,
};

function createValidDestination(id) {
  return {
    id,
    name: `목적지 ${id}`,
    region: "테스트 권역",
    airport: "테스트 공항",
    image: "https://example.com/image.jpg",
    imageAlt: "테스트 목적지 풍경",
    summary: "테스트 목적지 설명",
    directFlightReason: "인천 직항 접근성 테스트",
    driveReason: "렌터카 이동 테스트",
    highlights: ["명소 A", "명소 B"],
    recommendedDuration: "2n3d",
    seasons: "봄과 가을",
    drivingNotes: ["안전 운전"],
    routes,
  };
}

test("selectRandomDestination only returns members of the supplied shortlist", () => {
  const shortlist = [{ id: "a" }, { id: "b" }, { id: "c" }];

  for (let step = 0; step < 100; step += 1) {
    const selected = selectRandomDestination(shortlist, () => step / 100);
    assert.ok(shortlist.includes(selected));
  }
});

test("selectRandomDestination maps deterministic lower and upper samples", () => {
  const shortlist = [{ id: "a" }, { id: "b" }, { id: "c" }];

  assert.equal(selectRandomDestination(shortlist, () => 0), shortlist[0]);
  assert.equal(selectRandomDestination(shortlist, () => 0.999999), shortlist[2]);
});

test("selectRandomDestination safely returns null for an empty or invalid shortlist", () => {
  assert.equal(selectRandomDestination([], () => 0.5), null);
  assert.equal(selectRandomDestination(null, () => 0.5), null);
});

test("selectRandomDestination safely rejects invalid random generators", () => {
  const shortlist = [{ id: "a" }, { id: "b" }];

  assert.equal(selectRandomDestination(shortlist, null), null);
  assert.equal(selectRandomDestination(shortlist, () => Number.NaN), null);
  assert.equal(selectRandomDestination(shortlist, () => Number.POSITIVE_INFINITY), null);
});

test("selectRandomDestination handles an out-of-range random sample defensively", () => {
  const shortlist = [{ id: "a" }, { id: "b" }];

  assert.ok(shortlist.includes(selectRandomDestination(shortlist, () => 1)));
  assert.ok(shortlist.includes(selectRandomDestination(shortlist, () => -1)));
});

test("parseDriveEstimate extracts distance and duration from a route-day drive string", () => {
  assert.deepEqual(parseDriveEstimate("약 45km · 1시간 10분"), {
    kilometers: 45,
    minutes: 70,
  });
});

test("summarizeRouteMetrics totals the visible route-day drive estimates", () => {
  const route = {
    days: [
      { drive: "약 45km · 1시간 10분" },
      { drive: "약 75km · 2시간" },
    ],
  };

  assert.deepEqual(summarizeRouteMetrics(route), {
    kilometers: 120,
    minutes: 190,
  });
});

test("formatRouteEstimate renders the compact dashboard copy for combined metrics", () => {
  assert.equal(
    formatRouteEstimate({ kilometers: 120, minutes: 190 }),
    "약 120km · 3시간 10분",
  );
});

test("all curated routes expose stable at-a-glance driving totals", () => {
  const expectedMetrics = new Map([
    ["kumamoto-aso/2n3d", { kilometers: 185, minutes: 280 }],
    ["kumamoto-aso/3n4d", { kilometers: 270, minutes: 360 }],
    ["takamatsu-sanuki/2n3d", { kilometers: 160, minutes: 195 }],
    ["takamatsu-sanuki/3n4d", { kilometers: 230, minutes: 310 }],
    ["yonago-san-in/2n3d", { kilometers: 155, minutes: 160 }],
    ["yonago-san-in/3n4d", { kilometers: 275, minutes: 325 }],
  ]);

  for (const item of destinations) {
    for (const route of item.routes) {
      const routeId = `${item.id}/${route.duration}`;
      const metrics = summarizeRouteMetrics(route);

      assert.deepEqual(metrics, expectedMetrics.get(routeId), routeId);
      assert.match(
        formatRouteEstimate(metrics),
        /^약 \d+km · \d+시간 \d+분$/,
        routeId,
      );
    }
  }
});

test("drive estimate formatting degrades safely for partial or unavailable copy", () => {
  assert.deepEqual(parseDriveEstimate("약 35km"), {
    kilometers: 35,
    minutes: null,
  });
  assert.deepEqual(parseDriveEstimate("약 50분"), {
    kilometers: null,
    minutes: 50,
  });
  assert.equal(parseDriveEstimate("운전 정보 확인 필요"), null);
  assert.equal(formatRouteEstimate(null), "표기된 운전 정보 없음");
});

test("normalizeFlightDeals keeps valid offers sorted by price and capped at five", () => {
  const makeOffer = (id, price) => ({
    id,
    origin: "ICN",
    destination: "TAK",
    destinationName: "다카마쓰",
    outboundDate: "2026-11-01",
    returnDate: "2026-11-03",
    nights: 2,
    price,
    currency: "KRW",
    airlines: ["테스트항공"],
  });
  const offers = [6, 1, 4, 2, 5, 3].map((price) =>
    makeOffer(String(price), price * 100000),
  );
  offers.push({ id: "invalid", price: -1 });

  assert.deepEqual(
    normalizeFlightDeals({ status: "ok", offers }).map((offer) => offer.id),
    ["1", "2", "3", "4", "5"],
  );
  assert.deepEqual(normalizeFlightDeals({ status: "error", offers }), []);
  assert.deepEqual(normalizeFlightDeals(null), []);
});

test("normalizeFlightDeals honors a smaller positive display limit without mutating offers", () => {
  const offers = [300000, 100000, 200000].map((price, index) => ({
    id: String(index),
    origin: "ICN",
    destination: "TAK",
    destinationName: "다카마쓰",
    outboundDate: "2026-11-01",
    returnDate: "2026-11-03",
    nights: 2,
    price,
    currency: "KRW",
    airlines: ["테스트항공"],
  }));
  const originalOrder = offers.map((offer) => offer.price);

  assert.deepEqual(
    normalizeFlightDeals({ status: "ok", offers }, 2).map(
      (offer) => offer.price,
    ),
    [100000, 200000],
  );
  assert.deepEqual(
    offers.map((offer) => offer.price),
    originalOrder,
  );
});

test("getRouteForDuration returns the matching curated route and no foreign route", () => {
  assert.equal(getRouteForDuration(destination, "3n4d"), routes[1]);
  assert.equal(getRouteForDuration(destination, "missing"), null);
  assert.equal(getRouteForDuration(null, "2n3d"), null);
});

test("getDefaultDuration selects the first available route duration", () => {
  assert.equal(getDefaultDuration(destination), "2n3d");
  assert.equal(getDefaultDuration({ routes: [] }), null);
  assert.equal(getDefaultDuration(null), null);
});

test("createRouteDetailUrl addresses all six curated destination-duration routes", () => {
  const urls = destinations.flatMap((item) =>
    item.routes.map((route) =>
      createRouteDetailUrl(item.id, route.duration),
    ),
  );

  assert.equal(urls.length, 6);
  assert.equal(new Set(urls).size, 6);
  assert.deepEqual(urls, [
    "./route.html?destination=kumamoto-aso&duration=2n3d",
    "./route.html?destination=kumamoto-aso&duration=3n4d",
    "./route.html?destination=takamatsu-sanuki&duration=2n3d",
    "./route.html?destination=takamatsu-sanuki&duration=3n4d",
    "./route.html?destination=yonago-san-in&duration=2n3d",
    "./route.html?destination=yonago-san-in&duration=3n4d",
  ]);
});

test("createRouteDetailUrl rejects incomplete route identities", () => {
  assert.equal(createRouteDetailUrl("", "2n3d"), null);
  assert.equal(createRouteDetailUrl("kumamoto-aso", ""), null);
  assert.equal(createRouteDetailUrl(null, "2n3d"), null);
});

test("normalizeDestinations removes malformed records and duplicate ids", () => {
  const validA = createValidDestination("a");
  const validB = createValidDestination("b");
  const source = [validA, null, { name: "no id" }, validA, validB];

  assert.deepEqual(normalizeDestinations(source), [validA, validB]);
  assert.deepEqual(source, [validA, null, { name: "no id" }, validA, validB]);
  assert.deepEqual(normalizeDestinations(null), []);
});

test("initApp returns null when the DOM is unavailable", async () => {
  const { initApp } = await import("../src/app.js");

  assert.equal(initApp(), null);
});
