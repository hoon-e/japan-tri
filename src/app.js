import { destinations } from "./data.js";

const REQUIRED_DESTINATION_FIELDS = [
  "id",
  "name",
  "airport",
  "summary",
  "directFlightReason",
  "driveReason",
  "region",
  "image",
  "recommendedDuration",
  "seasons",
];

const REQUIRED_ROUTE_FIELDS = ["duration", "label", "summary"];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidRouteDay(day) {
  return (
    day &&
    typeof day === "object" &&
    Number.isInteger(day.day) &&
    isNonEmptyString(day.title) &&
    isNonEmptyString(day.base) &&
    isNonEmptyString(day.drive) &&
    Array.isArray(day.stops) &&
    day.stops.length > 0 &&
    day.stops.every(isNonEmptyString)
  );
}

function isValidRoute(route) {
  return (
    route &&
    typeof route === "object" &&
    REQUIRED_ROUTE_FIELDS.every((field) => isNonEmptyString(route[field])) &&
    Array.isArray(route.days) &&
    route.days.length > 0 &&
    route.days.every(isValidRouteDay)
  );
}

function selectRandomItem(items, random = Math.random) {
  const candidates = Array.isArray(items) ? items : [];
  if (candidates.length === 0 || typeof random !== "function") return null;

  const randomValue = Number(random());
  if (!Number.isFinite(randomValue)) return null;

  const boundedValue = Math.min(Math.max(randomValue, 0), 1 - Number.EPSILON);
  return candidates[Math.floor(boundedValue * candidates.length)] ?? null;
}

/**
 * Return unique, addressable destination records.
 *
 * Detailed content integrity is validated independently so this boundary can
 * also normalize lightweight records in unit tests and future data tooling.
 * The function does not mutate the supplied array.
 */
export function normalizeDestinations(items) {
  if (!Array.isArray(items)) return [];

  const seenIds = new Set();

  return items.filter((item) => {
    if (!item || typeof item !== "object") return false;

    const hasIdentity =
      isNonEmptyString(item.id) &&
      isNonEmptyString(item.name) &&
      Array.isArray(item.routes);

    if (!hasIdentity || seenIds.has(item.id)) return false;

    seenIds.add(item.id);
    return true;
  });
}

/**
 * Select exactly one item from the supplied shortlist.
 * Invalid or empty input safely returns null.
 */
export function selectRandomDestination(items, random = Math.random) {
  return selectRandomItem(items, random);
}

export function getRouteForDuration(destination, duration) {
  if (!destination || !Array.isArray(destination.routes)) return null;
  return (
    destination.routes.find((route) => route.duration === duration) ?? null
  );
}

export function getDefaultDuration(destination) {
  if (!destination || !Array.isArray(destination.routes)) return null;
  return destination.routes[0]?.duration ?? null;
}

export function createRouteDetailUrl(destinationId, duration) {
  if (!isNonEmptyString(destinationId) || !isNonEmptyString(duration)) {
    return null;
  }

  const params = new URLSearchParams({
    destination: destinationId,
    duration,
  });
  return `./route.html?${params.toString()}`;
}

function isSafeHttpUrl(value) {
  if (!isNonEmptyString(value)) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isValidFlightDeal(offer) {
  return (
    offer &&
    typeof offer === "object" &&
    isNonEmptyString(offer.id) &&
    isNonEmptyString(offer.origin) &&
    isNonEmptyString(offer.destination) &&
    isNonEmptyString(offer.destinationName) &&
    isNonEmptyString(offer.outboundDate) &&
    isNonEmptyString(offer.returnDate) &&
    Number.isInteger(offer.nights) &&
    offer.nights > 0 &&
    Number.isFinite(Number(offer.price)) &&
    Number(offer.price) > 0 &&
    isNonEmptyString(offer.currency) &&
    Array.isArray(offer.airlines) &&
    offer.airlines.length > 0 &&
    offer.airlines.every(isNonEmptyString)
  );
}

export function normalizeFlightDeals(payload, limit = 5) {
  if (!payload || payload.status !== "ok" || !Array.isArray(payload.offers)) {
    return [];
  }

  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 5;
  return payload.offers
    .filter(isValidFlightDeal)
    .map((offer) => ({ ...offer, price: Number(offer.price) }))
    .sort((a, b) => a.price - b.price)
    .slice(0, safeLimit);
}

function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);
  if (options.className) element.className = options.className;
  if (options.text) element.textContent = options.text;
  return element;
}

