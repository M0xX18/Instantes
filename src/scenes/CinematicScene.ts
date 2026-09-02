import Phaser from "phaser";

import { ASSETS } from "../config/assets";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../config/game";
import {
  LevelProgress,
  type LevelKey,
} from "../systems/progression/LevelProgress";
import { DialogueOverlay } from "../systems/ui/DialogueOverlay";

const CINEMATIC_DURATION_MS = 10_000;

export class CinematicScene extends Phaser.Scene {
  private completed = false;
  private worldKey: LevelKey = "mundo-6";
  private dialogue?: DialogueOverlay;

  constructor() {
    super("CinematicScene");
  }

  init(data: { worldKey?: LevelKey }) {
    this.worldKey = data?.worldKey ?? "mundo-6";
    this.completed = false;
    this.dialogue = undefined;
  }

  create() {
    // Conserva la imagen actual del último nivel como espacio para la futura
    // cinemática. No crea jugador, físicas, enemigos, HUD ni controles.
    this.add
      .image(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        ASSETS.mapaIsla
      )
      .setDisplaySize(
        GAME_WIDTH,
        GAME_HEIGHT
      );

    this.cameras.main.fadeIn(
      700,
      2,
      1,
      10
    );

    this.dialogue = new DialogueOverlay(
      this,
      {
        speaker: "ANDRÉS",
        pages: [
          "Papitas, has cruzado cada etapa de nuestra historia.",
          "El futuro aún no está escrito.",
          "Pero nunca tendrás que recorrerlo sola.",
        ],
        onDismiss: () => {
          this.dialogue = undefined;
        },
      }
    );

    this.time.delayedCall(
      CINEMATIC_DURATION_MS,
      () => this.completeCinematic()
    );

    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => this.dialogue?.destroy()
    );
  }

  private completeCinematic() {
    if (this.completed) {
      return;
    }

    this.completed = true;
    this.dialogue?.destroy();
    this.dialogue = undefined;

    const { newlyUnlockedLevel } =
      LevelProgress.complete(
        this.worldKey
      );

    this.cameras.main.fadeOut(
      700,
      2,
      1,
      10
    );

    this.cameras.main.once(
      "camerafadeoutcomplete",
      () => {
        this.scene.start("WinScene", {
          worldKey: this.worldKey,
          timeMs: CINEMATIC_DURATION_MS,
          unlockedLevel:
            newlyUnlockedLevel,
        });
      }
    );
  }
}
