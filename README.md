# Plataforma de Demos de Contexto

Repositorio centralizado de pruebas de concepto (PoCs) de IA / Ingeniería de Contexto.

## Propósito

Este repositorio existe para:

- Centralizar todas las PoCs de IA / Context Engineering
- Permitir ejecutar demos rápidamente para clientes
- Crear un portfolio estructurado y reutilizable
- Evitar fugas de datos o referencias a clientes
- Estandarizar cómo se construyen y ejecutan las demos

---

## Reglas de Oro

1. **Prohibido incluir datos de cliente**
2. Todas las demos deben estar anonimizadas
3. No se deben subir secretos al repositorio
4. Las demos deben poder ejecutarse en local o tener resultados pre-generados
5. Toda demo debe estar registrada en `catalog.json`

---

## Estructura del Repositorio

- `/raw` → PoCs originales sin procesar (repos, zips, pruebas)
- `/demos` → Demos normalizadas y ejecutables
- `/cli` → Lanzador de demos
- `/web` → Catálogo visual de demos
- `/docs` → Documentación y estándares
- `catalog.json` → Índice central de demos

## Ciclo de Vida de una Demo

- raw → local-ok → demo-ready

## Cómo añadir una nueva PoC

1. Colocar el código original en `/raw/<demo-id>/`
2. Añadir entrada en `catalog.json`
3. Verificar anonimización
4. Hacerla ejecutable en local
5. Moverla a `/demos/` cuando esté lista para demo

## Estados de una Demo

- `raw` → No preparada
- `local-ok` → Ejecuta en local
- `demo-ready` → Lista para mostrar a clientes