import Phaser from "phaser";
import { Projectile } from "../../entities/Projectile";
import { WORLD_CONFIG } from "../../config/world";

export class ProjectileManager {
  private scene: Phaser.Scene;
  private projectiles = new Set<Projectile>();
  private lastShotAt = Number.NEGATIVE_INFINITY;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  shoot(
    player: any,
    crouching: boolean,
    shootHeld: boolean
  ) {
    const shootPressed =
      shootHeld &&
      this.scene.time.now -
        this.lastShotAt >=
        WORLD_CONFIG.shotCooldown;

    if (!shootPressed) {
      return;
    }

    this.lastShotAt = this.scene.time.now;

    const direction =
      player.getFacingDirection();

    const px =
      player.x +
      direction *
        (player.displayWidth / 2 + 10);

    const py = crouching
      ? player.y + 20
      : player.y - 10;

    const projectile = new Projectile(
      this.scene,
      px,
      py,
      direction
    );

    this.projectiles.add(projectile);
  }

  update() {
    for (const projectile of this.projectiles) {
      projectile.update();

      if (projectile.active === false) {
        this.projectiles.delete(projectile);
      }
    }
  }

  getAll(): Projectile[] {
    return Array.from(this.projectiles);
  }

  clear() {
    for (const projectile of this.projectiles) {
      projectile.destroy();
    }
    this.projectiles.clear();
  }
}
