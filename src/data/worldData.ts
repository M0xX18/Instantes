export type EnemyType = "spider" | "avocado";

export type EnemyDefinition = {
  col: number;
  row: number;
  type: EnemyType;
  patrolRange: number;
};

export const WORLD_1_ENEMIES: EnemyDefinition[] = [
  {
    col: 25,
    row: 20,
    type: "avocado",
    patrolRange: 90,
  },
  {
    col: 38,
    row: 21,
    type: "spider",
    patrolRange: 80,
  },
  {
    col: 47,
    row: 20,
    type: "avocado",
    patrolRange: 70,
  },
  {
    col: 53,
    row: 18,
    type: "spider",
    patrolRange: 60,
  },
  {
    col: 68,
    row: 19,
    type: "avocado",
    patrolRange: 75,
  },
  {
    col: 74,
    row: 17,
    type: "spider",
    patrolRange: 60,
  },
  {
    col: 87,
    row: 19,
    type: "avocado",
    patrolRange: 75,
  },
  {
    col: 105,
    row: 18,
    type: "spider",
    patrolRange: 80,
  },
];