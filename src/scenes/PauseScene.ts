import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/game";

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
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, "PAUSA", {
        fontFamily: "Cinzel, serif",
        fontSize: "48px",
        color: "#f4ead0",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    const resume = this.makeButton(GAME_HEIGHT / 2 + 20, "Continuar", () => {
      this.closePause();
    });
    this.makeButton(resume.y + 56, "Volver al mapa", () => {
      this.scene.stop("WorldScene");
      this.scene.stop();
      this.scene.start("TitleScene");
    });

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

  private closePause() {
    this.scene.stop();
    this.scene.resume("WorldScene");
    const world = this.scene.get("WorldScene");
    world.events.emit("resume-world");
  }
}
