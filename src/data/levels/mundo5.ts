import { ASSETS } from "../../config/assets";
import type { LevelDefinition } from "./types";

export const MUNDO_5: LevelDefinition = {
  key: "mundo-5",
  mapKey: ASSETS.mapaMundo5,
  background: ASSETS.fondoPradera,
  terrain: [
    // Loma inicial.
    { row: 26, startCol: 0, endCol: 17, tile: 1 },
    { row: 27, startCol: 0, endCol: 17, tile: 2 },

    // Primer paso entre flores.
    { row: 24, startCol: 19, endCol: 24, tile: 3 },
    { row: 25, startCol: 27, endCol: 43, tile: 1 },
    { row: 26, startCol: 27, endCol: 43, tile: 2 },
    { row: 27, startCol: 27, endCol: 43, tile: 2 },

    // Ascenso suave a la loma central.
    { row: 23, startCol: 45, endCol: 50, tile: 3 },
    { row: 21, startCol: 53, endCol: 58, tile: 3 },
    { row: 24, startCol: 61, endCol: 76, tile: 1 },
    { row: 25, startCol: 61, endCol: 76, tile: 2 },
    { row: 26, startCol: 61, endCol: 76, tile: 2 },
    { row: 27, startCol: 61, endCol: 76, tile: 2 },

    // Cruce principal de la pradera.
    { row: 22, startCol: 78, endCol: 83, tile: 3 },
    { row: 20, startCol: 86, endCol: 91, tile: 3 },
    { row: 25, startCol: 94, endCol: 106, tile: 1 },
    { row: 26, startCol: 94, endCol: 106, tile: 2 },
    { row: 27, startCol: 94, endCol: 106, tile: 2 },

    // Paso corto y loma final.
    { row: 23, startCol: 108, endCol: 112, tile: 3 },
    { row: 25, startCol: 115, endCol: 119, tile: 1 },
    { row: 26, startCol: 115, endCol: 119, tile: 2 },
    { row: 27, startCol: 115, endCol: 119, tile: 2 },
  ],
  gravityY: 840,
  playerSpawnX: 96,
  playerSpawnYOffset: 230,
  goalTileX: 116,
  goalTileY: 20,
  enemies: [
    { col: 9, row: 26, type: "spider", patrolRange: 62 },
    { col: 34, row: 25, type: "river-worm", patrolRange: 58 },
    { col: 48, row: 23, type: "spider", patrolRange: 26 },
    { col: 68, row: 24, type: "river-worm", patrolRange: 58 },
    { col: 88, row: 20, type: "river-worm", patrolRange: 26 },
    { col: 100, row: 25, type: "spider", patrolRange: 48 },
  ],
  items: [
    { col: 21, row: 24, type: "fries" },
    { col: 36, row: 25, type: "lulo" },
    { col: 55, row: 21, type: "burger" },
    { col: 81, row: 22, type: "broccoli" },
    { col: 110, row: 23, type: "lulo" },
  ],
};
