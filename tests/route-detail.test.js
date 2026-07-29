import test from "node:test";
import assert from "node:assert/strict";

import {
  getDayColor,
  getRouteSelection,
  isValidMapStop,
} from "../src/route-detail.js";
import { destinations } from "../src/data.js";

test("getRouteSelection resolves all six canonical detail URLs", () => {
  const selections = destinations.flatMap((destination) =>
    destination.routes.map((route) =>
      getRouteSelection(
        `?destination=${encodeURIComponent(destination.id)}&duration=${encodeURIComponent(route.duration)}`,
      ),
    ),
  );

  assert.equal(selections.length, 6);
  assert.ok(selections.every(Boolean));
  assert.deepEqual(
    selections.map(({ destination, route }) => [
      destination.id,
      route.duration,
    ]),
    destinations.flatMap((destination) =>
      destination.routes.map((route) => [destination.id, route.duration]),
    ),
  );
});

test("getRouteSelection rejects missing, unsupported, and mismatched queries", () => {
  assert.equal(getRouteSelection(""), null);
  assert.equal(getRouteSelection("?destination=kumamoto-aso"), null);
  assert.equal(
    getRouteSelection("?destination=kumamoto-aso&duration=one-week"),
    null,
  );
  assert.equal(
    getRouteSelection("?destination=unknown&duration=2n3d"),
    null,
  );
});

test("isValidMapStop accepts bounded coordinates and rejects malformed points", () => {
  assert.equal(
    isValidMapStop({ name: "아소 신사", coordinates: [32.947, 131.117] }),
    true,
  );
  assert.equal(
    isValidMapStop({ name: "", coordinates: [32.947, 131.117] }),
    false,
  );
  assert.equal(
    isValidMapStop({ name: "북극 밖", coordinates: [91, 131.117] }),
    false,
  );
  assert.equal(
    isValidMapStop({ name: "경도 밖", coordinates: [32.947, 181] }),
    false,
  );
  assert.equal(
    isValidMapStop({ name: "문자열 좌표", coordinates: ["32.947", 131.117] }),
    false,
  );
});

test("getDayColor provides a stable visible color for every itinerary day", () => {
  const colors = [1, 2, 3, 4].map(getDayColor);

  assert.ok(colors.every((color) => /^#[0-9a-f]{6}$/i.test(color)));
  assert.equal(new Set(colors).size, 4);
});
