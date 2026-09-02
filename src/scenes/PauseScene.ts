import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/game";
import { LevelProgress } from "../systems/progression/LevelProgress";

export class PauseScene extends Phaser.Scene {
  constructor() {
    super("PauseScene");
  }

  create() {
    const overlay = this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x02010a,
      0.72,
    );
    overlay.setScrollFactor(0);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 105, "PAUSA", {
        fontFamily: "Cinzel, serif",
        fontSize: "48px",
        color: "#f4ead0",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    const resume = this.makeButton(GAME_HEIGHT / 2 - 15, "Continuar", () => {
      this.closePause();
    });

    this.makeButton(resume.y + 56, "Volver al mapa", () => {
      this.scene.stop("WorldScene");
      this.scene.start("MapSelectScene");
    });

    this.createNewGameButton(resume.y + 112);

    this.input.keyboard!.once("keydown-ESC", () => this.closePause());
  }

  private makeButton(y: number, label: string, onClick: () => void) {
    const text = this.add
      .text(GAME_WIDTH / 2, y, label, {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "14px",
        color: "#efe6d0",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    text.on("pointerover", () => text.setColor("#ffd27a"));
    text.on("pointerout", () => text.setColor("#efe6d0"));
    text.on("pointerup", onClick);
    return text;
  }

  private createNewGameButton(y: number) {
    let confirmationExpires:
      | Phaser.Time.TimerEvent
      | undefined;

    const button = this.makeButton(
      y,
      "Nueva partida",
      () => {
        if (!button.getData("confirming")) {
          button
            .setData("confirming", true)
            .setText("Confirmar nueva partida")
            .setColor("#ff8b8b");

          confirmationExpires?.remove(false);
          confirmationExpires =
            this.time.delayedCall(
              4000,
              () => {
                button
                  .setData("confirming", false)
                  .setText("Nueva partida")
                  .setColor("#efe6d0");
              }
            );

          return;
        }

        confirmationExpires?.remove(false);
        LevelProgress.reset();
        this.scene.stop("WorldScene");
        this.scene.start("MapSelectScene");
      }
    );

    button.setData("confirming", false);
  }

  private closePause() {
    this.scene.stop();
    this.scene.resume("WorldScene");
    const world = this.scene.get("WorldScene");
    world.events.emit("resume-world");
  }
}
