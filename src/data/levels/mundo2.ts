import { ASSETS } from "../../config/assets";
import type { LevelDefinition } from "./types";

export const MUNDO_2: LevelDefinition = {
  key: "mundo-2",
  mapKey: ASSETS.mapaMundo2,
  background: ASSETS.fondoJungla,
  terrain: [
    // Suelo de entrada.
    { row: 26, startCol: 0, endCol: 14, tile: 1 },
    { row: 27, startCol: 0, endCol: 14, tile: 2 },

    // Ascenso inicial entre ramas.
    { row: 24, startCol: 16, endCol: 21, tile: 3 },
    { row: 21, startCol: 24, endCol: 29, tile: 3 },

    // Primer claro elevado.
    { row: 24, startCol: 32, endCol: 45, tile: 1 },
    { row: 25, startCol: 32, endCol: 45, tile: 2 },
    { row: 26, startCol: 32, endCol: 45, tile: 2 },
    { row: 27, startCol: 32, endCol: 45, tile: 2 },

    // Segundo ascenso, más alto pero todavía dentro del salto máximo.
    { row: 22, startCol: 47, endCol: 52, tile: 3 },
    { row: 19, startCol: 55, endCol: 60, tile: 3 },

    // Claro central.
    { row: 23, startCol: 63, endCol: 76, tile: 1 },
    { row: 24, startCol: 63, endCol: 76, tile: 2 },
    { row: 25, startCol: 63, endCol: 76, tile: 2 },
    { row: 26, startCol: 63, endCol: 76, tile: 2 },
    { row: 27, startCol: 63, endCol: 76, tile: 2 },

    // Copa de la jungla: tramo vertical principal.
    { row: 21, startCol: 78, endCol: 83, tile: 3 },
    { row: 18, startCol: 86, endCol: 91, tile: 3 },

    // Meseta previa a la meta.
    { row: 22, startCol: 94, endCol: 105, tile: 1 },
    { row: 23, startCol: 94, endCol: 105, tile: 2 },
    { row: 24, startCol: 94, endCol: 105, tile: 2 },
    { row: 25, startCol: 94, endCol: 105, tile: 2 },
    { row: 26, startCol: 94, endCol: 105, tile: 2 },
    { row: 27, startCol: 94, endCol: 105, tile: 2 },

    // Descenso final controlado.
    { row: 20, startCol: 107, endCol: 111, tile: 3 },
    { row: 24, startCol: 114, endCol: 119, tile: 1 },
    { row: 25, startCol: 114, endCol: 119, tile: 2 },
    { row: 26, startCol: 114, endCol: 119, tile: 2 },
    { row: 27, startCol: 114, endCol: 119, tile: 2 },
  ],
  gravityY: 940,
  playerSpawnX: 96,
  playerSpawnYOffset: 230,
  goalTileX: 116,
  goalTileY: 20,
  enemies: [
    { col: 8, row: 26, type: "spider", patrolRange: 52 },
    { col: 38, row: 24, type: "spider", patrolRange: 58 },
    { col: 49, row: 22, type: "spider", patrolRange: 26 },
    { col: 69, row: 23, type: "spider", patrolRange: 58 },
    { col: 87, row: 18, type: "spider", patrolRange: 26 },
    { col: 109, row: 20, type: "spider", patrolRange: 20 },
  ],
  items: [
    { col: 18, row: 24, type: "fries" },
    { col: 27, row: 21, type: "guava" },
    { col: 50, row: 22, type: "burger" },
    { col: 88, row: 18, type: "broccoli" },
    { col: 119, row: 24, type: "lulo" },
  ],
};
