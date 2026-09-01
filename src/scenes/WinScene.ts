import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/game";

export class WinScene extends Phaser.Scene {
  constructor() {
    super("WinScene");
  }

  create(data: { worldKey: string; timeMs: number }) {
    const timeMs = data?.timeMs ?? 0;
    const worldKey = data?.worldKey ?? "mundo-1";

    // Fondo oscuro con tinte verde
    const bg = this.add.graphics();
    bg.fillStyle(0x021a0f, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Destellos de celebracion (confeti codigo puro)
    this.spawnConfetti();

    // Panel central
    const panelW = 560;
    const panelH = 320;
    const px = (GAME_WIDTH - panelW) / 2;
    const py = (GAME_HEIGHT - panelH) / 2;
    const panel = this.add.graphics();
    panel.fillStyle(0x051e12, 0.95);
    panel.fillRoundedRect(px, py, panelW, panelH, 12);
    panel.lineStyle(2, 0x3affa0, 0.7);
    panel.strokeRoundedRect(px, py, panelW, panelH, 12);

    // Titulo
    this.add.text(GAME_WIDTH / 2, py + 52, "NIVEL COMPLETADO", {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "22px",
      color: "#3affa0",
      stroke: "#002211",
      strokeThickness: 5,
    }).setOrigin(0.5);

    // Tiempo
    const secs = timeMs / 1000;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const timeStr = `${m}:${s.toFixed(1).padStart(4, "0")}`;
    this.add.text(GAME_WIDTH / 2, py + 112, `TIEMPO: ${timeStr}`, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "14px",
      color: "#fff5d6",
    }).setOrigin(0.5);

    // Mensaje motivacional segun tiempo
    const msg = secs < 30 ? "VELOCIDAD DE LUZ!" : secs < 60 ? "BUEN TRABAJO!" : "LO LOGRASTE!";
    this.add.text(GAME_WIDTH / 2, py + 155, msg, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "11px",
      color: "#a8f0ff",
    }).setOrigin(0.5);

    // Botones
    this.makeButton(GAME_WIDTH / 2 - 120, py + 232, "REINTENTAR", () => {
      this.cameras.main.fadeOut(300, 2, 1, 10);
      this.cameras.main.once("camerafadeoutcomplete", () =>
        this.scene.start("WorldScene", { worldKey }),
      );
    });

    this.makeButton(GAME_WIDTH / 2 + 120, py + 232, "MENU", () => {
      this.cameras.main.fadeOut(300, 2, 1, 10);
      this.cameras.main.once("camerafadeoutcomplete", () =>
        this.scene.start("MapSelectScene"),
      );
    });

    this.cameras.main.fadeIn(500, 2, 1, 10);
  }

  private makeButton(x: number, y: number, label: string, onClick: () => void) {
    const btn = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "11px",
      color: "#fff5d6",
      backgroundColor: "#0a3d22",
      padding: { x: 14, y: 9 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    btn.on("pointerover", () => btn.setColor("#3affa0"));
    btn.on("pointerout", () => btn.setColor("#fff5d6"));
    btn.on("pointerup", onClick);
  }

  private spawnConfetti() {
    const colors = [0x3affa0, 0xa8f0ff, 0xffe066, 0xff7eb3, 0xffffff];
    for (let i = 0; i < 55; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(-60, -10);
      const color = colors[i % colors.length];
      const dot = this.add.rectangle(
        x, y,
        Phaser.Math.Between(4, 9),
        Phaser.Math.Between(4, 9),
        color,
        Phaser.Math.FloatBetween(0.6, 1.0),
      );
      this.tweens.add({
        targets: dot,
        y: GAME_HEIGHT + 20,
        x: x + Phaser.Math.Between(-80, 80),
        angle: Phaser.Math.Between(-360, 360),
        alpha: { from: 1, to: 0 },
        duration: Phaser.Math.Between(1800, 3800),
        delay: Phaser.Math.Between(0, 800),
        ease: "Sine.In",
        onComplete: () => dot.destroy(),
      });
    }
  }
}
