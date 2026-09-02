import Phaser from "phaser";
import { Collectible } from "../../entities/Collectible";
import type { ItemDefinition } from "../../data/levels/types";

export class ItemManager {
  private readonly group: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene) {
    this.group = scene.physics.add.group({
      allowGravity: false,
      immovable: true,
      runChildUpdate: false,
    });
  }

  spawn(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    definitions: readonly ItemDefinition[]
  ) {
    for (const item of definitions) {
      const collectible = new Collectible(
        scene,
        item.col * map.tileWidth +
          map.tileWidth / 2,
        item.row * map.tileHeight,
        item.type
      );

      this.group.add(collectible);
    }
  }

  getGroup(): Phaser.Physics.Arcade.Group {
    return this.group;
  }
}
