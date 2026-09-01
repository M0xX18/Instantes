import Phaser from "phaser";

export class WorldHUD {
  private scene: Phaser.Scene;
  private timerText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create(initialTimeMs: number) {
    this.timerText = this.scene.add.text(
      10,
      10,
      this.formatTime(initialTimeMs),
      {
        fontFamily: '"Cinzel", monospace',
        fontSize: "32px",
        color: "#efe6d0",
        fixedWidth: 200,
      }
    );
    this.timerText
      .setScrollFactor(0)
      .setDepth(20);

    this.scene.add
      .text(
        16,
        50,
        "<< >>/AD mover  ^/W saltar  v/S agachar  J/X disparar  ESC pausa",
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

  updateTimer(timeMs: number) {
    const color =
      timeMs < 10000
        ? "#ff6b6b"
        : timeMs < 30000
          ? "#ffaa00"
          : "#efe6d0";

    this.timerText
      .setText(this.formatTime(timeMs))
      .setColor(color);
  }

  private formatTime(ms: number): string {
    const seconds = Math.ceil(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  destroy() {
    this.timerText.destroy();
  }
}
