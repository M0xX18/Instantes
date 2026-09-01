import Phaser from "phaser";
import { Enemy } from "../../entities/Enemy";
import { Player } from "../../entities/Player";
import { Projectile } from "../../entities/Projectile";
import { WORLD_1_ENEMIES } from "../../data/worldData";

export class EnemyManager {
  private readonly scene: Phaser.Scene;
  private readonly enemies = new Set<Enemy>();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

   /* Crea todos los enemigos definidos para el mundo.*/
  spawn(
    map: Phaser.Tilemaps.Tilemap,
    groundLayer: Phaser.Tilemaps.TilemapLayer
  ) {
    // Evita duplicar enemigos si spawn() se llama nuevamente.
    this.clear();

    for (const {
      col,
      row,
      type,
      patrolRange,
    } of WORLD_1_ENEMIES) {
      const x =
        col * map.tileWidth +
        map.tileWidth / 2;

      // El enemigo aparece en la parte superior del tile.
      const y =
        row * map.tileHeight;

      const enemy = new Enemy(
        this.scene,
        x,
        y,
        type,
        patrolRange
      );

      // Colisión enemigo ↔ suelo.
      this.scene.physics.add.collider(
        enemy,
        groundLayer
      );

      this.enemies.add(enemy);
    }
  }

  /**
   * Actualiza enemigos y gestiona:
   * - Player ↔ Enemy
   * - Projectile ↔ Enemy
   */
  update(
    player: Player,
    projectiles: readonly Projectile[],
    onPlayerHit: () => void
  ) {
    for (const enemy of this.enemies) {
      // Si ya murió o fue destruido, no procesamos nada.
      if (!enemy.active || enemy.isDead()) {
        continue;
      }

      // Player toca enemigo.
      this.scene.physics.overlap(
        player,
        enemy,
        onPlayerHit
      );

      // Proyectiles golpean enemigo.
      for (const projectile of projectiles) {
        if (!projectile.active) {
          continue;
        }

        this.scene.physics.overlap(
          projectile,
          enemy,
          () => {
            // Evita ejecutar dos veces el impacto.
            if (
              !projectile.active ||
              !enemy.active ||
              enemy.isDead()
            ) {
              return;
            }

            projectile.destroy();
            enemy.die();
          }
        );
      }

      // Actualizamos IA / movimiento del enemigo.
      enemy.update();
    }

    // Limpiamos referencias a enemigos destruidos.
    this.removeInactive();
  }

  /**
   * Devuelve una copia del listado de enemigos.
   */
  getAll(): Enemy[] {
    return Array.from(this.enemies);
  }

  /**
   * Elimina del Set los enemigos que ya no están activos.
   */
  private removeInactive() {
    for (const enemy of this.enemies) {
      if (!enemy.active) {
        this.enemies.delete(enemy);
      }
    }
  }

  /**
   * Destruye todos los enemigos.
   */
  clear() {
    for (const enemy of this.enemies) {
      if (enemy.active) {
        enemy.destroy();
      }
    }

    this.enemies.clear();
  }
}