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

export class CinematicScene extends Phaser.Scene {
  private completed = false;
  private worldKey: LevelKey = "mundo-6";
  private dialogue?: DialogueOverlay;

  constructor() {
    super("CinematicScene");
  }

  init(data: { worldKey?: LevelKey }) {
    this.worldKey =
      data?.worldKey ?? "mundo-6";

    this.completed = false;
    this.dialogue = undefined;
  }

  create() {
    // Fondo del nivel 6
    this.add
      .image(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        ASSETS.atardecer
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
        speaker: "ANDRES",
        pages: [
          "Felicidades amor! Todo este camino representó una etapa de tu vida, el nacimiento, la niñez, la adolecencia, la adultez, el presente...",
          "Cada etapa la has superado, y ahora estamos aqui...",
          "Esta es la isla del futuro... Realmente es incierto... Pero me gustaria recorrerlo contigo",
          "Quiero que sepas que siempre estare para ti y que nunca te dejare! No sabemos que sucedera...",
          "Pero nunca tendrás que recorrerlo sola.",
          "FELIZ CUMPLEAÑOS!"
        ],

        onDismiss: () => {
          this.dialogue = undefined;
          this.completeCinematic();
        },
      }
    );

    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        this.dialogue?.destroy();
      }
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
          unlockedLevel:
            newlyUnlockedLevel,
        });
      }
    );
  }
}