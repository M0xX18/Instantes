import Phaser from "phaser";
import { GAME_WIDTH } from "../../config/game";

export class WorldHUD {
  private readonly scene: Phaser.Scene;
  private timerText!: Phaser.GameObjects.Text;
  private timerBackground!: Phaser.GameObjects.Graphics;
  private controlsText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create(initialTimeMs: number) {
    this.createTimer(initialTimeMs);
    this.createControls();
  }

  private createTimer(initialTimeMs: number) {
    // -------------------------------------------------------------------------
    // TIMER
    // -------------------------------------------------------------------------
    // Posición: esquina superior derecha.
    // Diseño original: caja negra + texto azul.

    const pad = 12;
    const boxW = 110;
    const boxH = 34;

    const x = GAME_WIDTH - boxW - pad;
    const y = pad;

    // Fondo del timer.
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

    // Texto del timer.
    this.timerText =
      this.scene.add.text(
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
      );

    this.timerText
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(20);
  }

private createControls() {

// CONTROLES

  this.controlsText = this.scene.add.text(
    16,
    16,
    "<< >>/AD mover   ^/W saltar   v/S agachar   J/X disparar   ESC pausa",
    {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "8px",
      color: "#efe6d0",
    }
  );

  this.controlsText
    .setScrollFactor(0)
    .setDepth(20)
    .setAlpha(0.7);
}

  updateTimer(timeMs: number) {
    // El timer SIEMPRE permanece azul.
    this.timerText.setText(
      this.formatTime(timeMs)
    );

    this.timerText.setColor(
      "#a8f0ff"
    );
  }

  destroy() {
    this.timerText?.destroy();
    this.timerBackground?.destroy();
    this.controlsText?.destroy();
  }

  private formatTime(ms: number): string {
    const seconds =
      Math.ceil(ms / 1000);

    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
}