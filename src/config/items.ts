export type CollectibleType =
  | "broccoli"
  | "guava"
  | "fries"
  | "lulo"
  | "burger";

export type PowerMode =
  | "default"
  | "fries"
  | "lulo"
  | "burger";

export const POWER_LABELS: Record<
  PowerMode,
  string
> = {
  default: "NORMAL",
  fries: "PAPITAS: PAPA INDIVIDUAL",
  lulo: "LULO: CADENCIA RAPIDA",
  burger: "HAMBURGUESA: TRIPLE TIRO",
};

export const ITEM_EFFECTS = {
  debuffDurationMs: 6000,
  broccoliSpeedMultiplier: 0.55,
  guavaCooldownMultiplier: 2,
} as const;