function renderDestinationCard(destination) {
  const card = createElement("article", { className: "destination-card" });
  const image = createElement("img");
  image.src = destination.image;
  image.alt = destination.imageAlt || "";
  image.loading = "lazy";
  image.width = 640;
  image.height = 420;

  const body = createElement("div", { className: "destination-card__body" });
  const region = createElement("p", {
    className: "destination-card__region",
    text: destination.region,
  });
  const heading = createElement("h3", { text: destination.name });
  const airport = createElement("p", {
    className: "destination-card__airport",
    text: `도착 거점 · ${destination.airport}`,
  });
  const summary = createElement("p", { text: destination.summary });

  const reasons = createElement("dl", { className: "destination-reasons" });
  [
    ["직항 접근성", destination.directFlightReason],
    ["드라이브 적합성", destination.driveReason],
  ].forEach(([term, description]) => {
    reasons.append(
      createElement("dt", { text: term }),
      createElement("dd", { text: description }),
    );
  });

  const highlights = createElement("ul", {
    className: "tag-list",
  });
  highlights.setAttribute("aria-label", "대표 방문지");
  (destination.highlights ?? []).forEach((highlight) => {
    highlights.append(createElement("li", { text: highlight }));
  });

  const duration = createElement("p", {
    className: "destination-card__duration",
    text: `추천 일정 · ${destination.recommendedDuration}`,
  });

  body.append(region, heading, airport, summary, reasons, highlights, duration);
  card.append(image, body);
  return card;
}

function renderShortlist(shortlist, elements) {
  elements.destinationList.replaceChildren();
  elements.shortlistCount.textContent = `총 ${shortlist.length}곳`;

  if (shortlist.length === 0) {
    elements.emptyState.hidden = false;
    elements.drawButton.disabled = true;
    elements.drawButton.setAttribute("aria-disabled", "true");
    return;
  }

  elements.emptyState.hidden = true;
  elements.drawButton.disabled = false;
  elements.drawButton.removeAttribute("aria-disabled");
  shortlist.forEach((destination) => {
    elements.destinationList.append(renderDestinationCard(destination));
  });
}

function renderRoute(destination, route, panel) {
  panel.replaceChildren();

  if (!route) {
    panel.removeAttribute("role");
    panel.removeAttribute("aria-labelledby");
    panel.removeAttribute("tabindex");
    panel.append(
      createElement("p", {
        className: "empty-state",
        text: "선택한 기간의 루트를 찾을 수 없습니다.",
      }),
    );
    return;
  }

  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", `route-tab-${route.duration}`);
  panel.tabIndex = 0;

  const intro = createElement("p", {
    className: "route-summary",
    text: route.summary,
  });
  const detailUrl = createRouteDetailUrl(destination?.id, route.duration);
  const detailLink = detailUrl
    ? createElement("a", {
        className: "route-detail-link",
        text: `${route.label} 지도와 상세 일정 보기`,
      })
    : null;
  if (detailLink) {
    detailLink.href = detailUrl;
    detailLink.setAttribute(
      "aria-label",
      `${destination.name} ${route.label} 지도와 상세 일정 보기`,
    );
  }
  const days = createElement("ol", { className: "route-days" });

  route.days.forEach((day) => {
    const item = createElement("li", { className: "route-day" });
    const label = createElement("p", {
      className: "route-day__label",
      text: `${day.day}일차`,
    });
    const title = createElement("h4", { text: day.title });
    const meta = createElement("p", {
      className: "route-day__meta",
      text: `${day.drive} · ${day.base}`,
    });
    const stops = createElement("p", {
      text: day.stops.join(" → "),
    });
    item.append(label, title, meta, stops);
    days.append(item);
  });

  panel.append(intro);
  if (detailLink) panel.append(detailLink);
  panel.append(days);
}

