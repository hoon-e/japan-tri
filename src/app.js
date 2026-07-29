import { destinations } from "./data.js";

export const PARTICIPANT_LIMIT = 5;

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

export function normalizeParticipantName(value) {
  if (typeof value !== "string") return "";
  return value.normalize("NFKC").trim().replace(/\s+/g, " ");
}

function getParticipantKey(name) {
  return normalizeParticipantName(name).toLocaleLowerCase("ko-KR");
}

export function addParticipantName(
  participants,
  rawName,
  limit = PARTICIPANT_LIMIT,
) {
  const safeLimit =
    Number.isInteger(limit) && limit > 0 ? limit : PARTICIPANT_LIMIT;
  const current = Array.isArray(participants) ? [...participants] : [];
  const name = normalizeParticipantName(rawName);

  if (!name) {
    return { participants: current, added: false, reason: "empty" };
  }

  if (current.length >= safeLimit) {
    return { participants: current, added: false, reason: "full" };
  }

  const key = getParticipantKey(name);
  if (current.some((participant) => getParticipantKey(participant) === key)) {
    return { participants: current, added: false, reason: "duplicate" };
  }

  return {
    participants: [...current, name],
    added: true,
    reason: null,
  };
}

export function selectRandomParticipant(participants, random = Math.random) {
  return selectRandomItem(participants, random);
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

function renderRoute(route, panel) {
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

  panel.append(intro, days);
}

function setActiveRoute(destination, duration, elements, focusTab = false) {
  const route = getRouteForDuration(destination, duration);
  if (!route) {
    renderRoute(null, elements.routePanel);
    return;
  }

  const tabs = [...elements.routeTabs.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab) => {
    const isActive = tab.dataset.routeDuration === duration;
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    tab.classList.toggle("is-active", isActive);
  });
  renderRoute(route, elements.routePanel);

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
    renderRoute(null, elements.routePanel);
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

function initializeParticipantDraw(elements) {
  let participants = [];

  const setMessage = (message, isError = false) => {
    elements.participantMessage.textContent = message;
    elements.participantMessage.classList.toggle("is-error", isError);
  };

  const hideResult = () => {
    elements.participantResult.hidden = true;
    elements.participantResult.textContent = "";
  };

  const renderParticipants = () => {
    elements.participantList.replaceChildren();

    participants.forEach((name, index) => {
      const item = createElement("li");
      const number = createElement("span", {
        className: "participant-list__number",
        text: String(index + 1),
      });
      const label = createElement("span", {
        className: "participant-list__name",
        text: name,
      });
      const removeButton = createElement("button", {
        className: "participant-list__remove",
        text: "삭제",
      });
      removeButton.type = "button";
      removeButton.setAttribute("aria-label", `${name} 삭제`);
      removeButton.addEventListener("click", () => {
        participants = participants.filter((_, itemIndex) => itemIndex !== index);
        hideResult();
        renderParticipants();
        setMessage(`${name} 님을 명단에서 뺐어요.`);
        elements.participantInput.focus();
      });
      item.append(number, label, removeButton);
      elements.participantList.append(item);
    });

    const isFull = participants.length === PARTICIPANT_LIMIT;
    elements.participantCount.textContent = `${participants.length}/${PARTICIPANT_LIMIT}명`;
    elements.participantInput.disabled = isFull;
    elements.participantAddButton.disabled = isFull;
    elements.participantDrawButton.disabled = !isFull;
    elements.participantInput.placeholder = isFull
      ? "5명 등록 완료"
      : "예: 재훈";
  };

  const addParticipant = (event) => {
    event.preventDefault();

    const result = addParticipantName(
      participants,
      elements.participantInput.value,
    );

    if (!result.added) {
      const messages = {
        empty: "이름을 입력해 주세요.",
        duplicate: "이미 등록된 이름이에요. 다른 이름을 입력해 주세요.",
        full: "이미 5명이 모두 등록됐어요.",
      };
      setMessage(messages[result.reason] ?? "이름을 추가하지 못했어요.", true);
      elements.participantInput.focus();
      return;
    }

    participants = result.participants;
    elements.participantInput.value = "";
    hideResult();
    renderParticipants();

    if (participants.length === PARTICIPANT_LIMIT) {
      setMessage("5명 등록 완료! 이제 행운의 한 명을 뽑아보세요.");
      elements.participantDrawButton.focus();
      return;
    }

    setMessage(
      `${participants.at(-1)} 님을 추가했어요. ${PARTICIPANT_LIMIT - participants.length}명 남았어요.`,
    );
    elements.participantInput.focus();
  };

  const drawParticipant = () => {
    if (participants.length !== PARTICIPANT_LIMIT) return null;

    const selected = selectRandomParticipant(participants);
    if (!selected) return null;

    elements.participantResult.textContent = `🎉 이번 랜덤 선택은 ${selected} 님!`;
    elements.participantResult.hidden = false;
    elements.participantResult.focus({ preventScroll: true });
    return selected;
  };

  elements.participantForm.addEventListener("submit", addParticipant);
  elements.participantDrawButton.addEventListener("click", drawParticipant);
  renderParticipants();

  return {
    drawParticipant,
    getParticipants: () => [...participants],
  };
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
    participantForm: document.querySelector("#participant-form"),
    participantInput: document.querySelector("#participant-name"),
    participantAddButton: document.querySelector("#participant-add-button"),
    participantCount: document.querySelector("#participant-count"),
    participantMessage: document.querySelector("#participant-message"),
    participantList: document.querySelector("#participant-list"),
    participantDrawButton: document.querySelector("#participant-draw-button"),
    participantResult: document.querySelector("#participant-result"),
  };
}

export function initApp(source = destinations) {
  if (typeof document === "undefined") return null;

  const elements = getElements();
  if (Object.values(elements).some((element) => !element)) return null;

  const shortlist = normalizeDestinations(source);
  renderShortlist(shortlist, elements);
  const participantDraw = initializeParticipantDraw(elements);

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

  return { shortlist, draw, ...participantDraw };
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
