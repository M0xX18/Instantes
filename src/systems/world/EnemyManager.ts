import Phaser from "phaser";
import { Enemy } from "../../entities/Enemy";
import type { EnemyDefinition } from "../../data/levels/types";

export class EnemyManager {
  private readonly scene: Phaser.Scene;
  private readonly enemies = new Set<Enemy>();
  private readonly group: Phaser.Physics.Arcade.Group;
  private groundCollider?: Phaser.Physics.Arcade.Collider;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.group = scene.physics.add.group({
      runChildUpdate: false,
    });
  }

   /* Crea todos los enemigos definidos para el mundo.*/
  spawn(
    map: Phaser.Tilemaps.Tilemap,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
    definitions: readonly EnemyDefinition[]
  ) {
    // Evita duplicar enemigos si spawn() se llama nuevamente.
    this.clear();

    for (const {
      col,
      row,
      type,
      patrolRange,
      speech,
    } of definitions) {
      const x =
        col * map.tileWidth +
        map.tileWidth / 2;

      // Aparece un tile por encima y aterriza sobre la plataforma durante
      // el fundido de entrada, sin comenzar incrustado en su colisión.
      const y =
        row * map.tileHeight -
        map.tileHeight;

      const enemy = new Enemy(
        this.scene,
        x,
        y,
        type,
        groundLayer,
        patrolRange,
        speech
      );

      this.enemies.add(enemy);
      this.group.add(enemy);

      enemy.once(
        Phaser.GameObjects.Events.DESTROY,
        () => {
          this.enemies.delete(enemy);

          if (this.scene.sys.isActive()) {
            this.group.remove(enemy);
          }
        }
      );
    }

    // Un solo collider gestiona todos los enemigos contra el escenario.
    this.groundCollider =
      this.scene.physics.add.collider(
        this.group,
        groundLayer
      );
  }

  update() {
    for (const enemy of this.enemies) {
      if (!enemy.active || enemy.isDead()) {
        continue;
      }

      enemy.update();
    }

    this.removeInactive();
  }

  getGroup(): Phaser.Physics.Arcade.Group {
    return this.group;
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
    this.groundCollider?.destroy();
    this.groundCollider = undefined;

    for (const enemy of Array.from(this.enemies)) {
      if (enemy.active) {
        enemy.destroy();
      }
    }

    this.enemies.clear();

    if (this.scene.sys.isActive()) {
      this.group.clear(false, false);
    }
  }
}