function setActiveRoute(destination, duration, elements, focusTab = false) {
  const route = getRouteForDuration(destination, duration);
  if (!route) {
    renderRoute(destination, null, elements.routePanel);
    return;
  }

  const tabs = [...elements.routeTabs.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab) => {
    const isActive = tab.dataset.routeDuration === duration;
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    tab.classList.toggle("is-active", isActive);
  });
  renderRoute(destination, route, elements.routePanel);

  if (focusTab) {
    tabs.find((tab) => tab.dataset.routeDuration === duration)?.focus();
  }
}

function renderRouteTabs(destination, elements) {
  elements.routeTabs.replaceChildren();

  destination.routes.forEach((route) => {
    const tab = createElement("button", {
      className: "route-tab",
      text: route.label,
    });
    tab.type = "button";
    tab.id = `route-tab-${route.duration}`;
    tab.dataset.routeDuration = route.duration;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", "route-panel");
    tab.setAttribute("aria-selected", "false");
    tab.tabIndex = -1;
    tab.addEventListener("click", () => {
      setActiveRoute(destination, route.duration, elements);
    });
    elements.routeTabs.append(tab);
  });

  elements.routeTabs.onkeydown = (event) => {
    const tabs = [...elements.routeTabs.querySelectorAll('[role="tab"]')];
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex < 0) return;

    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft")
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    setActiveRoute(
      destination,
      tabs[nextIndex].dataset.routeDuration,
      elements,
      true,
    );
  };

  const defaultDuration = getDefaultDuration(destination);
  if (defaultDuration) setActiveRoute(destination, defaultDuration, elements);
}

