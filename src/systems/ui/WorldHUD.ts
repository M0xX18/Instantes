import Phaser from "phaser";
import { GAME_WIDTH } from "../../config/game";

export class WorldHUD {
  private readonly scene: Phaser.Scene;
  private timerText!: Phaser.GameObjects.Text;
  private timerBackground!: Phaser.GameObjects.Graphics;
  private controlsText!: Phaser.GameObjects.Text;
  private powerText!: Phaser.GameObjects.Text;
  private debuffText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create(initialTimeMs: number) {
    this.createTimer(initialTimeMs);
    this.createControls();
    this.createStatus();
  }

  updateTimer(timeMs: number) {
    this.timerText
      .setText(this.formatTime(timeMs))
      .setColor("#a8f0ff");
  }

  setPower(label: string) {
    this.powerText.setText(
      `PODER: ${label}`
    );
  }

  setDebuffs(labels: string[]) {
    this.debuffText.setText(
      labels.length > 0
        ? `PENALIZACION: ${labels.join(" + ")}`
        : ""
    );
  }

  destroy() {
    this.timerText?.destroy();
    this.timerBackground?.destroy();
    this.controlsText?.destroy();
    this.powerText?.destroy();
    this.debuffText?.destroy();
  }

  private createTimer(initialTimeMs: number) {
    const pad = 12;
    const boxW = 110;
    const boxH = 34;
    const x = GAME_WIDTH - boxW - pad;
    const y = pad;

    this.timerBackground =
      this.scene.add.graphics();

    this.timerBackground
      .fillStyle(0x000000, 0.55)
      .fillRoundedRect(
        x,
        y,
        boxW,
        boxH,
        8
      )
      .setScrollFactor(0)
      .setDepth(19);

    this.timerText = this.scene.add
      .text(
        x + boxW / 2,
        y + boxH / 2,
        this.formatTime(initialTimeMs),
        {
          fontFamily:
            '"Press Start 2P", monospace',
          fontSize: "16px",
          color: "#a8f0ff",
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(20);
  }

  private createControls() {
    this.controlsText = this.scene.add
      .text(
        16,
        16,
        "<< >>/AD mover   ^/W saltar   v/S agachar   J/X disparar   ESC pausa",
        {
          fontFamily:
            '"Press Start 2P", monospace',
          fontSize: "8px",
          color: "#efe6d0",
        }
      )
      .setScrollFactor(0)
      .setDepth(20)
      .setAlpha(0.7);
  }

  private createStatus() {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily:
        '"Press Start 2P", monospace',
      fontSize: "9px",
      stroke: "#07101f",
      strokeThickness: 3,
    };

    this.powerText = this.scene.add
      .text(
        16,
        38,
        "PODER: NORMAL",
        {
          ...style,
          color: "#ffe6a3",
        }
      )
      .setScrollFactor(0)
      .setDepth(20);

    this.debuffText = this.scene.add
      .text(
        16,
        58,
        "",
        {
          ...style,
          color: "#ff8b8b",
        }
      )
      .setScrollFactor(0)
      .setDepth(20);
  }

  private formatTime(ms: number): string {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
}
