import Phaser from "phaser";
import { ASSETS } from "../config/assets";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/game";

export class TitleScene extends Phaser.Scene {
  private isStarting = false;

  constructor() {
    super("TitleScene");
  }

  create() {
    this.isStarting = false;
    this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, ASSETS.fondoEspacio)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    const title = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "INSTANTES", {
        fontFamily: "Cinzel, serif",
        fontSize: "72px",
        color: "#f7edd4",
      })
      .setOrigin(0.5);

    const subtitle = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 36, "La historia de\nPapitas", {
        fontFamily: "Cinzel, serif",
        fontSize: "22px",
        color: "#d9cbb0",
        align: "center",
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    const playX = GAME_WIDTH / 2;
    const playY = GAME_HEIGHT / 2 + 150;
    const playIcon = this.add
      .text(-46, 1, "▶", {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        color: "#ffe7b0",
      })
      .setOrigin(0.5);
    const play = this.add
      .text(18, 0, "JUGAR", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "16px",
        color: "#ffe7b0",
      })
      .setOrigin(0.5);

    const playWrap = this.add.container(playX, playY, [playIcon, play]);
    const playHit = this.add
      .zone(playX, playY, 220, 64)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: [playIcon, play],
      alpha: 0.45,
      duration: 900,
      yoyo: true,
      repeat: -1,
    });

    let hoverTween: Phaser.Tweens.Tween | undefined;
    const hoverOn = () => {
      hoverTween?.stop();
      hoverTween = this.tweens.add({
        targets: playWrap,
        scale: 1.18,
        duration: 160,
        ease: "Back.Out",
      });
    };
    const hoverOff = () => {
      hoverTween?.stop();
      hoverTween = this.tweens.add({
        targets: playWrap,
        scale: 1,
        duration: 140,
        ease: "Quad.Out",
      });
      this.input.setDefaultCursor("default");
    };

    playHit.on("pointerover", hoverOn);
    playHit.on("pointerout", hoverOff);
    playHit.on("pointerup", () => this.startIntro([title, subtitle], playWrap));

    this.input.keyboard!.once("keydown-ENTER", () =>
      this.startIntro([title, subtitle], playWrap),
    );
    this.input.keyboard!.once("keydown-SPACE", () =>
      this.startIntro([title, subtitle], playWrap),
    );
  }

  private startIntro(
    ui: Phaser.GameObjects.Text[],
    playButton: Phaser.GameObjects.Container,
  ) {
    if (this.isStarting) {
      return;
    }
    this.isStarting = true;
    this.input.enabled = false;
    playButton.setVisible(false);
    this.tweens.killTweensOf(playButton);
    this.tweens.add({
      targets: ui,
      alpha: 0,
      duration: 700,
      onComplete: () => {
        this.time.delayedCall(1100, () => {
          this.scene.start("IntroScene");
        });
      },
    });
  }
}
