import Phaser from "phaser";
import { ASSETS } from "../config/assets";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/game";

export class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  create() {
    this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, ASSETS.fondoEspacio)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    this.time.delayedCall(700, () => this.playIntro());
  }

  private playIntro() {
    const video = this.add
      .video(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2
      )
      .setOrigin(0.5)
      .setDepth(5)
      .setVisible(false);

    let finished = false;
    let usingFallback = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      this.cameras.main.fadeOut(700, 2, 1, 10);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("MapSelectScene");
      });
    };

    const fallback = () => {
      if (finished || usingFallback) return;
      usingFallback = true;
      video.destroy();
      this.playFallback(finish);
    };

    video.once("complete", finish);
    video.once("unsupported", fallback);
    video.once("error", fallback);

    // El video estaba usando su resolución nativa (por ejemplo 1920x1080)
    // dentro de un juego de 1280x720. Esperamos al primer frame para conocer
    // su tamaño real y lo ajustamos con contain: nunca se recorta ni deforma.
    video.once(
      Phaser.GameObjects.Events.VIDEO_CREATED,
      (
        _video: Phaser.GameObjects.Video,
        sourceWidth: number,
        sourceHeight: number
      ) => {
        const containScale = Math.min(
          GAME_WIDTH / sourceWidth,
          GAME_HEIGHT / sourceHeight
        );

        video
          .setDisplaySize(
            Math.round(
              sourceWidth * containScale
            ),
            Math.round(
              sourceHeight * containScale
            )
          )
          .setVisible(true);
      }
    );

    try {
      video.loadURL("assets/video/intro.mp4", true);
      const playResult: unknown = video.play(false);
      if (playResult instanceof Promise) {
        playResult.catch(() => fallback());
      }
      this.time.delayedCall(1500, () => {
        if (!video.isPlaying() && !finished) {
          fallback();
        }
      });
    } catch {
      fallback();
    }
  }

  private playFallback(onDone: () => void) {
    const line = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Un instante, una historia.", {
        fontFamily: "Cinzel, serif",
        fontSize: "28px",
        color: "#f4ead0",
        align: "center",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: line,
      alpha: 1,
      duration: 900,
      delay: 200,
      yoyo: true,
      hold: 1400,
      onComplete: onDone,
    });
  }
}
