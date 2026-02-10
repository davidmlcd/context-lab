import fs from "node:fs";
import path from "node:path";

export function repoRoot() {
  // Asumimos que cli/ está en la raíz del repo
  return path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
}

export function loadCatalog() {
  const root = repoRoot();
  const p = path.join(root, "catalog.json");
  const raw = fs.readFileSync(p, "utf-8");
  const data = JSON.parse(raw);
  if (!data || !Array.isArray(data.demos)) {
    throw new Error("catalog.json inválido: se esperaba { demos: [] }");
  }
  return data;
}

export function findDemo(catalog, id) {
  return catalog.demos.find(d => d.id === id);
}

export function formatRow(d) {
  const cats = (d.category || []).join(",");
  return `${d.id.padEnd(28)} ${String(d.status || "").padEnd(10)} ${String(d.priority || "").padEnd(8)} ${cats}`;
}
