#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { loadCatalog, findDemo, formatRow, repoRoot } from "./lib/catalog.mjs";

function help() {
  console.log(`
Context Lab CLI

Usage:
  demo list [--status <s>] [--priority <p>] [--q <text>]
  demo info <id>
  demo run <id> [--] [args...]

Examples:
  node cli/demo.mjs list
  node cli/demo.mjs list --priority nn
  node cli/demo.mjs info software-factory
  node cli/demo.mjs run software-factory -- notion validate
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const cmd = args[0];
  return { cmd, rest: args.slice(1) };
}

function getFlag(rest, name) {
  const i = rest.indexOf(name);
  if (i === -1) return null;
  return rest[i + 1] ?? "";
}

function hasFlag(rest, name) {
  return rest.includes(name);
}

async function main() {
  const { cmd, rest } = parseArgs(process.argv);
  if (!cmd || cmd === "help" || cmd === "-h" || cmd === "--help") return help();

  const catalog = loadCatalog();

  if (cmd === "list") {
    const status = getFlag(rest, "--status");
    const priority = getFlag(rest, "--priority");
    const q = getFlag(rest, "--q")?.toLowerCase();

    const filtered = catalog.demos.filter(d => {
      if (status && d.status !== status) return false;
      if (priority && d.priority !== priority) return false;
      if (q) {
        const hay = `${d.id} ${d.name} ${(d.category || []).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    console.log("ID".padEnd(28), "STATUS".padEnd(10), "PRIORITY".padEnd(8), "CATEGORIES");
    console.log("-".repeat(80));
    filtered.forEach(d => console.log(formatRow(d)));
    console.log(`\nTotal: ${filtered.length}`);
    return;
  }

  if (cmd === "info") {
    const id = rest[0];
    if (!id) throw new Error("Falta <id>. Ej: demo info software-factory");
    const d = findDemo(catalog, id);
    if (!d) throw new Error(`No existe demo con id: ${id}`);

    console.log(JSON.stringify(d, null, 2));
    return;
  }

  if (cmd === "run") {
    const id = rest[0];
    if (!id) throw new Error("Falta <id>. Ej: demo run software-factory");
    const d = findDemo(catalog, id);
    if (!d) throw new Error(`No existe demo con id: ${id}`);
    if (!d.run || !d.run.command || !d.run.cwd) {
      throw new Error(`La demo ${id} no tiene bloque "run" configurado en catalog.json`);
    }

    // Soporta: demo run <id> -- <args...>
    const sepIndex = rest.indexOf("--");
    const userArgs = sepIndex === -1 ? rest.slice(1) : rest.slice(sepIndex + 1);

    const root = repoRoot();
    const cwd = path.join(root, d.run.cwd);
    const commandParts = d.run.command.split(" ").filter(Boolean);
    const bin = (commandParts[0] === "node") ? process.execPath : commandParts[0];
    const baseArgs = commandParts.slice(1);

    const finalArgs = [
      ...baseArgs,
      ...(d.run.default_args || []),
      ...userArgs
    ];

    console.log(`\n→ Running: ${bin} ${finalArgs.join(" ")}\n→ cwd: ${cwd}\n`);

    const child = spawn(bin, finalArgs, {
      cwd,
      stdio: "inherit",
      env: process.env
    });

    child.on("exit", code => process.exit(code ?? 1));
    return;
  }

  help();
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
