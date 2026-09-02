import { ASSETS } from "../../config/assets";
import type { LevelDefinition } from "./types";

export const MUNDO_1: LevelDefinition = {
  key: "mundo-1",
  mapKey: ASSETS.mapaMundo1,
  background: ASSETS.fondoIsla,
  gravityY: 900,
  playerSpawnX: 96,
  playerSpawnYOffset: 230,
  goalTileX: 116,
  goalTileY: 20,
  enemies: [
    { col: 19, row: 25, type: "avocado", patrolRange: 50 },
    { col: 44, row: 23, type: "avocado", patrolRange: 55 },
    { col: 67, row: 21, type: "avocado", patrolRange: 50 },
    { col: 89, row: 23, type: "avocado", patrolRange: 50 },
    { col: 110, row: 22, type: "avocado", patrolRange: 45 },
  ],
  items: [
    { col: 8, row: 23, type: "fries" },
    { col: 31, row: 20, type: "broccoli" },
    { col: 50, row: 21, type: "lulo" },
    { col: 80, row: 21, type: "guava" },
    { col: 116, row: 20, type: "burger" },
  ],
};