function renderResult(destination, elements) {
  elements.resultContent.replaceChildren();

  if (!destination) {
    elements.resultContent.append(
      createElement("p", {
        className: "empty-state",
        text: "여행지를 선택하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      }),
    );
    elements.routeTabs.replaceChildren();
    renderRoute(null, null, elements.routePanel);
    elements.result.hidden = false;
    return;
  }

  const heading = createElement("h3", { text: destination.name });
  const summary = createElement("p", { text: destination.summary });
  const airport = createElement("p", {
    className: "result-airport",
    text: `렌터카 시작점 · ${destination.airport}`,
  });
  const seasonHeading = createElement("h4", { text: "언제 가면 좋을까요?" });
  const season = createElement("p", { text: destination.seasons });
  const notesHeading = createElement("h4", { text: "운전 전 확인" });
  const notes = createElement("ul");
  (destination.drivingNotes ?? []).forEach((note) => {
    notes.append(createElement("li", { text: note }));
  });

  elements.resultContent.append(
    heading,
    summary,
    airport,
    seasonHeading,
    season,
    notesHeading,
    notes,
  );
  renderRouteTabs(destination, elements);
  elements.result.hidden = false;
}

function formatFlightDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
}

function formatFlightPrice(price, currency) {
  try {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${Number(price).toLocaleString("ko-KR")} ${currency}`;
  }
}

function renderFlightDeals(payload, elements) {
  const offers = normalizeFlightDeals(payload);
  elements.flightDealsList.replaceChildren();
  elements.flightDealsList.setAttribute("aria-busy", "false");

  if (offers.length === 0) {
    elements.flightDealsEmpty.hidden = false;
    elements.flightDealsEmpty.textContent =
      payload?.status === "configuration_required"
        ? "실시간 가격 API 연결을 준비 중입니다. 연결 후 최신 Top 5가 여기에 표시됩니다."
        : "현재 조건에서 확인된 항공권이 없습니다. 잠시 후 다시 확인해 주세요.";
    elements.flightDealsUpdated.textContent =
      payload?.message ?? "표시할 최신 가격 데이터가 없습니다.";
    return;
  }

  elements.flightDealsEmpty.hidden = true;
  const updatedAt = new Date(payload.updatedAt);
  elements.flightDealsUpdated.textContent = Number.isNaN(updatedAt.getTime())
    ? "최신 조회 결과"
    : `${updatedAt.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })} 기준`;

  offers.forEach((offer, index) => {
    const item = createElement("li", { className: "flight-deal-card" });
    const rank = createElement("span", {
      className: "flight-deal-card__rank",
      text: String(index + 1),
    });
    const content = createElement("div", {
      className: "flight-deal-card__content",
    });
    const route = createElement("h3", {
      text: `${offer.origin} → ${offer.destinationName}`,
    });
    const dates = createElement("p", {
      className: "flight-deal-card__dates",
      text: `${formatFlightDate(offer.outboundDate)} 출발 · ${formatFlightDate(offer.returnDate)} 귀국 · ${offer.nights}박 ${offer.nights + 1}일`,
    });
    const airlines = createElement("p", {
      className: "flight-deal-card__airlines",
      text: `${offer.airlines.join(" · ")} · 직항`,
    });
    const price = createElement("strong", {
      className: "flight-deal-card__price",
      text: formatFlightPrice(offer.price, offer.currency),
    });
    const priceLabel = createElement("span", {
      className: "flight-deal-card__price-label",
      text: "5인 왕복 총액",
    });
    const priceGroup = createElement("div", {
      className: "flight-deal-card__price-group",
    });
    priceGroup.append(priceLabel, price);
    content.append(route, dates, airlines);
    item.append(rank, content, priceGroup);

    if (isSafeHttpUrl(offer.bookingUrl)) {
      const link = createElement("a", {
        className: "flight-deal-card__link",
        text: "Google Flights에서 확인",
      });
      link.href = offer.bookingUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      content.append(link);
    }

    elements.flightDealsList.append(item);
  });
}

async function initializeFlightDeals(elements) {
  try {
    const response = await fetch(
      `./src/flight-prices.json?updated=${Date.now()}`,
      { cache: "no-store" },
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    renderFlightDeals(await response.json(), elements);
  } catch {
    renderFlightDeals(
      {
        status: "error",
        message: "가격 데이터를 불러오지 못했습니다.",
        offers: [],
      },
      elements,
    );
  }
}

function getElements() {
  return {
    destinationList: document.querySelector("#destination-list"),
    shortlistCount: document.querySelector("#shortlist-count"),
    emptyState: document.querySelector("#empty-state"),
    drawButton: document.querySelector("#draw-button"),
    redrawButton: document.querySelector("#redraw-button"),
    result: document.querySelector("#result"),
    resultContent: document.querySelector("#result-content"),
    routeTabs: document.querySelector("#route-tabs"),
    routePanel: document.querySelector("#route-panel"),
    flightDealsList: document.querySelector("#flight-deals-list"),
    flightDealsUpdated: document.querySelector("#flight-deals-updated"),
    flightDealsEmpty: document.querySelector("#flight-deals-empty"),
  };
}

export function initApp(source = destinations) {
  if (typeof document === "undefined") return null;

  const elements = getElements();
  if (Object.values(elements).some((element) => !element)) return null;

  const shortlist = normalizeDestinations(source);
  renderShortlist(shortlist, elements);
  initializeFlightDeals(elements);

  const draw = () => {
    const destination = selectRandomDestination(shortlist);
    renderResult(destination, elements);
    if (elements.result instanceof HTMLElement) {
      elements.result.focus({ preventScroll: true });
    }
    elements.result.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  elements.drawButton.addEventListener("click", draw);
  elements.redrawButton.addEventListener("click", draw);

  return { shortlist, draw };
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initApp(), {
      once: true,
    });
  } else {
    initApp();
  }
}
