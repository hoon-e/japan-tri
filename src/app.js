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

export function parseDriveEstimate(drive) {
  if (!isNonEmptyString(drive)) return null;

  const kmMatch = drive.match(/약\s*([\d,.]+)\s*km/i);
  const hoursMatch = drive.match(/(\d+)\s*시간(?:\s*(\d+)\s*분)?/);
  const minutesOnlyMatch = drive.match(/(?:^|[·\s])(\d+)\s*분/);

  const kilometers = kmMatch ? Number(kmMatch[1].replaceAll(",", "")) : null;
  if (kilometers !== null && !Number.isFinite(kilometers)) return null;

  let minutes = null;
  if (hoursMatch) {
    minutes = Number(hoursMatch[1]) * 60 + Number(hoursMatch[2] ?? 0);
  } else if (minutesOnlyMatch) {
    minutes = Number(minutesOnlyMatch[1]);
  }

  if (minutes !== null && !Number.isFinite(minutes)) return null;
  if (kilometers === null && minutes === null) return null;

  return { kilometers, minutes };
}

export function summarizeRouteMetrics(route) {
  const days = route?.days ?? [];
  if (days.length === 0) return null;

  const metrics = days.reduce(
    (accumulator, day) => {
      const estimate = parseDriveEstimate(day.drive);
      if (Number.isFinite(estimate?.kilometers)) {
        accumulator.kilometers += estimate.kilometers;
      } else {
        accumulator.hasAllDistances = false;
      }
      if (Number.isFinite(estimate?.minutes)) {
        accumulator.minutes += estimate.minutes;
      } else {
        accumulator.hasAllDurations = false;
      }
      return accumulator;
    },
    {
      kilometers: 0,
      minutes: 0,
      hasAllDistances: true,
      hasAllDurations: true,
    },
  );

  const kilometers = metrics.hasAllDistances ? metrics.kilometers : null;
  const minutes = metrics.hasAllDurations ? metrics.minutes : null;
  if (kilometers === null && minutes === null) return null;
  return { kilometers, minutes };
}

