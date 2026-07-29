import test from "node:test";
import assert from "node:assert/strict";

import {
  buildFlightSearches,
  buildSerpApiUrl,
  extractFlightCandidates,
  rankFlightCandidates,
} from "../scripts/update-flight-prices.mjs";

test("buildFlightSearches covers both November weeks and both trip lengths", () => {
  const searches = buildFlightSearches();

  assert.equal(searches.length, 28);
  assert.deepEqual(searches[0], {
    outboundDate: "2026-11-01",
    returnDate: "2026-11-03",
    nights: 2,
  });
  assert.deepEqual(searches.at(-1), {
    outboundDate: "2026-11-14",
    returnDate: "2026-11-17",
    nights: 3,
  });
});

test("buildSerpApiUrl requests five-adult nonstop round trips without exposing the key elsewhere", () => {
  const url = new URL(
    buildSerpApiUrl(
      {
        outboundDate: "2026-11-01",
        returnDate: "2026-11-03",
        nights: 2,
      },
      "secret-test-key",
    ),
  );

  assert.equal(url.origin, "https://serpapi.com");
  assert.equal(url.searchParams.get("departure_id"), "ICN,GMP");
  assert.equal(url.searchParams.get("arrival_id"), "TAK,YGJ");
  assert.equal(url.searchParams.get("adults"), "5");
  assert.equal(url.searchParams.get("stops"), "1");
  assert.equal(url.searchParams.get("currency"), "KRW");
  assert.equal(url.searchParams.get("api_key"), "secret-test-key");
});

test("extractFlightCandidates keeps matching direct routes and ignores connections", () => {
  const search = {
    outboundDate: "2026-11-01",
    returnDate: "2026-11-03",
    nights: 2,
  };
  const direct = {
    price: 700000,
    total_duration: 95,
    flights: [
      {
        departure_airport: { id: "ICN" },
        arrival_airport: { id: "TAK" },
        airline: "에어서울",
        flight_number: "RS741",
      },
    ],
  };
  const connection = {
    price: 500000,
    flights: [
      {
        departure_airport: { id: "ICN" },
        arrival_airport: { id: "KIX" },
        airline: "테스트항공",
        flight_number: "TT100",
      },
      {
        departure_airport: { id: "KIX" },
        arrival_airport: { id: "TAK" },
        airline: "테스트항공",
        flight_number: "TT200",
      },
    ],
  };
  const candidates = extractFlightCandidates(
    {
      search_metadata: {
        google_flights_url: "https://www.google.com/travel/flights",
      },
      best_flights: [direct, connection],
    },
    search,
  );

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].destinationName, "다카마쓰");
  assert.equal(candidates[0].price, 700000);
  assert.deepEqual(candidates[0].airlines, ["에어서울"]);
});

test("rankFlightCandidates deduplicates and returns the five cheapest offers", () => {
  const candidates = [8, 1, 6, 2, 7, 3, 5, 4].map((price) => ({
    id: String(price),
    price,
  }));
  candidates.push({ id: "1", price: 9 });

  assert.deepEqual(
    rankFlightCandidates(candidates).map((candidate) => candidate.price),
    [1, 2, 3, 4, 5],
  );
});
