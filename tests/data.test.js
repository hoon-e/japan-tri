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
  const routeIds = new Set();

  for (const destination of destinations) {
    assert.ok(destination.routes.length >= 2, `${destination.id} needs at least two routes`);

    const durations = new Set();
    for (const route of destination.routes) {
      assert.ok(route.duration);
      assert.ok(route.label);
      assert.ok(route.summary);
      assert.ok(!durations.has(route.duration), `${destination.id} repeats ${route.duration}`);
      durations.add(route.duration);
      routeIds.add(`${destination.id}/${route.duration}`);
      assert.ok(route.days.length >= 3, `${destination.id}/${route.duration} has too few days`);

      route.days.forEach((day, index) => {
        assert.equal(day.day, index + 1);
        assert.ok(day.title);
        assert.ok(day.base);
        assert.ok(day.drive);
        assert.ok(Array.isArray(day.stops));
        assert.ok(day.stops.length >= 1);
        assert.ok(day.stops.every((stop) => typeof stop === "string" && stop.trim()));
        assert.ok(Array.isArray(day.mapStops));
        assert.equal(day.mapStops.length, day.stops.length);

        day.mapStops.forEach((mapStop, stopIndex) => {
          assert.equal(mapStop.name, day.stops[stopIndex]);
          assert.ok(Array.isArray(mapStop.coordinates));
          assert.equal(mapStop.coordinates.length, 2);

          const [latitude, longitude] = mapStop.coordinates;
          assert.ok(Number.isFinite(latitude));
          assert.ok(Number.isFinite(longitude));
          assert.ok(latitude >= 24 && latitude <= 46, `${mapStop.name} latitude is outside Japan`);
          assert.ok(longitude >= 122 && longitude <= 146, `${mapStop.name} longitude is outside Japan`);
        });
      });
    }
  }

  assert.deepEqual(
    [...routeIds].sort(),
    [
      "kumamoto-aso/2n3d",
      "kumamoto-aso/3n4d",
      "takamatsu-sanuki/2n3d",
      "takamatsu-sanuki/3n4d",
      "yonago-san-in/2n3d",
      "yonago-san-in/3n4d",
    ],
  );
});

test("all six routes provide ordered, bounded map coordinates for every stop", () => {
  const routes = destinations.flatMap((destination) =>
    destination.routes.map((route) => ({ destination, route })),
  );

  assert.equal(routes.length, 6);

  for (const { destination, route } of routes) {
    for (const day of route.days) {
      assert.ok(
        Array.isArray(day.mapStops),
        `${destination.id}/${route.duration}/day-${day.day} needs mapStops`,
      );
      assert.equal(
        day.mapStops.length,
        day.stops.length,
        `${destination.id}/${route.duration}/day-${day.day} map and text stop counts differ`,
      );
      assert.deepEqual(
        day.mapStops.map((stop) => stop.name),
        day.stops,
        `${destination.id}/${route.duration}/day-${day.day} map order differs`,
      );

      for (const stop of day.mapStops) {
        assert.equal(typeof stop.name, "string");
        assert.ok(stop.name.trim());
        assert.ok(Array.isArray(stop.coordinates));
        assert.equal(stop.coordinates.length, 2);
        const [latitude, longitude] = stop.coordinates;
        assert.ok(Number.isFinite(latitude));
        assert.ok(Number.isFinite(longitude));
        assert.ok(latitude >= -90 && latitude <= 90);
        assert.ok(longitude >= -180 && longitude <= 180);
      }
    }
  }
});
