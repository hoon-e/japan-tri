import test from "node:test";
import assert from "node:assert/strict";

import {
  createRouteDetailUrl,
  formatRouteEstimate,
  getDefaultDuration,
  getRouteForDuration,
  isValidTravelLink,
  normalizeDestinations,
  parseDriveEstimate,
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

test("drive estimates normalize the curated Korean distance and duration strings", () => {
  assert.deepEqual(parseDriveEstimate("약 75km · 2시간"), {
    kilometers: 75,
    minutes: 120,
  });
  assert.deepEqual(parseDriveEstimate("약 25km · 45분"), {
    kilometers: 25,
    minutes: 45,
  });
  assert.deepEqual(parseDriveEstimate("약 1,200km"), {
    kilometers: 1200,
    minutes: null,
  });
  assert.equal(parseDriveEstimate("운전 정보 확인"), null);
  assert.equal(parseDriveEstimate(null), null);
});

test("all curated routes expose finite at-a-glance driving totals", () => {
  const summaries = destinations.flatMap((item) =>
    item.routes.map((route) => summarizeRouteMetrics(route)),
  );

  assert.deepEqual(summaries, [
    { kilometers: 160, minutes: 240 },
    { kilometers: 230, minutes: 350 },
    { kilometers: 155, minutes: 215 },
    { kilometers: 275, minutes: 380 },
    { kilometers: 205, minutes: 285 },
    { kilometers: 315, minutes: 430 },
    { kilometers: 195, minutes: 275 },
    { kilometers: 305, minutes: 435 },
    { kilometers: 180, minutes: 270 },
    { kilometers: 455, minutes: 590 },
  ]);
  assert.ok(
    summaries.every(
      (metrics) =>
        Number.isFinite(metrics.kilometers) &&
        Number.isFinite(metrics.minutes),
    ),
  );
  assert.equal(summarizeRouteMetrics({ days: [{ drive: "확인 필요" }] }), null);
  assert.deepEqual(
    summarizeRouteMetrics({
      days: [
        { drive: "약 30km · 50분" },
        { drive: "약 40km · 시간 확인 필요" },
      ],
    }),
    { kilometers: 70, minutes: null },
  );
});

test("route metric labels remain compact and omit empty minute components", () => {
  assert.equal(
    formatRouteEstimate({ kilometers: 185, minutes: 280 }),
    "약 185km · 4시간 40분",
  );
  assert.equal(
    formatRouteEstimate({ kilometers: 270, minutes: 360 }),
    "약 270km · 6시간",
  );
  assert.equal(formatRouteEstimate(null), "표기된 운전 정보 없음");
});

test("createRouteDetailUrl addresses all ten curated destination-duration routes", () => {
  const urls = destinations.flatMap((item) =>
    item.routes.map((route) =>
      createRouteDetailUrl(item.id, route.duration),
    ),
  );

  assert.equal(urls.length, 10);
  assert.equal(new Set(urls).size, 10);
  assert.deepEqual(urls, [
    "./route.html?destination=takamatsu-sanuki&duration=2n3d",
    "./route.html?destination=takamatsu-sanuki&duration=3n4d",
    "./route.html?destination=yonago-san-in&duration=2n3d",
    "./route.html?destination=yonago-san-in&duration=3n4d",
    "./route.html?destination=matsuyama-ehime&duration=2n3d",
    "./route.html?destination=matsuyama-ehime&duration=3n4d",
    "./route.html?destination=saga-ureshino-arita&duration=2n3d",
    "./route.html?destination=saga-ureshino-arita&duration=3n4d",
    "./route.html?destination=miyazaki-takachiho-nichinan&duration=2n3d",
    "./route.html?destination=miyazaki-takachiho-nichinan&duration=3n4d",
  ]);
});

test("createRouteDetailUrl rejects incomplete route identities", () => {
  assert.equal(createRouteDetailUrl("", "2n3d"), null);
  assert.equal(createRouteDetailUrl("takamatsu-sanuki", ""), null);
  assert.equal(createRouteDetailUrl(null, "2n3d"), null);
});

test("travel reference links accept only categorized HTTPS destinations", () => {
  assert.equal(
    isValidTravelLink({
      category: "관광·명소",
      label: "공식 관광 가이드",
      url: "https://example.com/guide",
    }),
    true,
  );
  assert.equal(
    isValidTravelLink({
      category: "관광·명소",
      label: "안전하지 않은 링크",
      url: "http://example.com/guide",
    }),
    false,
  );
  assert.equal(
    isValidTravelLink({ category: "", label: "누락", url: "https://example.com" }),
    false,
  );
  assert.equal(isValidTravelLink(null), false);
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
