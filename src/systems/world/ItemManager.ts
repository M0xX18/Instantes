import Phaser from "phaser";
import { Collectible } from "../../entities/Collectible";
import { WORLD_1_ITEMS } from "../../data/worldData";

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
    map: Phaser.Tilemaps.Tilemap
  ) {
    for (const item of WORLD_1_ITEMS) {
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
