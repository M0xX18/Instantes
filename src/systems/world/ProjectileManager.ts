import Phaser from "phaser";

import { Player } from "../../entities/Player";
import { Projectile } from "../../entities/Projectile";

import { WORLD_CONFIG } from "../../config/world";

export class ProjectileManager {
  private readonly scene: Phaser.Scene;

  private readonly projectiles =
    new Set<Projectile>();

  private lastShotAt =
    Number.NEGATIVE_INFINITY;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  shoot(
    player: Player,
    crouching: boolean,
    shootHeld: boolean
  ) {
    if (!shootHeld) {
      return;
    }

    const now =
      this.scene.time.now;

    if (
      now - this.lastShotAt <
      WORLD_CONFIG.shotCooldown
    ) {
      return;
    }

    this.lastShotAt = now;

    const direction =
      player.getFacingDirection();

    const projectileX =
      player.x +
      direction *
        (player.displayWidth / 2 + 10);

    const projectileY =
      crouching
        ? player.y + 20
        : player.y - 10;

    const projectile =
      new Projectile(
        this.scene,
        projectileX,
        projectileY,
        direction
      );

    projectile.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.projectiles.delete(
          projectile
        );
      }
    );

    this.projectiles.add(
      projectile
    );
  }

  update() {
    for (const projectile of this.projectiles) {
      if (!projectile.active) {
        this.projectiles.delete(
          projectile
        );

        continue;
      }

      projectile.update();

      if (!projectile.active) {
        this.projectiles.delete(
          projectile
        );
      }
    }
  }

  getAll(): Projectile[] {
    return Array.from(
      this.projectiles
    );
  }

  clear() {
    for (const projectile of this.projectiles) {
      projectile.destroy();
    }

    this.projectiles.clear();

    this.lastShotAt =
      Number.NEGATIVE_INFINITY;
  }
}