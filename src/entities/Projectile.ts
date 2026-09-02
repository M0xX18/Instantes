import Phaser from "phaser";
import { ASSETS } from "../config/assets";

export type ProjectileKind =
  | "default"
  | "potato"
  | "lulo"
  | "burger";

type ProjectileConfig = {
  texture: string;
  size: number;
  speed: number;
  spin: number;
};

const PROJECTILE_CONFIG: Record<
  ProjectileKind,
  ProjectileConfig
> = {
  default: {
    texture: ASSETS.proyectil,
    size: 12,
    speed: 560,
    spin: 0,
  },
  potato: {
    texture: ASSETS.proyectilPapa,
    size: 23,
    speed: 590,
    spin: 320,
  },
  lulo: {
    texture: ASSETS.proyectilLulo,
    size: 14,
    speed: 620,
    spin: 0,
  },
  burger: {
    texture: ASSETS.itemHamburguesa,
    size: 28,
    speed: 500,
    spin: 220,
  },
};

export class Projectile extends Phaser.Physics.Arcade.Image {
  private readonly config: ProjectileConfig;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: number,
    kind: ProjectileKind
  ) {
    const config = PROJECTILE_CONFIG[kind];

    super(
      scene,
      x,
      y,
      config.texture
    );

    this.config = config;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this
      .setDepth(6)
      .setDisplaySize(
        config.size,
        config.size
      )
      .setRotation(
        direction < 0 ? Math.PI : 0
      )
      .setCollideWorldBounds(false);

    const body =
      this.body as Phaser.Physics.Arcade.Body;

    const frameSize = Math.min(
      this.frame.width,
      this.frame.height
    );

    body.setAllowGravity(false);
    body.setAllowRotation(true);
    body.setCircle(
      frameSize * 0.36,
      this.frame.width * 0.14,
      this.frame.height * 0.14
    );
    body.setMaxVelocity(
      config.speed,
      120
    );
  }

  launch(
    direction: number,
    velocityY = 0
  ) {
    this.setVelocity(
      direction * this.config.speed,
      velocityY
    );

    this.setAngularVelocity(
      direction * this.config.spin
    );
  }

  update() {
    const bounds =
      this.scene.physics.world.bounds;

    if (
      this.x < -48 ||
      this.x > bounds.width + 48 ||
      this.y < -48 ||
      this.y > bounds.height + 48
    ) {
      this.destroy();
    }
  }
}
