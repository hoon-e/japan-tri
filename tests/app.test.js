import test from "node:test";
import assert from "node:assert/strict";

import {
  getDefaultDuration,
  getRouteForDuration,
  normalizeDestinations,
  selectRandomDestination,
} from "../src/app.js";

const routes = [
  { duration: "2n3d", label: "2박 3일", days: [{ day: 1 }] },
  { duration: "3n4d", label: "3박 4일", days: [{ day: 1 }] },
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

test("selectRandomDestination handles an out-of-range random sample defensively", () => {
  const shortlist = [{ id: "a" }, { id: "b" }];

  assert.ok(shortlist.includes(selectRandomDestination(shortlist, () => 1)));
  assert.ok(shortlist.includes(selectRandomDestination(shortlist, () => -1)));
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

test("normalizeDestinations removes malformed records and duplicate ids", () => {
  const validA = createValidDestination("a");
  const validB = createValidDestination("b");

  assert.deepEqual(
    normalizeDestinations([
      validA,
      null,
      { name: "no id" },
      validA,
      validB,
    ]),
    [validA, validB],
  );
  assert.deepEqual(normalizeDestinations(null), []);
});
