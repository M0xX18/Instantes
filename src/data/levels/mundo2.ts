import { ASSETS } from "../../config/assets";
import type { LevelDefinition } from "./types";

export const MUNDO_2: LevelDefinition = {
  key: "mundo-2",
  mapKey: ASSETS.mapaMundo2,
  background: ASSETS.fondoJungla,
  gravityY: 940,
  playerSpawnX: 96,
  playerSpawnYOffset: 230,
  goalTileX: 116,
  goalTileY: 20,
  enemies: [
    { col: 19, row: 25, type: "spider", patrolRange: 52 },
    { col: 25, row: 22, type: "spider", patrolRange: 44 },
    { col: 52, row: 21, type: "spider", patrolRange: 42 },
    { col: 74, row: 19, type: "spider", patrolRange: 42 },
    { col: 89, row: 23, type: "spider", patrolRange: 48 },
    { col: 110, row: 22, type: "spider", patrolRange: 44 },
  ],
  items: [
    { col: 8, row: 23, type: "fries" },
    { col: 31, row: 20, type: "guava" },
    { col: 50, row: 21, type: "burger" },
    { col: 80, row: 21, type: "broccoli" },
    { col: 116, row: 20, type: "lulo" },
  ],
};
