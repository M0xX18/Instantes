import Phaser from "phaser";

import { ASSETS } from "../config/assets";
import type { EnemyType } from "../data/levels/types";

const ENEMY_TEXTURES: Record<EnemyType, string> = {
  spider: ASSETS.enemySpider,
  avocado: ASSETS.enemyAvocado,
  "river-worm": ASSETS.enemyRiverWorm,
};

const ENEMY_SPEEDS: Record<EnemyType, number> = {
  spider: 76,
  avocado: 64,
  "river-worm": 42,
};

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private moveDir = 1;
  private readonly patrolLeft: number;
  private readonly patrolRight: number;
  private readonly groundLayer: Phaser.Tilemaps.TilemapLayer;
  private readonly enemyType: EnemyType;
  private readonly behaviorOffset: number;
  private nextSpiderJumpAt: number;
  private speechBubble?: Phaser.GameObjects.Container;
  private dead = false;

  private static readonly MAX_SPEED = 125;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    enemyType: EnemyType,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
    patrolRange = 80,
    speech?: string
  ) {
    super(scene, x, y, ENEMY_TEXTURES[enemyType]);

    this.enemyType = enemyType;
    this.patrolLeft = x - patrolRange;
    this.patrolRight = x + patrolRange;
    this.groundLayer = groundLayer;
    this.behaviorOffset = Math.round(x * 7 + y * 3);
    this.nextSpiderJumpAt =
      scene.time.now + 900 + (this.behaviorOffset % 700);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(true);
    body.setAllowRotation(false);
    body.setCollideWorldBounds(true);
    body.setBounce(0);
    body.setMaxVelocity(Enemy.MAX_SPEED, 700);

    if (enemyType === "river-worm") {
      // La imagen se usa intacta. Screen hace que el fondo negro no oculte
      // el escenario al componerla durante el renderizado.
      this
        .setDisplaySize(136, 91)
        .setBlendMode(Phaser.BlendModes.SCREEN);
      body.setSize(1180, 680, true);
    } else {
      this.setScale(0.23);

      if (enemyType === "spider") {
        body.setSize(160, 200, true);
      } else {
        body.setSize(150, 240, true);
      }
    }

    this.setDepth(4);

    if (enemyType !== "river-worm") {
      this.play(`${enemyType}-walk`);
    }

    if (speech) {
      this.speechBubble = this.createSpeechBubble(speech);
      this.updateSpeechBubblePosition();
    }
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

    const body = this.body as Phaser.Physics.Arcade.Body;
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

    this.updateTypeBehavior(body);
    this.setVelocityX(this.moveDir * this.getCurrentSpeed());
    this.setFlipX(this.moveDir < 0);
    this.updateSpeechBubblePosition();
  }

  destroy(fromScene?: boolean) {
    this.speechBubble?.destroy(true);
    this.speechBubble = undefined;
    super.destroy(fromScene);
  }

  private createSpeechBubble(
    speech: string
  ): Phaser.GameObjects.Container {
    const bubble = this.scene.add.graphics();
    bubble.fillStyle(0xfffbec, 0.96);
    bubble.fillEllipse(0, 0, 220, 100);
    bubble.fillTriangle(-20, 40, -2, 40, -12, 58);
    bubble.lineStyle(4, 0x17131d, 1);
    bubble.strokeEllipse(0, 0, 220, 100);
    bubble.lineBetween(-20, 40, -12, 58);
    bubble.lineBetween(-12, 58, -2, 40);

    const text = this.scene.add
      .text(0, -1, speech, {
        fontFamily: 'Arial, "Trebuchet MS", sans-serif',
        fontSize: "18px",
        fontStyle: "bold",
        color: "#17131d",
        align: "center",
        lineSpacing: 2,
        resolution: 2,
        wordWrap: {
          width: 174,
          useAdvancedWrap: true,
        },
      })
      .setOrigin(0.5);

    return this.scene.add
      .container(0, 0, [bubble, text])
      .setDepth(7);
  }

  private updateSpeechBubblePosition() {
    if (!this.speechBubble) {
      return;
    }

    this.speechBubble.setPosition(
      this.x,
      this.y - this.displayHeight / 2 - 72
    );
  }

  private updateTypeBehavior(body: Phaser.Physics.Arcade.Body) {
    const now = this.scene.time.now;
    const grounded = body.blocked.down || body.touching.down;

    // La araña salta periódicamente además de patrullar.
    if (
      this.enemyType === "spider" &&
      grounded &&
      now >= this.nextSpiderJumpAt
    ) {
      this.setVelocityY(-285);
      this.nextSpiderJumpAt =
        now + 1350 + (this.behaviorOffset % 650);
    }

    // El gusano ondula mientras avanza por el suelo.
    if (this.enemyType === "river-worm") {
      this.setAngle(
        Math.sin((now + this.behaviorOffset) / 115) * 2.5
      );
    }
  }

  private getCurrentSpeed(): number {
    if (this.enemyType !== "river-worm") {
      return ENEMY_SPEEDS[this.enemyType];
    }

    // Alterna una caminata lenta con una embestida breve.
    const chargePhase =
      (this.scene.time.now + this.behaviorOffset) % 2600;

    return chargePhase < 620
      ? 118
      : ENEMY_SPEEDS["river-worm"];
  }

  private hasGroundAhead(
    body: Phaser.Physics.Arcade.Body
  ): boolean {
    const grounded = body.blocked.down || body.touching.down;

    if (!grounded) {
      return true;
    }

    const aheadX =
      body.center.x +
      this.moveDir * (body.halfWidth + 4);
    const belowFeetY = body.bottom + 4;
    const tile = this.groundLayer.getTileAtWorldXY(
      aheadX,
      belowFeetY,
      false
    );

    return Boolean(tile?.collides);
  }
}
