import { destinations } from "./data.js";

const DAY_COLORS = ["#c9472d", "#1f684f", "#3567a8", "#8b4c9c"];
const VALID_DURATIONS = new Set(["2n3d", "3n4d"]);

function isFiniteCoordinate(value) {
  return Number.isFinite(value);
}

export function isValidMapStop(stop) {
  return (
    stop &&
    typeof stop.name === "string" &&
    stop.name.trim().length > 0 &&
    Array.isArray(stop.coordinates) &&
    stop.coordinates.length === 2 &&
    stop.coordinates.every(isFiniteCoordinate) &&
    stop.coordinates[0] >= -90 &&
    stop.coordinates[0] <= 90 &&
    stop.coordinates[1] >= -180 &&
    stop.coordinates[1] <= 180
  );
}

export function getRouteSelection(search, items = destinations) {
  const params =
    search instanceof URLSearchParams ? search : new URLSearchParams(search);
  const destinationId = params.get("destination");
  const duration = params.get("duration");

  if (!destinationId || !VALID_DURATIONS.has(duration)) return null;

  const destination = items.find((item) => item.id === destinationId);
  const route = destination?.routes?.find(
    (candidate) => candidate.duration === duration,
  );

  return destination && route ? { destination, route } : null;
}

export function getDayColor(dayNumber) {
  return DAY_COLORS[(dayNumber - 1) % DAY_COLORS.length];
}

function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);
  if (options.className) element.className = options.className;
  if (options.text) element.textContent = options.text;
  return element;
}

function renderItinerary(route, list) {
  const fragment = document.createDocumentFragment();

  route.days.forEach((day) => {
    const item = createElement("li", { className: "itinerary-day" });
    const heading = createElement("div", { className: "itinerary-day__heading" });
    const number = createElement("span", {
      className: "day-number",
      text: `${day.day}일차`,
    });
    number.style.setProperty("--day-color", getDayColor(day.day));
    heading.append(number, createElement("h3", { text: day.title }));

    const meta = createElement("p", {
      className: "itinerary-day__meta",
      text: `${day.drive} · ${day.base}`,
    });
    const stops = createElement("ol", {
      className: "stop-list",
    });
    stops.setAttribute("aria-label", `${day.day}일차 방문 순서`);
    day.stops.forEach((stop) => {
      stops.append(createElement("li", { text: stop }));
    });

    item.append(heading, meta, stops);
    fragment.append(item);
  });

  list.replaceChildren(fragment);
}

