import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/game";
import type { LevelKey } from "../systems/progression/LevelProgress";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create(data: {
    worldKey: LevelKey;
    reason?: "tiempo" | "enemigo" | "vacio";
  }) {
    const worldKey = data?.worldKey ?? "mundo-1";
    const reason = data?.reason ?? "tiempo";

    const bg = this.add.graphics();
    bg.fillStyle(0x150204, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    for (let y = 0; y < GAME_HEIGHT; y += 6) {
      bg.fillStyle(0xff2222, 0.03);
      bg.fillRect(0, y, GAME_WIDTH, 2);
    }

    const panelW = 540;
    const panelH = 280;
    const px = (GAME_WIDTH - panelW) / 2;
    const py = (GAME_HEIGHT - panelH) / 2;
    const panel = this.add.graphics();
    panel.fillStyle(0x1a0203, 0.95);
    panel.fillRoundedRect(px, py, panelW, panelH, 12);
    panel.lineStyle(2, 0xff4444, 0.7);
    panel.strokeRoundedRect(px, py, panelW, panelH, 12);

    const title =
      reason === "enemigo"
        ? "HAS MUERTO"
        : reason === "vacio"
          ? "CAISTE AL VACIO"
          : "TIEMPO AGOTADO";

    const subtitle =
      reason === "enemigo"
        ? "Un enemigo acabo contigo..."
        : reason === "vacio"
          ? "Calcula mejor el siguiente salto"
          : "No llegaste a la meta a tiempo";

    const titleText = this.add.text(GAME_WIDTH / 2, py + 52, title, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "22px",
      color: "#ff4444",
      stroke: "#300000",
      strokeThickness: 5,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, py + 112, subtitle, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "9px",
      color: "#cc8888",
    }).setOrigin(0.5);

    this.makeButton(GAME_WIDTH / 2 - 110, py + 204, "REINTENTAR", () => {
      this.cameras.main.fadeOut(300, 2, 1, 10);
      this.cameras.main.once("camerafadeoutcomplete", () =>
        this.scene.start("WorldScene", { worldKey }),
      );
    });

    this.makeButton(GAME_WIDTH / 2 + 110, py + 204, "MENU", () => {
      this.cameras.main.fadeOut(300, 2, 1, 10);
      this.cameras.main.once("camerafadeoutcomplete", () =>
        this.scene.start("MapSelectScene"),
      );
    });

    this.tweens.add({
      targets: titleText,
      alpha: { from: 1, to: 0.3 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    this.cameras.main.fadeIn(600, 30, 0, 0);
  }

  private makeButton(x: number, y: number, label: string, onClick: () => void) {
    const btn = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: "11px",
      color: "#fff5d6",
      backgroundColor: "#3d0a0a",
      padding: { x: 14, y: 9 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    btn.on("pointerover", () => btn.setColor("#ff8888"));
    btn.on("pointerout", () => btn.setColor("#fff5d6"));
    btn.on("pointerup", onClick);
  }
}
