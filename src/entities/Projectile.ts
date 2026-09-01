import Phaser from "phaser";
import { ASSETS } from "../config/assets";

export class Projectile extends Phaser.Physics.Arcade.Image {
  private static readonly SPEED = 560;

  constructor(scene: Phaser.Scene, x: number, y: number, direction: number) {
    super(scene, x, y, ASSETS.proyectil);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(6);
    this.setScale(0.85);
    this.setVelocityX(direction * Projectile.SPEED);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.setRotation(direction < 0 ? Math.PI : 0);
    this.body!.setSize(10, 10);
  }

  update() {
    if (this.x < -32 || this.x > this.scene.physics.world.bounds.width + 32) {
      this.destroy();
    }
  }
}
