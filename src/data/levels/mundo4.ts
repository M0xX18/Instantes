import { ASSETS } from "../../config/assets";
import type { LevelDefinition } from "./types";

export const MUNDO_4: LevelDefinition = {
  key: "mundo-4",
  mapKey: ASSETS.mapaMundo4,
  background: ASSETS.fondoCiudad,
  gravityY: 980,
  playerSpawnX: 96,
  playerSpawnYOffset: 230,
  goalTileX: 116,
  goalTileY: 20,
  enemies: [
    {
      col: 19,
      row: 25,
      type: "avocado",
      patrolRange: 50,
      speech: "Esto es Soacha socia",
    },
    {
      col: 25,
      row: 22,
      type: "spider",
      patrolRange: 44,
      speech: "Bienvenida a Bosa",
    },
    {
      col: 44,
      row: 23,
      type: "river-worm",
      patrolRange: 50,
      speech: "Venga le digo deme la hora",
    },
    {
      col: 52,
      row: 21,
      type: "avocado",
      patrolRange: 42,
      speech: "Esto es Soacha socia",
    },
    {
      col: 67,
      row: 21,
      type: "spider",
      patrolRange: 44,
      speech: "Bienvenida a Bosa",
    },
    {
      col: 74,
      row: 19,
      type: "river-worm",
      patrolRange: 40,
      speech: "Venga le digo deme la hora",
    },
    {
      col: 89,
      row: 23,
      type: "avocado",
      patrolRange: 50,
      speech: "Esto es Soacha socia",
    },
    {
      col: 110,
      row: 22,
      type: "spider",
      patrolRange: 44,
      speech: "Bienvenida a Bosa",
    },
  ],
  items: [
    { col: 8, row: 23, type: "fries" },
    { col: 31, row: 20, type: "broccoli" },
    { col: 50, row: 21, type: "lulo" },
    { col: 80, row: 21, type: "guava" },
    { col: 116, row: 20, type: "burger" },
  ],
};
