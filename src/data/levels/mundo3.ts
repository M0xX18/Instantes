import { ASSETS } from "../../config/assets";
import type { LevelDefinition } from "./types";

export const MUNDO_3: LevelDefinition = {
  key: "mundo-3",
  mapKey: ASSETS.mapaMundo3,
  background: ASSETS.fondoRios,
  terrain: [
    // Orilla inicial.
    { row: 26, startCol: 0, endCol: 14, tile: 1 },
    { row: 27, startCol: 0, endCol: 14, tile: 2 },

    // Primer cruce: enseña el ritmo con dos apoyos cercanos.
    { row: 24, startCol: 16, endCol: 20, tile: 3 },
    { row: 22, startCol: 23, endCol: 27, tile: 3 },

    // Segunda orilla.
    { row: 25, startCol: 30, endCol: 43, tile: 1 },
    { row: 26, startCol: 30, endCol: 43, tile: 2 },
    { row: 27, startCol: 30, endCol: 43, tile: 2 },

    // Segundo cruce: subida corta y caída hacia la siguiente orilla.
    { row: 23, startCol: 45, endCol: 50, tile: 3 },
    { row: 20, startCol: 53, endCol: 57, tile: 3 },

    // Orilla central.
    { row: 25, startCol: 60, endCol: 73, tile: 1 },
    { row: 26, startCol: 60, endCol: 73, tile: 2 },
    { row: 27, startCol: 60, endCol: 73, tile: 2 },

    // Cruce principal: el tramo de parkour más largo del nivel.
    { row: 23, startCol: 75, endCol: 80, tile: 3 },
    { row: 20, startCol: 83, endCol: 88, tile: 3 },

    // Orilla alta antes de la cascada.
    { row: 24, startCol: 91, endCol: 103, tile: 1 },
    { row: 25, startCol: 91, endCol: 103, tile: 2 },
    { row: 26, startCol: 91, endCol: 103, tile: 2 },
    { row: 27, startCol: 91, endCol: 103, tile: 2 },

    // Último salto y orilla de la meta.
    { row: 22, startCol: 105, endCol: 109, tile: 3 },
    { row: 25, startCol: 113, endCol: 119, tile: 1 },
    { row: 26, startCol: 113, endCol: 119, tile: 2 },
    { row: 27, startCol: 113, endCol: 119, tile: 2 },
  ],
  gravityY: 780,
  playerSpawnX: 96,
  playerSpawnYOffset: 230,
  goalTileX: 116,
  goalTileY: 20,
  enemies: [
    { col: 8, row: 26, type: "river-worm", patrolRange: 52 },
    { col: 36, row: 25, type: "river-worm", patrolRange: 64 },
    { col: 66, row: 25, type: "river-worm", patrolRange: 64 },
    { col: 77, row: 23, type: "river-worm", patrolRange: 24 },
    { col: 97, row: 24, type: "river-worm", patrolRange: 50 },
  ],
  items: [
    { col: 18, row: 24, type: "lulo" },
    { col: 25, row: 22, type: "fries" },
    { col: 47, row: 23, type: "guava" },
    { col: 85, row: 20, type: "burger" },
    { col: 107, row: 22, type: "lulo" },
  ],
};
