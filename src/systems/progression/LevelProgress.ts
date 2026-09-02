export const LEVEL_KEYS = [
  "mundo-1",
  "mundo-2",
  "mundo-3",
  "mundo-4",
  "mundo-5",
  "mundo-6",
] as const;

export type LevelKey =
  (typeof LEVEL_KEYS)[number];

export type LevelStatus =
  | "completed"
  | "unlocked"
  | "next"
  | "locked";

type StoredProgress = {
  highestUnlockedIndex: number;
  completedLevels: LevelKey[];
};

export type CompletionResult = {
  newlyUnlockedLevel: LevelKey | null;
};

const DEFAULT_PROGRESS: StoredProgress = {
  highestUnlockedIndex: 0,
  completedLevels: [],
};

let memoryProgress: StoredProgress = {
  ...DEFAULT_PROGRESS,
  completedLevels: [],
};

function isLevelKey(
  value: unknown
): value is LevelKey {
  return LEVEL_KEYS.includes(
    value as LevelKey
  );
}

function sanitizeProgress(
  value: unknown
): StoredProgress {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_PROGRESS };
  }

  const candidate =
    value as Partial<StoredProgress>;

  const requestedIndex =
    Number.isInteger(
      candidate.highestUnlockedIndex
    )
      ? Number(candidate.highestUnlockedIndex)
      : 0;

  const highestUnlockedIndex = Math.max(
    0,
    Math.min(
      LEVEL_KEYS.length - 1,
      requestedIndex
    )
  );

  const completedLevels = Array.isArray(
    candidate.completedLevels
  )
    ? Array.from(
        new Set(
          candidate.completedLevels.filter(
            (level): level is LevelKey =>
              isLevelKey(level) &&
              LEVEL_KEYS.indexOf(level) <=
                highestUnlockedIndex
          )
        )
      )
    : [];

  return {
    highestUnlockedIndex,
    completedLevels,
  };
}

function readProgress(): StoredProgress {
  return {
    highestUnlockedIndex:
      memoryProgress.highestUnlockedIndex,
    completedLevels: [
      ...memoryProgress.completedLevels,
    ],
  };
}

function writeProgress(
  progress: StoredProgress
) {
  memoryProgress = sanitizeProgress(
    progress
  );
}

export const LevelProgress = {
  // El progreso dura únicamente mientras esta ejecución del juego siga viva.
  // Recargar o cerrar la página vuelve a crear este módulo desde Mundo 1.
  reset() {
    memoryProgress = {
      ...DEFAULT_PROGRESS,
      completedLevels: [],
    };
  },

  getStatus(levelKey: LevelKey): LevelStatus {
    const progress = readProgress();
    const levelIndex =
      LEVEL_KEYS.indexOf(levelKey);

    if (
      progress.completedLevels.includes(
        levelKey
      )
    ) {
      return "completed";
    }

    if (
      levelIndex <=
      progress.highestUnlockedIndex
    ) {
      return "unlocked";
    }

    if (
      levelIndex ===
      progress.highestUnlockedIndex + 1
    ) {
      return "next";
    }

    return "locked";
  },

  complete(
    levelKey: LevelKey
  ): CompletionResult {
    const levelIndex =
      LEVEL_KEYS.indexOf(levelKey);
    const progress = readProgress();

    // Impide saltarse la progresión iniciando una escena manualmente.
    if (
      levelIndex < 0 ||
      levelIndex >
        progress.highestUnlockedIndex
    ) {
      return { newlyUnlockedLevel: null };
    }

    const completedLevels =
      new Set(progress.completedLevels);

    completedLevels.add(levelKey);

    const nextLevelIndex = levelIndex + 1;
    const unlocksNewLevel =
      nextLevelIndex < LEVEL_KEYS.length &&
      nextLevelIndex >
        progress.highestUnlockedIndex;

    writeProgress({
      highestUnlockedIndex: Math.max(
        progress.highestUnlockedIndex,
        Math.min(
          nextLevelIndex,
          LEVEL_KEYS.length - 1
        )
      ),
      completedLevels:
        Array.from(completedLevels),
    });

    return {
      newlyUnlockedLevel: unlocksNewLevel
        ? LEVEL_KEYS[nextLevelIndex]
        : null,
    };
  },
};
