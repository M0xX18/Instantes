import Phaser from "phaser";
import { ASSETS } from "../config/assets";

export type EnemyType = "spider" | "avocado";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private moveDir = 1;
  private readonly patrolLeft: number;
  private readonly patrolRight: number;
  private dead = false;

  private static readonly SPEED = 70;

  constructor(scene: Phaser.Scene, x: number, y: number, enemyType: EnemyType, patrolRange = 80) {
    const textureKey = enemyType === "spider" ? ASSETS.enemySpider : ASSETS.enemyAvocado;
    super(scene, x, y, textureKey);
    this.patrolLeft = x - patrolRange;
    this.patrolRight = x + patrolRange;

    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);
    scene.physics.add.existing(this as unknown as Phaser.GameObjects.GameObject);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(true);
    body.setCollideWorldBounds(true);

    // Scale to fit the world (sprites are 204x306, we want ~32px wide)
    this.setScale(0.19);
    if (enemyType === "spider") {
      body.setSize(160, 200, true);
    } else {
      body.setSize(150, 240, true);
    }

    this.setDepth(4);
    this.play(`${enemyType}-walk`);
  }

  isDead() { return this.dead; }

  die() {
    if (this.dead) return;
    this.dead = true;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setEnable(false);
    this.setVelocity(0, 0);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      y: this.y - 20,
      scaleY: 0.05,
      duration: 250,
      ease: "Power2.In",
      onComplete: () => this.destroy(),
    });
  }

  update() {
    if (this.dead) return;

    if (this.x <= this.patrolLeft) {
      this.moveDir = 1;
    } else if (this.x >= this.patrolRight) {
      this.moveDir = -1;
    }

    this.setVelocityX(this.moveDir * Enemy.SPEED);
    this.setFlipX(this.moveDir < 0);
  }
}