function createMarkerIcon(day, stopIndex) {
  return window.L.divIcon({
    className: "route-marker-shell",
    html: `<span class="route-marker" style="--marker-color:${getDayColor(day)}">${day}-${stopIndex + 1}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

function addDayLayer(map, day) {
  const validStops = (day.mapStops ?? []).filter(isValidMapStop);
  if (validStops.length === 0) return null;

  const layer = window.L.layerGroup();
  const coordinates = validStops.map((stop) => stop.coordinates);

  window.L.polyline(coordinates, {
    color: getDayColor(day.day),
    weight: 5,
    opacity: 0.82,
    lineJoin: "round",
  }).addTo(layer);

  validStops.forEach((stop, index) => {
    window.L.marker(stop.coordinates, {
      icon: createMarkerIcon(day.day, index),
      keyboard: true,
      title: `${day.day}일차 ${index + 1}. ${stop.name}`,
    })
      .bindPopup(
        `<strong>${day.day}일차 · ${index + 1}</strong><br>${escapeHtml(stop.name)}`,
      )
      .addTo(layer);
  });

  layer.addTo(map);
  return { day: day.day, layer, coordinates };
}

function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character],
  );
}

function renderLegend(route, list) {
  const fragment = document.createDocumentFragment();
  route.days.forEach((day) => {
    const item = createElement("li");
    const swatch = createElement("span", { className: "legend-swatch" });
    swatch.style.setProperty("--day-color", getDayColor(day.day));
    item.append(
      swatch,
      createElement("span", { text: `${day.day}일차 · ${day.title}` }),
    );
    fragment.append(item);
  });
  list.replaceChildren(fragment);
}

function renderDayFilter(route, layers, filter) {
  const layerByDay = new Map(layers.map((item) => [item.day, item.layer]));
  const buttons = [];

  const setActiveDay = (selectedDay) => {
    layers.forEach(({ day, layer }) => {
      const shouldShow = selectedDay === "all" || selectedDay === String(day);
      if (shouldShow && !layer._map) layer.addTo(layer.__routeMap);
      if (!shouldShow && layer._map) layer.remove();
    });
    buttons.forEach((button) => {
      const active = button.dataset.day === selectedDay;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("is-active", active);
    });
  };

  [
    { value: "all", label: "전체 일정" },
    ...route.days.map((day) => ({
      value: String(day.day),
      label: `${day.day}일차`,
    })),
  ].forEach(({ value, label }) => {
    const button = createElement("button", {
      className: "day-filter__button",
      text: label,
    });
    button.type = "button";
    button.dataset.day = value;
    button.setAttribute("aria-pressed", String(value === "all"));
    button.disabled = value !== "all" && !layerByDay.has(Number(value));
    button.addEventListener("click", () => setActiveDay(value));
    buttons.push(button);
    filter.append(button);
  });
}

async function renderMap(route, elements) {
  renderLegend(route, elements.legendList);
  elements.mapStatus.textContent = "지도를 불러오는 중입니다.";

  if (!window.L && document.readyState !== "complete") {
    await new Promise((resolve) => {
      window.addEventListener("load", resolve, { once: true });
    });
  }

  if (!window.L) {
    elements.map.hidden = true;
    elements.mapStatus.textContent =
      "지도 라이브러리를 불러오지 못했습니다. 아래 텍스트 일정으로 방문 순서를 확인해 주세요.";
    return;
  }

  const map = window.L.map(elements.map, {
    scrollWheelZoom: false,
    zoomControl: true,
  });
  window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const layers = route.days
    .map((day) => addDayLayer(map, day))
    .filter(Boolean);
  layers.forEach(({ layer }) => {
    layer.__routeMap = map;
  });

  const allCoordinates = layers.flatMap(({ coordinates }) => coordinates);
  if (allCoordinates.length === 0) {
    map.remove();
    elements.map.hidden = true;
    elements.mapStatus.textContent =
      "표시할 좌표가 준비되지 않았습니다. 아래 텍스트 일정으로 방문 순서를 확인해 주세요.";
    return;
  }

  map.fitBounds(window.L.latLngBounds(allCoordinates), {
    padding: [30, 30],
    maxZoom: 11,
  });
  renderDayFilter(route, layers, elements.dayFilter);
  elements.mapStatus.textContent =
    "지도에는 전체 일정이 표시되어 있습니다. 일자 버튼으로 경로를 골라 볼 수 있어요.";
}

function renderRouteDetail(selection, elements) {
  const { destination, route } = selection;
  document.title = `${destination.name} ${route.label} · 로컬 드라이브`;
  elements.region.textContent = destination.region;
  elements.title.textContent = `${destination.name} ${route.label}`;
  elements.summary.textContent = route.summary;
  elements.duration.textContent = route.label;
  elements.airport.textContent = destination.airport;

  renderItinerary(route, elements.itinerary);
  elements.drivingNotes.replaceChildren(
    ...(destination.drivingNotes ?? []).map((note) =>
      createElement("li", { text: note }),
    ),
  );
  void renderMap(route, elements);
}

function init() {
  const elements = {
    loading: document.querySelector("#route-loading"),
    error: document.querySelector("#route-error"),
    detail: document.querySelector("#route-detail"),
    region: document.querySelector("#route-region"),
    title: document.querySelector("#route-title"),
    summary: document.querySelector("#route-summary"),
    duration: document.querySelector("#route-duration"),
    airport: document.querySelector("#route-airport"),
    dayFilter: document.querySelector("#day-filter"),
    map: document.querySelector("#route-map"),
    mapStatus: document.querySelector("#map-status"),
    legendList: document.querySelector("#map-legend-list"),
    itinerary: document.querySelector("#itinerary-list"),
    drivingNotes: document.querySelector("#driving-notes"),
  };
  const selection = getRouteSelection(window.location.search);

  elements.loading.hidden = true;
  if (!selection) {
    elements.error.hidden = false;
    return;
  }

  elements.detail.hidden = false;
  renderRouteDetail(selection, elements);
}

if (typeof document !== "undefined") {
  init();
}
