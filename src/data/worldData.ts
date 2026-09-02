import type { CollectibleType } from "../config/items";

export type EnemyType = "spider" | "avocado";

export type EnemyDefinition = {
  col: number;
  row: number;
  type: EnemyType;
  patrolRange: number;
};

export type ItemDefinition = {
  col: number;
  row: number;
  type: CollectibleType;
};

export const WORLD_1_ENEMIES: EnemyDefinition[] = [
  {
    col: 19,
    row: 25,
    type: "avocado",
    patrolRange: 50,
  },
  {
    col: 25,
    row: 22,
    type: "spider",
    patrolRange: 45,
  },
  {
    col: 44,
    row: 23,
    type: "avocado",
    patrolRange: 55,
  },
  {
    col: 52,
    row: 21,
    type: "spider",
    patrolRange: 42,
  },
  {
    col: 67,
    row: 21,
    type: "avocado",
    patrolRange: 50,
  },
  {
    col: 74,
    row: 19,
    type: "spider",
    patrolRange: 42,
  },
  {
    col: 89,
    row: 23,
    type: "avocado",
    patrolRange: 50,
  },
  {
    col: 110,
    row: 22,
    type: "spider",
    patrolRange: 45,
  },
];

export const WORLD_1_ITEMS: ItemDefinition[] = [
  {
    col: 8,
    row: 23,
    type: "fries",
  },
  {
    col: 31,
    row: 20,
    type: "broccoli",
  },
  {
    col: 50,
    row: 21,
    type: "lulo",
  },
  {
    col: 80,
    row: 21,
    type: "guava",
  },
  {
    col: 116,
    row: 20,
    type: "burger",
  },
];
