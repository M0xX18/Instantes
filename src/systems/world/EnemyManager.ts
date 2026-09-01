import Phaser from "phaser";
import { Enemy } from "../../entities/Enemy";
import { WORLD_1_ENEMIES } from "../../data/worldData";

export class EnemyManager {
  private scene: Phaser.Scene;
  private enemies = new Set<Enemy>();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  spawn(
    map: Phaser.Tilemaps.Tilemap,
    groundLayer: Phaser.Tilemaps.TilemapLayer
  ) {
    for (const {
      col,
      row,
      type,
      patrolRange,
    } of WORLD_1_ENEMIES) {
      const px =
        col * map.tileWidth +
        map.tileWidth / 2;

      const py = row * map.tileHeight;

      const enemy = new Enemy(
        this.scene,
        px,
        py,
        type,
        patrolRange
      );

      this.scene.physics.add.collider(
        enemy,
        groundLayer
      );

      this.enemies.add(enemy);
    }
  }

  update(
    player: any,
    projectiles: any[],
    onPlayerHit: () => void
  ) {
    for (const enemy of this.enemies) {
      if (enemy.isDead()) continue;

      this.scene.physics.overlap(
        player,
        enemy,
        onPlayerHit
      );

      for (const proj of projectiles) {
        this.scene.physics.overlap(
          proj,
          enemy,
          () => {
            proj.destroy();
            enemy.die();
          }
        );
      }

      enemy.update();
    }
  }

  getAll(): Enemy[] {
    return Array.from(this.enemies);
  }

  clear() {
    for (const enemy of this.enemies) {
      enemy.destroy();
    }
    this.enemies.clear();
  }
}
