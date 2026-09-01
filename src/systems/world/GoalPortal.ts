import Phaser from "phaser";

export class GoalPortal {
  private scene: Phaser.Scene;
  private portalGfx!: Phaser.GameObjects.Graphics;
  private portalLight!: Phaser.GameObjects.Graphics;
  private portalParticles: Phaser.GameObjects.Arc[] =
    [];
  private portalAngle = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create(x: number, y: number) {
    this.portalGfx = this.scene.add.graphics();
    this.portalGfx.setDepth(3);

    this.portalLight =
      this.scene.add.graphics();
    this.portalLight.setDepth(2);
    this.portalLight.setAlpha(0.15);

    this.portalParticles = [];
    for (let i = 0; i < 6; i++) {
      const arc = this.scene.add.arc(
        x,
        y,
        28 * (1 + i * 0.15),
        0,
        Math.PI * 2,
        false
      );
      arc.setStrokeStyle(2, 0xbb66ff, 0.4);
      arc.setDepth(3);
      this.portalParticles.push(arc);
    }

    return {
      x,
      y,
      particles: this.portalParticles,
    };
  }

  update() {
    this.portalAngle += 2;

    this.portalGfx.clear();
    this.portalLight.clear();

    const scale = 1 +
      Math.sin(
        this.portalAngle * 0.05
      ) * 0.1;

    for (let i = 0; i <
      this.portalParticles.length;
      i++) {
      const arc =
        this.portalParticles[i];

      if (!arc) continue;

      const r = 28 * (1 + i * 0.15);

      arc.setRadius(r * scale);

      arc.setRotation(
        this.portalAngle * 0.01
      );
    }

    this.portalGfx.fillStyle(
      0xbb66ff,
      0.3
    );
    this.portalGfx.fillCircle(
      this.portalParticles[0]?.x || 0,
      this.portalParticles[0]?.y || 0,
      12 * scale
    );

    this.portalLight.fillStyle(
      0xbb66ff
    );
    this.portalLight.fillCircle(
      this.portalParticles[0]?.x || 0,
      this.portalParticles[0]?.y || 0,
      20 * scale
    );
  }

  destroy() {
    this.portalGfx.destroy();
    this.portalLight.destroy();
    for (const arc of this.portalParticles) {
      arc.destroy();
    }
    this.portalParticles = [];
  }
}
