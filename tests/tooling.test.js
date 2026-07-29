import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const packageJsonUrl = new URL("../package.json", import.meta.url);
const netlifyTomlUrl = new URL("../netlify.toml", import.meta.url);
const buildScriptUrl = new URL("../scripts/build.mjs", import.meta.url);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

test("package scripts expose the documented validation and build commands", async () => {
  const pkg = await readJson(packageJsonUrl);

  assert.equal(pkg.scripts.start, "python3 -m http.server 4173");
  assert.equal(pkg.scripts.build, "node scripts/build.mjs");
  assert.equal(
    pkg.scripts["refresh:flights"],
    "node scripts/update-flight-prices.mjs",
  );
  assert.equal(pkg.scripts.test, "node --test tests/*.test.js");
  assert.equal(pkg.scripts["test:unit"], "node --test tests/app.test.js tests/data.test.js");
  assert.equal(pkg.scripts["test:static"], "node --test tests/static.test.js");
  assert.equal(
    pkg.scripts.typecheck,
    "node --check src/app.js && node --check src/data.js && node --check scripts/update-flight-prices.mjs",
  );
  assert.equal(
    pkg.scripts.lint,
    "node --check src/app.js && node --check src/data.js && node --check scripts/*.mjs && node --check tests/*.test.js",
  );
  assert.equal(
    pkg.scripts.check,
    "npm run typecheck && npm run lint && npm test && npm run build",
  );
});

test("netlify configuration keeps the site rooted at the repository root", async () => {
  const netlifyToml = await readFile(netlifyTomlUrl, "utf8");

  assert.match(netlifyToml, /\[build\]/);
  assert.match(netlifyToml, /publish\s*=\s*"\."/);
  assert.match(netlifyToml, /X-Content-Type-Options\s*=\s*"nosniff"/);
  assert.match(netlifyToml, /Referrer-Policy\s*=\s*"strict-origin-when-cross-origin"/);
  assert.match(netlifyToml, /X-Frame-Options\s*=\s*"DENY"/);
});

test("the build script emits the documented Cloudflare Worker artifact paths", async () => {
  const buildScript = await readFile(buildScriptUrl, "utf8");

  assert.match(buildScript, /resolve\(dist, "\.openai"\)/);
  assert.match(buildScript, /resolve\(server, "index\.js"\)/);
  assert.match(buildScript, /resolve\(metadata, "hosting\.json"\)/);
  assert.match(buildScript, /cp\(resolve\(root, "src"\), resolve\(client, "src"\), \{ recursive: true \}\)/);
  assert.match(buildScript, /cp\(resolve\(root, "index\.html"\), resolve\(client, "index\.html"\)\)/);
  assert.match(buildScript, /cp\(resolve\(root, "route\.html"\), resolve\(client, "route\.html"\)\)/);
});
