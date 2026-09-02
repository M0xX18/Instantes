import Phaser from "phaser";

import { ASSETS } from "../config/assets";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../config/game";
import { getLevelSceneKey } from "../config/levels";
import type { LevelKey } from "../systems/progression/LevelProgress";

type WinData = {
  worldKey: LevelKey;
  timeMs: number;
  unlockedLevel?: LevelKey | null;
};

export class WinScene extends Phaser.Scene {
  constructor() {
    super("WinScene");
  }

  create(data: WinData) {
    const timeMs = data?.timeMs ?? 0;
    const worldKey = data?.worldKey ?? "mundo-1";
    const unlockedLevel = data?.unlockedLevel ?? null;

    this.createBackground();

    const resultPanel = this.createResultPanel(
      worldKey,
      timeMs,
      unlockedLevel
    );

    resultPanel
      .setAlpha(0)
      .setVisible(false);

    this.createVictoryKiss(() => {
      this.spawnConfetti();
      resultPanel.setVisible(true);

      for (const button of resultPanel.getData(
        "buttons"
      ) as Phaser.GameObjects.Text[]) {
        button.setInteractive({
          useHandCursor: true,
        });
      }

      this.tweens.add({
        targets: resultPanel,
        alpha: 1,
        y: { from: 18, to: 0 },
        duration: 420,
        ease: "Back.Out",
      });
    });

    this.cameras.main.fadeIn(
      500,
      2,
      1,
      10
    );
  }

  private createBackground() {
    const background = this.add.graphics();
    background.fillGradientStyle(
      0x021a0f,
      0x021a0f,
      0x0a3824,
      0x0a3824,
      1
    );
    background.fillRect(
      0,
      0,
      GAME_WIDTH,
      GAME_HEIGHT
    );

    this.add
      .ellipse(
        GAME_WIDTH / 2,
        458,
        760,
        54,
        0x00150c,
        0.5
      )
      .setDepth(1);
  }

