import { ASSETS } from "../../config/assets";
import type { LevelDefinition } from "./types";

export const MUNDO_1: LevelDefinition = {
  key: "mundo-1",
  mapKey: ASSETS.mapaMundo1,
  background: ASSETS.fondoIsla,
  terrain: [
    // Playa inicial: espacio seguro para aprender a moverse y disparar.
    { row: 26, startCol: 0, endCol: 20, tile: 1 },
    { row: 27, startCol: 0, endCol: 20, tile: 2 },

    // Primer hueco: dos saltos cortos y fáciles de leer.
    { row: 24, startCol: 22, endCol: 26, tile: 3 },
    { row: 22, startCol: 29, endCol: 33, tile: 3 },

    // Zona central de combate.
    { row: 25, startCol: 36, endCol: 53, tile: 1 },
    { row: 26, startCol: 36, endCol: 53, tile: 2 },
    { row: 27, startCol: 36, endCol: 53, tile: 2 },

    // Segundo cruce: conserva el ritmo sin exigir saltos al límite.
    { row: 23, startCol: 55, endCol: 60, tile: 3 },
    { row: 21, startCol: 63, endCol: 68, tile: 3 },

    // Loma alta de la isla.
    { row: 24, startCol: 71, endCol: 88, tile: 1 },
    { row: 25, startCol: 71, endCol: 88, tile: 2 },
    { row: 26, startCol: 71, endCol: 88, tile: 2 },
    { row: 27, startCol: 71, endCol: 88, tile: 2 },

    // Último cruce y playa donde espera la familia.
    { row: 23, startCol: 90, endCol: 95, tile: 3 },
    { row: 21, startCol: 98, endCol: 103, tile: 3 },
    { row: 25, startCol: 106, endCol: 119, tile: 1 },
    { row: 26, startCol: 106, endCol: 119, tile: 2 },
    { row: 27, startCol: 106, endCol: 119, tile: 2 },
  ],
  gravityY: 900,
  playerSpawnX: 96,
  playerSpawnYOffset: 230,
  goalTileX: 116,
  goalTileY: 20,
  enemies: [
    { col: 12, row: 26, type: "avocado", patrolRange: 72 },
    { col: 44, row: 25, type: "avocado", patrolRange: 70 },
    { col: 58, row: 23, type: "avocado", patrolRange: 30 },
    { col: 79, row: 24, type: "avocado", patrolRange: 70 },
    { col: 112, row: 25, type: "avocado", patrolRange: 48 },
  ],
  items: [
    { col: 24, row: 24, type: "fries" },
    { col: 31, row: 22, type: "broccoli" },
    { col: 47, row: 25, type: "lulo" },
    { col: 65, row: 21, type: "guava" },
    { col: 100, row: 21, type: "burger" },
  ],
};