export function formatRouteEstimate(metrics) {
  if (!metrics) return "표기된 운전 정보 없음";

  const parts = [];
  if (metrics.kilometers > 0) {
    parts.push(`약 ${metrics.kilometers.toFixed(0)}km`);
  }
  if (metrics.minutes > 0) {
    const hours = Math.floor(metrics.minutes / 60);
    const minutes = metrics.minutes % 60;
    if (hours > 0) {
      parts.push(minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`);
    } else {
      parts.push(`${minutes}분`);
    }
  }

  return parts.join(" · ");
}

function getSeasonSummary(seasons) {
  if (!isNonEmptyString(seasons)) return "출발 전 계절 안내 확인";
  return seasons.split(/[,.]/, 1)[0].trim();
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
  const facts = createElement("dl", { className: "destination-facts" });
  [
    ["추천 일정", destination.recommendedDuration],
    ["여행 시기", getSeasonSummary(destination.seasons)],
  ].forEach(([term, description]) => {
    facts.append(
      createElement("dt", { text: term }),
      createElement("dd", { text: description }),
    );
  });

  const reasonDetails = createElement("details", {
    className: "destination-reason-details",
  });
  const reasonSummary = createElement("summary", {
    text: "후보 선정 이유 보기",
  });
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
  reasonDetails.append(reasonSummary, reasons);

  const highlights = createElement("ul", {
    className: "tag-list",
  });
  highlights.setAttribute("aria-label", "대표 방문지");
  (destination.highlights ?? []).forEach((highlight) => {
    highlights.append(createElement("li", { text: highlight }));
  });

  body.append(
    region,
    heading,
    airport,
    summary,
    facts,
    highlights,
    reasonDetails,
  );
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

  const dashboard = createElement("section", {
    className: "route-dashboard",
  });
  const dashboardHeading = createElement("h4", { text: "한눈에 보는 이번 루트" });
  const dashboardFacts = createElement("dl", { className: "route-dashboard__facts" });
  const routeMetrics = summarizeRouteMetrics(route);
  const totalStops = route.days.reduce(
    (count, day) => count + day.stops.length,
    0,
  );
  const distance =
    routeMetrics?.kilometers > 0
      ? `약 ${routeMetrics.kilometers.toFixed(0)}km`
      : "표기 없음";
  const driveTime =
    routeMetrics?.minutes > 0
      ? formatRouteEstimate({
          kilometers: 0,
          minutes: routeMetrics.minutes,
        })
      : "표기 없음";
  [
    ["기간", route.label],
    ["총 거리", distance],
    ["운전 시간", driveTime],
    ["방문 지점", `${totalStops}곳`],
  ].forEach(([term, description]) => {
    const fact = createElement("div", {
      className: "route-dashboard__fact",
    });
    fact.append(
      createElement("dt", { text: term }),
      createElement("dd", { text: description }),
    );
    dashboardFacts.append(fact);
  });
  const dashboardStops = createElement("ul", {
    className: "route-dashboard__stops",
  });
  dashboardStops.setAttribute("aria-label", "일자별 빠른 보기");
  route.days.forEach((day) => {
    dashboardStops.append(
      createElement("li", {
        text: `${day.day}일차 · ${day.drive} · ${day.stops[0]} → ${
          day.stops.at(-1) ?? ""
        }`,
      }),
    );
  });
  dashboard.append(dashboardHeading, dashboardFacts, dashboardStops);

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

  panel.append(dashboard, intro);
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

  const dashboard = createElement("div", { className: "result-dashboard" });
  const region = createElement("p", {
    className: "result-region",
    text: destination.region,
  });
  const heading = createElement("h3", { text: destination.name });
  const summary = createElement("p", { text: destination.summary });
  const facts = createElement("dl", { className: "result-facts" });
  [
    ["도착·렌터카 거점", destination.airport],
    ["추천 일정", destination.recommendedDuration],
  ].forEach(([term, description]) => {
    facts.append(
      createElement("div", { className: "result-fact" }),
    );
    facts.lastElementChild.append(
      createElement("dt", { text: term }),
      createElement("dd", { text: description }),
    );
  });
  const access = createElement("section", { className: "result-access" });
  access.append(
    createElement("h4", { text: "직항으로 닿는 방법" }),
    createElement("p", { text: destination.directFlightReason }),
  );
  const season = createElement("section", { className: "result-season" });
  season.append(
    createElement("h4", { text: "가기 좋은 때" }),
    createElement("p", { text: destination.seasons }),
  );
  const highlights = createElement("section", {
    className: "result-highlights",
  });
  const highlightList = createElement("ul", { className: "tag-list" });
  highlightList.setAttribute("aria-label", "선정 여행지 대표 방문지");
  (destination.highlights ?? []).forEach((highlight) => {
    highlightList.append(createElement("li", { text: highlight }));
  });
  highlights.append(
    createElement("h4", { text: "대표 방문지" }),
    highlightList,
  );
  const cautions = createElement("aside", {
    className: "result-cautions",
  });
  const notesHeading = createElement("h4", { text: "운전 전 확인" });
  const notes = createElement("ul");
  (destination.drivingNotes ?? []).forEach((note) => {
    notes.append(createElement("li", { text: note }));
  });
  cautions.append(notesHeading, notes);
  dashboard.append(
    region,
    heading,
    summary,
    facts,
    access,
    season,
    highlights,
    cautions,
  );

  elements.resultContent.append(dashboard);
  renderRouteTabs(destination, elements);
  elements.result.hidden = false;
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
  };
}

export function initApp(source = destinations) {
  if (typeof document === "undefined") return null;

  const elements = getElements();
  if (Object.values(elements).some((element) => !element)) return null;

  const shortlist = normalizeDestinations(source);
  renderShortlist(shortlist, elements);

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
