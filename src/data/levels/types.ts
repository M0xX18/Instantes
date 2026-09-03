import type { CollectibleType } from "../../config/items";
import type { LevelKey } from "../../systems/progression/LevelProgress";

export type PlayableLevelKey = Exclude<
  LevelKey,
  "mundo-6"
>;

export type EnemyType =
  | "avocado"
  | "spider"
  | "river-worm";

export type EnemyDefinition = {
  col: number;
  row: number;
  type: EnemyType;
  patrolRange: number;
  speech?: string;
};

export type ItemDefinition = {
  col: number;
  row: number;
  type: CollectibleType;
};

export type TerrainSegment = {
  row: number;
  startCol: number;
  endCol: number;
  tile: 1 | 2 | 3;
};

export type LevelDefinition = {
  key: PlayableLevelKey;
  mapKey: string;
  background: string;
  terrain?: readonly TerrainSegment[];
  gravityY: number;
  playerSpawnX: number;
  playerSpawnYOffset: number;
  goalTileX: number;
  goalTileY: number;
  enemies: readonly EnemyDefinition[];
  items: readonly ItemDefinition[];
};
