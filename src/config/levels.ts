import type { LevelKey } from "../systems/progression/LevelProgress";
import { MUNDO_1 } from "../data/levels/mundo1";
import { MUNDO_2 } from "../data/levels/mundo2";
import { MUNDO_3 } from "../data/levels/mundo3";
import { MUNDO_4 } from "../data/levels/mundo4";
import { MUNDO_5 } from "../data/levels/mundo5";
import type {
  LevelDefinition,
  PlayableLevelKey,
} from "../data/levels/types";

export const PLAYABLE_LEVELS: Record<
  PlayableLevelKey,
  LevelDefinition
> = {
  "mundo-1": MUNDO_1,
  "mundo-2": MUNDO_2,
  "mundo-3": MUNDO_3,
  "mundo-4": MUNDO_4,
  "mundo-5": MUNDO_5,
};

export function isPlayableLevel(
  levelKey: LevelKey
): levelKey is PlayableLevelKey {
  return levelKey !== "mundo-6";
}

export function getLevelSceneKey(
  levelKey: LevelKey
): "WorldScene" | "CinematicScene" {
  return levelKey === "mundo-6"
    ? "CinematicScene"
    : "WorldScene";
}
