import Phaser from "phaser";
import { ASSETS } from "../config/assets";

export type EnemyType = "spider" | "avocado";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private moveDir = 1;
  private readonly patrolLeft: number;
  private readonly patrolRight: number;
  private readonly groundLayer: Phaser.Tilemaps.TilemapLayer;
  private dead = false;

  private static readonly SPEED = 70;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    enemyType: EnemyType,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
    patrolRange = 80
  ) {
    const textureKey = enemyType === "spider" ? ASSETS.enemySpider : ASSETS.enemyAvocado;
    super(scene, x, y, textureKey);
    this.patrolLeft = x - patrolRange;
    this.patrolRight = x + patrolRange;
    this.groundLayer = groundLayer;

    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);
    scene.physics.add.existing(this as unknown as Phaser.GameObjects.GameObject);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(true);
    body.setAllowRotation(false);
    body.setCollideWorldBounds(true);
    body.setBounce(0);
    body.setMaxVelocity(
      Enemy.SPEED,
      700
    );

    // Ligeramente más grandes que los tiles, sin tapar las plataformas.
    this.setScale(0.23);
    if (enemyType === "spider") {
      body.setSize(160, 200, true);
    } else {
      body.setSize(150, 240, true);
    }

    this.setDepth(4);
    this.play(`${enemyType}-walk`);
  }

  isDead() {
    return this.dead;
  }

  die() {
    if (this.dead) {
      return;
    }

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
    if (this.dead) {
      return;
    }

    const body =
      this.body as Phaser.Physics.Arcade.Body;

    const hitWall =
      (this.moveDir < 0 && body.blocked.left) ||
      (this.moveDir > 0 && body.blocked.right);

    const reachedPatrolLimit =
      (this.moveDir < 0 && this.x <= this.patrolLeft) ||
      (this.moveDir > 0 && this.x >= this.patrolRight);

    if (
      hitWall ||
      reachedPatrolLimit ||
      !this.hasGroundAhead(body)
    ) {
      this.moveDir *= -1;
    }

    this.setVelocityX(this.moveDir * Enemy.SPEED);
    this.setFlipX(this.moveDir < 0);
  }

  private hasGroundAhead(
    body: Phaser.Physics.Arcade.Body
  ): boolean {
    const grounded =
      body.blocked.down ||
      body.touching.down;

    if (!grounded) {
      return true;
    }

    const aheadX =
      body.center.x +
      this.moveDir *
        (body.halfWidth + 4);

    const belowFeetY =
      body.bottom + 4;

    const tile =
      this.groundLayer.getTileAtWorldXY(
        aheadX,
        belowFeetY,
        false
      );

    return Boolean(
      tile?.collides
    );
  }
}
