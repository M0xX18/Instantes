import Phaser from "phaser";
import type { PowerMode } from "../../config/items";
import { WORLD_CONFIG } from "../../config/world";
import { Player } from "../../entities/Player";
import {
  Projectile,
  type ProjectileKind,
} from "../../entities/Projectile";

type ShotPattern = {
  cooldown: number;
  projectile: ProjectileKind;
  yOffsets: number[];
  yVelocities: number[];
};

const SHOT_PATTERNS: Record<
  PowerMode,
  ShotPattern
> = {
  default: {
    cooldown: WORLD_CONFIG.shotCooldown,
    projectile: "default",
    yOffsets: [0],
    yVelocities: [0],
  },
  fries: {
    cooldown: WORLD_CONFIG.shotCooldown,
    projectile: "potato",
    yOffsets: [0],
    yVelocities: [0],
  },
  lulo: {
    cooldown: 260,
    projectile: "lulo",
    yOffsets: [0],
    yVelocities: [0],
  },
  burger: {
    cooldown: 1200,
    projectile: "burger",
    yOffsets: [-18, 0, 18],
    yVelocities: [-85, 0, 85],
  },
};

export class ProjectileManager {
  private readonly scene: Phaser.Scene;
  private readonly projectiles =
    new Set<Projectile>();
  private readonly group: Phaser.Physics.Arcade.Group;

  private powerMode: PowerMode = "default";
  private cooldownMultiplier = 1;
  private lastShotAt = Number.NEGATIVE_INFINITY;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.group = scene.physics.add.group({
      allowGravity: false,
      runChildUpdate: false,
    });
  }

  shoot(
    player: Player,
    crouching: boolean,
    shootHeld: boolean
  ) {
    if (!shootHeld) {
      return;
    }

    const now = this.scene.time.now;
    const pattern =
      SHOT_PATTERNS[this.powerMode];

    const cooldown =
      pattern.cooldown *
      this.cooldownMultiplier;

    if (now - this.lastShotAt < cooldown) {
      return;
    }

    this.lastShotAt = now;

    const direction =
      player.getFacingDirection();

    const projectileX =
      player.x +
      direction *
        (player.displayWidth / 2 + 12);

    const projectileY = crouching
      ? player.y + 20
      : player.y - 10;

    for (
      let index = 0;
      index < pattern.yOffsets.length;
      index += 1
    ) {
      this.createProjectile(
        projectileX,
        projectileY +
          pattern.yOffsets[index],
        direction,
        pattern.projectile,
        pattern.yVelocities[index]
      );
    }
  }

  update() {
    for (const projectile of this.projectiles) {
      if (!projectile.active) {
        this.projectiles.delete(projectile);
        continue;
      }

      projectile.update();

      if (!projectile.active) {
        this.projectiles.delete(projectile);
      }
    }
  }

  setPowerMode(powerMode: PowerMode) {
    this.powerMode = powerMode;
    this.lastShotAt =
      Number.NEGATIVE_INFINITY;
  }

  setCooldownMultiplier(multiplier: number) {
    this.cooldownMultiplier =
      Phaser.Math.Clamp(
        multiplier,
        1,
        3
      );
  }

  getGroup(): Phaser.Physics.Arcade.Group {
    return this.group;
  }

  private createProjectile(
    x: number,
    y: number,
    direction: number,
    kind: ProjectileKind,
    velocityY: number
  ) {
    const projectile = new Projectile(
      this.scene,
      x,
      y,
      direction,
      kind
    );

    this.group.add(projectile);

    // PhysicsGroup restablece velocidad al añadir; lanzamos después.
    projectile.launch(
      direction,
      velocityY
    );

    projectile.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.projectiles.delete(projectile);

        if (this.scene.sys.isActive()) {
          this.group.remove(projectile);
        }
      }
    );

    this.projectiles.add(projectile);
  }
}
