import Phaser from "phaser";

import { ASSETS } from "../../config/assets";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../../config/game";

type DialogueOverlayOptions = {
  speaker: string;
  pages: readonly string[];
  onDismiss?: () => void;
};

export class DialogueOverlay {
  private readonly container: Phaser.GameObjects.Container;
  private readonly pages: readonly string[];
  private readonly message: Phaser.GameObjects.Text;
  private readonly hint: Phaser.GameObjects.Text;
  private readonly onDismiss?: () => void;
  private currentPage = 0;
  private dismissed = false;

  private readonly handlePointer = () => {
    this.advance();
  };

  private readonly handleKey = (event: KeyboardEvent) => {
    if (!event.repeat) {
      this.advance();
    }
  };

  constructor(
    private readonly scene: Phaser.Scene,
    options: DialogueOverlayOptions
  ) {
    this.onDismiss = options.onDismiss;
    this.pages = options.pages.filter(
      (page) => page.trim().length > 0
    );

    const inputSurface = scene.add
      .zone(0, 0, GAME_WIDTH, GAME_HEIGHT)
      .setOrigin(0)
      .setInteractive();

    const panel = scene.add.graphics();
    panel.fillStyle(0x050b18, 0.9);
    panel.fillRoundedRect(154, 500, 1038, 180, 18);
    panel.lineStyle(4, 0xf5d59a, 1);
    panel.strokeRoundedRect(154, 500, 1038, 180, 18);

    // Usa el frame original transparente de Andrés. No se genera, recorta ni
    // procesa ninguna imagen para construir este diálogo.
    const portrait = scene.add
      .sprite(112, 694, ASSETS.andres, 0)
      .setOrigin(0.5, 1)
      .setDisplaySize(108, 343);

    const speaker = scene.add.text(
      200,
      520,
      options.speaker,
      {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "16px",
        color: "#f5d59a",
        stroke: "#070c18",
        strokeThickness: 4,
      }
    );

    this.message = scene.add.text(
      200,
      558,
      this.pages[0] ?? "",
      {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "15px",
        color: "#fff4da",
        lineSpacing: 10,
        wordWrap: {
          width: 920,
          useAdvancedWrap: true,
        },
      }
    );

    this.hint = scene.add
      .text(
        1160,
        654,
        this.getHintText(),
        {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "9px",
          color: "#d8bc86",
        }
      )
      .setOrigin(1, 0.5);

    this.container = scene.add
      .container(0, 0, [
        inputSurface,
        panel,
        portrait,
        speaker,
        this.message,
        this.hint,
      ])
      .setDepth(10_000)
      .setScrollFactor(0);

    scene.input.on(
      "pointerdown",
      this.handlePointer
    );
    scene.input.keyboard?.on(
      "keydown",
      this.handleKey
    );
  }

  private advance() {
    if (this.dismissed) {
      return;
    }

    if (this.currentPage < this.pages.length - 1) {
      this.currentPage += 1;
      this.message.setText(this.pages[this.currentPage]);
      this.hint.setText(this.getHintText());
      return;
    }

    this.dismiss();
  }

  private getHintText() {
    const total = Math.max(this.pages.length, 1);
    const page = Math.min(this.currentPage + 1, total);

    return `${page}/${total} · CLIC O CUALQUIER TECLA`;
  }

  dismiss() {
    if (this.dismissed) {
      return;
    }

    this.dismissed = true;
    this.removeListeners();
    this.container.destroy(true);
    this.onDismiss?.();
  }

  destroy() {
    if (this.dismissed) {
      return;
    }

    this.dismissed = true;
    this.removeListeners();
    this.container.destroy(true);
  }

  private removeListeners() {
    this.scene.input.off(
      "pointerdown",
      this.handlePointer
    );
    this.scene.input.keyboard?.off(
      "keydown",
      this.handleKey
    );
  }
}
