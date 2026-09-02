import { ASSETS } from "../../config/assets";
import type { LevelDefinition } from "./types";

export const MUNDO_5: LevelDefinition = {
  key: "mundo-5",
  mapKey: ASSETS.mapaMundo5,
  background: ASSETS.fondoPradera,
  gravityY: 840,
  playerSpawnX: 96,
  playerSpawnYOffset: 230,
  goalTileX: 116,
  goalTileY: 20,
  enemies: [
    { col: 19, row: 25, type: "spider", patrolRange: 50 },
    { col: 25, row: 22, type: "river-worm", patrolRange: 44 },
    { col: 44, row: 23, type: "spider", patrolRange: 50 },
    { col: 67, row: 21, type: "river-worm", patrolRange: 44 },
    { col: 89, row: 23, type: "spider", patrolRange: 50 },
    { col: 110, row: 22, type: "river-worm", patrolRange: 42 },
  ],
  items: [
    { col: 8, row: 23, type: "fries" },
    { col: 31, row: 20, type: "lulo" },
    { col: 50, row: 21, type: "burger" },
    { col: 80, row: 21, type: "broccoli" },
    { col: 116, row: 20, type: "lulo" },
  ],
};
