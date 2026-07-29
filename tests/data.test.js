import test from "node:test";
import assert from "node:assert/strict";

import { destinations } from "../src/data.js";

const requiredTextFields = [
  "id",
  "name",
  "region",
  "airport",
  "image",
  "imageAlt",
  "summary",
  "directFlightReason",
  "driveReason",
  "recommendedDuration",
  "seasons",
];

test("the public shortlist contains unique, fully described destinations", () => {
  assert.ok(Array.isArray(destinations));
  assert.ok(destinations.length >= 3, "the shortlist should remain meaningfully comparable");

  const ids = new Set();
  for (const destination of destinations) {
    for (const field of requiredTextFields) {
      assert.equal(typeof destination[field], "string", `${destination.id ?? "unknown"}.${field}`);
      assert.ok(destination[field].trim(), `${destination.id ?? "unknown"}.${field} is required`);
    }

    assert.ok(!ids.has(destination.id), `duplicate destination id: ${destination.id}`);
    ids.add(destination.id);
    assert.ok(destination.directFlightReason.match(/인천|김포/));
    assert.ok(destination.highlights.length >= 2);
    assert.ok(destination.drivingNotes.length >= 1);
    assert.ok(destination.highlights.every((item) => item.trim().length > 0));
    assert.ok(destination.drivingNotes.every((item) => item.trim().length > 0));
  }
});

test("every destination has complete, internally consistent duration routes", () => {
  for (const destination of destinations) {
    assert.ok(destination.routes.length >= 2, `${destination.id} needs at least two routes`);

    const durations = new Set();
    for (const route of destination.routes) {
      assert.ok(route.duration);
      assert.ok(route.label);
      assert.ok(route.summary);
      assert.ok(!durations.has(route.duration), `${destination.id} repeats ${route.duration}`);
      durations.add(route.duration);
      assert.ok(route.days.length >= 3, `${destination.id}/${route.duration} has too few days`);

      route.days.forEach((day, index) => {
        assert.equal(day.day, index + 1);
        assert.ok(day.title);
        assert.ok(day.base);
        assert.ok(day.drive);
        assert.ok(Array.isArray(day.stops));
        assert.ok(day.stops.length >= 1);
        assert.ok(day.stops.every((stop) => typeof stop === "string" && stop.trim()));
      });
    }
  }
});
