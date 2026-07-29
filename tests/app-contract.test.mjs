import test from 'node:test';
import assert from 'node:assert/strict';

const appModuleUrl = new URL('../src/app.js', import.meta.url);
const dataModuleUrl = new URL('../src/data.js', import.meta.url);

async function loadApp() {
  return import(appModuleUrl);
}

async function loadData() {
  return import(dataModuleUrl);
}

test('selectRandomDestination returns one of the visible shortlist destinations', async () => {
  const { selectRandomDestination } = await loadApp();
  const shortlist = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const result = selectRandomDestination(shortlist, () => 0.99);

  assert.ok(shortlist.includes(result));
});

test('selectRandomDestination returns null when shortlist is empty', async () => {
  const { selectRandomDestination } = await loadApp();

  assert.equal(selectRandomDestination([], () => 0.5), null);
});

test('getRouteForDuration returns the route matching the requested duration', async () => {
  const { getRouteForDuration } = await loadApp();
  const destination = {
    routes: [
      { duration: '2박 3일', label: '2박 3일' },
      { duration: '3박 4일', label: '3박 4일' },
    ],
  };

  assert.deepEqual(getRouteForDuration(destination, '3박 4일'), destination.routes[1]);
});

test('getRouteForDuration returns null when the requested duration does not exist', async () => {
  const { getRouteForDuration } = await loadApp();
  const destination = { routes: [{ duration: '2박 3일', label: '2박 3일' }] };

  assert.equal(getRouteForDuration(destination, '3박 4일'), null);
});

test('getDefaultDuration prefers the destination recommended duration', async () => {
  const { getDefaultDuration } = await loadApp();
  const destination = { recommendedDuration: '3박 4일', routes: [] };

  assert.equal(getDefaultDuration(destination), '3박 4일');
});

test('normalizeDestinations removes invalid destination records', async () => {
  const { normalizeDestinations } = await loadApp();
  const invalid = { id: '', name: '', routes: null };
  const valid = { id: 'a', name: '아오모리', routes: [] };

  assert.deepEqual(normalizeDestinations([invalid, valid]), [valid]);
});

test('destinations export is a non-empty array of destination records', async () => {
  const { destinations } = await loadData();

  assert.ok(Array.isArray(destinations));
  assert.ok(destinations.length > 0);
  for (const destination of destinations) {
    assert.equal(typeof destination.id, 'string');
    assert.equal(typeof destination.name, 'string');
    assert.equal(typeof destination.airport, 'string');
    assert.equal(typeof destination.recommendedDuration, 'string');
    assert.ok(Array.isArray(destination.routes));
    assert.ok(destination.routes.length > 0);
  }
});
