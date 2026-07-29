import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const client = resolve(dist, "client");
const server = resolve(dist, "server");
const metadata = resolve(dist, ".openai");

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });
await mkdir(metadata, { recursive: true });

await cp(resolve(root, "src"), resolve(client, "src"), { recursive: true });
await cp(resolve(root, "index.html"), resolve(client, "index.html"));

const index = await readFile(resolve(root, "hosting", "worker.js"), "utf8");
await writeFile(resolve(server, "index.js"), index);
await writeFile(
  resolve(metadata, "hosting.json"),
  `${JSON.stringify({ d1: null, r2: null }, null, 2)}\n`,
);

console.log("Built Cloudflare Worker-compatible artifact in dist/");
