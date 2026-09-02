import { ASSETS } from "../../config/assets";
import type { LevelDefinition } from "./types";

export const MUNDO_3: LevelDefinition = {
  key: "mundo-3",
  mapKey: ASSETS.mapaMundo3,
  background: ASSETS.fondoRiosCamino,
  finalBackground: ASSETS.fondoRios,
  gravityY: 780,
  playerSpawnX: 96,
  playerSpawnYOffset: 230,
  goalTileX: 116,
  goalTileY: 20,
  enemies: [
    { col: 19, row: 25, type: "river-worm", patrolRange: 58 },
    { col: 25, row: 22, type: "river-worm", patrolRange: 44 },
    { col: 44, row: 23, type: "river-worm", patrolRange: 52 },
    { col: 67, row: 21, type: "river-worm", patrolRange: 46 },
    { col: 89, row: 23, type: "river-worm", patrolRange: 52 },
    { col: 110, row: 22, type: "river-worm", patrolRange: 42 },
  ],
  items: [
    { col: 8, row: 23, type: "lulo" },
    { col: 31, row: 20, type: "fries" },
    { col: 50, row: 21, type: "guava" },
    { col: 80, row: 21, type: "burger" },
    { col: 116, row: 20, type: "lulo" },
  ],
};
