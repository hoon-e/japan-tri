import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export const FLIGHT_SEARCH_CONFIG = {
  departureAirports: ["ICN", "GMP"],
  destinationAirports: ["KMJ", "TAK", "YGJ"],
  destinationNames: {
    KMJ: "구마모토",
    TAK: "다카마쓰",
    YGJ: "요나고",
  },
  outboundStart: "2026-11-01",
  outboundEnd: "2026-11-14",
  tripNights: [2, 3],
  adults: 5,
  currency: "KRW",
  nonstopOnly: true,
};

function addUtcDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function listUtcDates(start, end) {
  const dates = [];
  let current = start;

  while (current <= end) {
    dates.push(current);
    current = addUtcDays(current, 1);
  }

  return dates;
}

export function buildFlightSearches(config = FLIGHT_SEARCH_CONFIG) {
  return listUtcDates(config.outboundStart, config.outboundEnd).flatMap(
    (outboundDate) =>
      config.tripNights.map((nights) => ({
        outboundDate,
        returnDate: addUtcDays(outboundDate, nights),
        nights,
      })),
  );
}

export function buildSerpApiUrl(
  search,
  apiKey,
  config = FLIGHT_SEARCH_CONFIG,
) {
  const params = new URLSearchParams({
    engine: "google_flights",
    departure_id: config.departureAirports.join(","),
    arrival_id: config.destinationAirports.join(","),
    outbound_date: search.outboundDate,
    return_date: search.returnDate,
    currency: config.currency,
    hl: "ko",
    gl: "kr",
    type: "1",
    travel_class: "1",
    adults: String(config.adults),
    stops: config.nonstopOnly ? "1" : "0",
    no_cache: "true",
    api_key: apiKey,
  });

  return `https://serpapi.com/search.json?${params}`;
}

function uniqueStrings(values) {
  return [...new Set(values.filter((value) => typeof value === "string"))];
}

export function extractFlightCandidates(
  payload,
  search,
  config = FLIGHT_SEARCH_CONFIG,
) {
  const results = [
    ...(Array.isArray(payload?.best_flights) ? payload.best_flights : []),
    ...(Array.isArray(payload?.other_flights) ? payload.other_flights : []),
  ];
  const bookingUrl = payload?.search_metadata?.google_flights_url ?? null;

  return results.flatMap((result) => {
    const segments = Array.isArray(result?.flights) ? result.flights : [];
    if (segments.length === 0) return [];

    const firstSegment = segments[0];
    const lastSegment = segments.at(-1);
    const origin = firstSegment?.departure_airport?.id;
    const destination = lastSegment?.arrival_airport?.id;
    const price = Number(result?.price);

    if (
      !config.departureAirports.includes(origin) ||
      !config.destinationAirports.includes(destination) ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return [];
    }

    if (config.nonstopOnly && segments.length !== 1) return [];

    const airlines = uniqueStrings(
      segments.map((segment) => segment?.airline),
    );
    if (airlines.length === 0) return [];

    const flightNumbers = uniqueStrings(
      segments.map((segment) => segment?.flight_number),
    );
    const idParts = [
      origin,
      destination,
      search.outboundDate,
      search.returnDate,
      flightNumbers.join("-"),
      price,
    ];

    return [
      {
        id: idParts.join(":"),
        origin,
        destination,
        destinationName: config.destinationNames[destination] ?? destination,
        outboundDate: search.outboundDate,
        returnDate: search.returnDate,
        nights: search.nights,
        price,
        currency: config.currency,
        airlines,
        flightNumbers,
        durationMinutes: Number(result?.total_duration) || null,
        bookingUrl,
      },
    ];
  });
}

export function rankFlightCandidates(candidates, limit = 5) {
  const unique = new Map();

  candidates.forEach((candidate) => {
    if (!candidate?.id || !Number.isFinite(candidate.price)) return;
    const current = unique.get(candidate.id);
    if (!current || candidate.price < current.price) {
      unique.set(candidate.id, candidate);
    }
  });

  return [...unique.values()]
    .sort((a, b) => a.price - b.price)
    .slice(0, limit);
}

async function mapWithConcurrency(items, concurrency, task) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await task(items[index], index);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(concurrency, items.length) },
      () => worker(),
    ),
  );
  return results;
}

export async function fetchFlightPriceSnapshot({
  apiKey,
  fetchImpl = fetch,
  config = FLIGHT_SEARCH_CONFIG,
}) {
  if (!apiKey) {
    throw new Error("SERPAPI_KEY is required");
  }

  const searches = buildFlightSearches(config);
  const errors = [];
  const batches = await mapWithConcurrency(searches, 3, async (search) => {
    const response = await fetchImpl(buildSerpApiUrl(search, apiKey, config));

    if (!response.ok) {
      errors.push(`${search.outboundDate}/${search.nights}박: HTTP ${response.status}`);
      return [];
    }

    const payload = await response.json();
    if (payload?.error) {
      errors.push(`${search.outboundDate}/${search.nights}박: ${payload.error}`);
      return [];
    }

    return extractFlightCandidates(payload, search, config);
  });
  const offers = rankFlightCandidates(batches.flat());

  if (offers.length === 0) {
    throw new Error(
      `No matching nonstop flight offers were returned. ${errors.join(" | ")}`,
    );
  }

  return {
    status: "ok",
    message: null,
    updatedAt: new Date().toISOString(),
    source: "SerpApi Google Flights",
    search: {
      departureAirports: config.departureAirports,
      destinationAirports: config.destinationAirports,
      outboundStart: config.outboundStart,
      outboundEnd: config.outboundEnd,
      tripNights: config.tripNights,
      adults: config.adults,
      currency: config.currency,
      nonstopOnly: config.nonstopOnly,
    },
    offers,
    partialErrors: errors,
  };
}

async function main() {
  const snapshot = await fetchFlightPriceSnapshot({
    apiKey: process.env.SERPAPI_KEY,
  });
  const outputUrl = new URL("../src/flight-prices.json", import.meta.url);
  await writeFile(outputUrl, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(
    `Updated ${snapshot.offers.length} flight deals at ${snapshot.updatedAt}`,
  );
}

const isDirectRun =
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirectRun) {
  await main();
}