  private createVictoryKiss(
    onComplete: () => void
  ) {
    this.createVictoryAnimations();

    const stageFrame = this.add.graphics();
    stageFrame.lineStyle(3, 0xf5d59a, 0.75);
    stageFrame.strokeRoundedRect(
      263,
      6,
      524,
      480,
      18
    );
    stageFrame.setDepth(2);

    const kissAnimation = this.add
      .sprite(
        525,
        246,
        ASSETS.victoriaBeso,
        0
      )
      .setDisplaySize(480, 480)
      .setDepth(3)
      .play("victory-kiss");

    const arabellaGlow = this.add
      .ellipse(
        961,
        378,
        238,
        238,
        0xffd86b,
        0.12
      )
      .setDepth(2);

    this.tweens.add({
      targets: arabellaGlow,
      alpha: { from: 0.06, to: 0.2 },
      scale: { from: 0.92, to: 1.08 },
      duration: 720,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    this.add
      .sprite(
        961,
        482,
        ASSETS.arabella,
        0
      )
      .setOrigin(0.5, 249 / 351)
      .setScale(0.62)
      .setDepth(4)
      .play("win-arabella-celebrate");

    this.add
      .text(961, 252, "ARABELLA", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "10px",
        color: "#ffe6a3",
        stroke: "#4a2030",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(5);

    const kiss = this.add
      .text(650, 86, "¡MUAK!  ♥", {
        fontFamily: 'Arial, "Trebuchet MS", sans-serif',
        fontSize: "27px",
        fontStyle: "bold",
        color: "#ff8fbd",
        stroke: "#4a1633",
        strokeThickness: 5,
        resolution: 2,
      })
      .setOrigin(0.5)
      .setDepth(8)
      .setAlpha(0)
      .setScale(0.35);

    this.time.delayedCall(1_300, () => {
      this.tweens.add({
        targets: kiss,
        alpha: 1,
        scale: 1,
        duration: 220,
        ease: "Back.Out",
      });

      this.cameras.main.flash(
        160,
        255,
        120,
        170,
        false
      );
    });

    kissAnimation.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      () => {
        this.tweens.add({
          targets: kiss,
          y: kiss.y - 22,
          alpha: 0,
          duration: 360,
          delay: 180,
          ease: "Sine.In",
        });

        this.time.delayedCall(620, onComplete);
      }
    );
  }

  private createVictoryAnimations() {
    if (!this.anims.exists("victory-kiss")) {
      this.anims.create({
        key: "victory-kiss",
        frames: this.anims.generateFrameNumbers(
          ASSETS.victoriaBeso,
          {
            frames: [0, 1, 2, 3, 4, 5],
          }
        ),
        frameRate: 3.2,
        repeat: 0,
      });
    }

    if (!this.anims.exists("win-arabella-celebrate")) {
      this.anims.create({
        key: "win-arabella-celebrate",
        frames: this.anims.generateFrameNumbers(
          ASSETS.arabella,
          {
            frames: [0, 1, 2, 3, 2, 1],
          }
        ),
        frameRate: 7,
        repeat: -1,
      });
    }
  }

  private createResultPanel(
    worldKey: LevelKey,
    timeMs: number,
    unlockedLevel: LevelKey | null
  ): Phaser.GameObjects.Container {
    const panelW = 650;
    const panelH = 208;
    const px = (GAME_WIDTH - panelW) / 2;
    const py = 492;
    const panel = this.add.graphics();
    panel.fillStyle(0x051e12, 0.96);
    panel.fillRoundedRect(
      px,
      py,
      panelW,
      panelH,
      14
    );
    panel.lineStyle(3, 0x3affa0, 0.75);
    panel.strokeRoundedRect(
      px,
      py,
      panelW,
      panelH,
      14
    );

    const title = this.add
      .text(
        GAME_WIDTH / 2,
        py + 35,
        "NIVEL COMPLETADO",
        {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "20px",
          color: "#3affa0",
          stroke: "#002211",
          strokeThickness: 5,
        }
      )
      .setOrigin(0.5);

    const secs = timeMs / 1000;
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    const timeStr = `${minutes}:${seconds
      .toFixed(1)
      .padStart(4, "0")}`;

    const time = this.add
      .text(
        GAME_WIDTH / 2,
        py + 75,
        `TIEMPO: ${timeStr}`,
        {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "12px",
          color: "#fff5d6",
        }
      )
      .setOrigin(0.5);

    const messageText =
      worldKey === "mundo-6"
        ? "HISTORIA COMPLETADA"
        : unlockedLevel
          ? `NUEVA ZONA: ${unlockedLevel.toUpperCase()}`
          : secs < 30
            ? "VELOCIDAD DE LUZ!"
            : secs < 60
              ? "BUEN TRABAJO!"
              : "LO LOGRASTE!";

    const message = this.add
      .text(
        GAME_WIDTH / 2,
        py + 108,
        messageText,
        {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "10px",
          color: "#a8f0ff",
        }
      )
      .setOrigin(0.5);

    const retryLabel =
      worldKey === "mundo-6"
        ? "VER DE NUEVO"
        : "REINTENTAR";

    const retry = this.makeButton(
      GAME_WIDTH / 2 - 130,
      py + 162,
      retryLabel,
      () => {
        this.cameras.main.fadeOut(300, 2, 1, 10);
        this.cameras.main.once(
          "camerafadeoutcomplete",
          () =>
            this.scene.start(
              getLevelSceneKey(worldKey),
              { worldKey }
            )
        );
      }
    );

    const menu = this.makeButton(
      GAME_WIDTH / 2 + 130,
      py + 162,
      "MENU",
      () => {
        this.cameras.main.fadeOut(300, 2, 1, 10);
        this.cameras.main.once(
          "camerafadeoutcomplete",
          () => this.scene.start("MapSelectScene")
        );
      }
    );

    const container = this.add
      .container(0, 0, [
        panel,
        title,
        time,
        message,
        retry,
        menu,
      ])
      .setDepth(10);

    container.setData("buttons", [retry, menu]);
    return container;
  }

  private makeButton(
    x: number,
    y: number,
    label: string,
    onClick: () => void
  ): Phaser.GameObjects.Text {
    const button = this.add
      .text(x, y, label, {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "11px",
        color: "#fff5d6",
        backgroundColor: "#0a3d22",
        padding: {
          x: 14,
          y: 9,
        },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on(
      "pointerover",
      () => button.setColor("#3affa0")
    );
    button.on(
      "pointerout",
      () => button.setColor("#fff5d6")
    );
    button.on("pointerup", onClick);
    button.disableInteractive();

    return button;
  }

  private spawnConfetti() {
    const colors = [
      0x3affa0,
      0xa8f0ff,
      0xffe066,
      0xff7eb3,
      0xffffff,
    ];

    for (let i = 0; i < 55; i += 1) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(-60, -10);
      const color = colors[i % colors.length];
      const dot = this.add.rectangle(
        x,
        y,
        Phaser.Math.Between(4, 9),
        Phaser.Math.Between(4, 9),
        color,
        Phaser.Math.FloatBetween(0.6, 1)
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
