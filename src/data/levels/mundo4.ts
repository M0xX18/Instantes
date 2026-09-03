import { ASSETS } from "../../config/assets";
import type { LevelDefinition } from "./types";

export const MUNDO_4: LevelDefinition = {
  key: "mundo-4",
  mapKey: ASSETS.mapaMundo4,
  background: ASSETS.fondoCiudad,
  terrain: [
    // Primer edificio.
    { row: 25, startCol: 0, endCol: 17, tile: 1 },
    { row: 26, startCol: 0, endCol: 17, tile: 2 },
    { row: 27, startCol: 0, endCol: 17, tile: 2 },

    // Marquesina hacia el segundo edificio.
    { row: 22, startCol: 20, endCol: 24, tile: 3 },
    { row: 23, startCol: 27, endCol: 40, tile: 1 },
    { row: 24, startCol: 27, endCol: 40, tile: 2 },
    { row: 25, startCol: 27, endCol: 40, tile: 2 },
    { row: 26, startCol: 27, endCol: 40, tile: 2 },
    { row: 27, startCol: 27, endCol: 40, tile: 2 },

    // Escaleras de servicio entre azoteas.
    { row: 21, startCol: 42, endCol: 47, tile: 3 },
    { row: 19, startCol: 50, endCol: 55, tile: 3 },

    // Edificio central.
    { row: 22, startCol: 58, endCol: 70, tile: 1 },
    { row: 23, startCol: 58, endCol: 70, tile: 2 },
    { row: 24, startCol: 58, endCol: 70, tile: 2 },
    { row: 25, startCol: 58, endCol: 70, tile: 2 },
    { row: 26, startCol: 58, endCol: 70, tile: 2 },
    { row: 27, startCol: 58, endCol: 70, tile: 2 },

    // Tramo más alto de la ciudad.
    { row: 20, startCol: 72, endCol: 77, tile: 3 },
    { row: 18, startCol: 80, endCol: 85, tile: 3 },
    { row: 21, startCol: 88, endCol: 101, tile: 1 },
    { row: 22, startCol: 88, endCol: 101, tile: 2 },
    { row: 23, startCol: 88, endCol: 101, tile: 2 },
    { row: 24, startCol: 88, endCol: 101, tile: 2 },
    { row: 25, startCol: 88, endCol: 101, tile: 2 },
    { row: 26, startCol: 88, endCol: 101, tile: 2 },
    { row: 27, startCol: 88, endCol: 101, tile: 2 },

    // Salto final hacia la azotea de la meta.
    { row: 19, startCol: 103, endCol: 108, tile: 3 },
    { row: 23, startCol: 113, endCol: 119, tile: 1 },
    { row: 24, startCol: 113, endCol: 119, tile: 2 },
    { row: 25, startCol: 113, endCol: 119, tile: 2 },
    { row: 26, startCol: 113, endCol: 119, tile: 2 },
    { row: 27, startCol: 113, endCol: 119, tile: 2 },
  ],
  gravityY: 980,
  playerSpawnX: 96,
  playerSpawnYOffset: 230,
  goalTileX: 116,
  goalTileY: 20,
  enemies: [
    {
      col: 10,
      row: 25,
      type: "avocado",
      patrolRange: 50,
      speech: "Esto es Soacha socia",
    },
    {
      col: 22,
      row: 22,
      type: "spider",
      patrolRange: 44,
      speech: "Bienvenida a Bosa",
    },
    {
      col: 34,
      row: 23,
      type: "river-worm",
      patrolRange: 50,
      speech: "Venga le digo deme la hora",
    },
    {
      col: 64,
      row: 22,
      type: "avocado",
      patrolRange: 42,
      speech: "Esto es Soacha socia",
    },
    {
      col: 75,
      row: 20,
      type: "spider",
      patrolRange: 44,
      speech: "Bienvenida a Bosa",
    },
    {
      col: 95,
      row: 21,
      type: "river-worm",
      patrolRange: 40,
      speech: "Venga le digo deme la hora",
    },
    {
      col: 105,
      row: 19,
      type: "avocado",
      patrolRange: 50,
      speech: "Esto es Soacha socia",
    },
    {
      col: 53,
      row: 19,
      type: "spider",
      patrolRange: 44,
      speech: "Bienvenida a Bosa",
    },
  ],
  items: [
    { col: 22, row: 22, type: "fries" },
    { col: 45, row: 21, type: "broccoli" },
    { col: 55, row: 19, type: "lulo" },
    { col: 83, row: 18, type: "guava" },
    { col: 100, row: 21, type: "burger" },
  ],
};
