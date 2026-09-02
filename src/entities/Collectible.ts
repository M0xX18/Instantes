import Phaser from "phaser";
import { ASSETS } from "../config/assets";
import type { CollectibleType } from "../config/items";

const ITEM_TEXTURES: Record<
  CollectibleType,
  string
> = {
  broccoli: ASSETS.itemBrocoli,
  guava: ASSETS.itemJugoGuayaba,
  fries: ASSETS.itemPapitasFritas,
  lulo: ASSETS.itemJugoLulo,
  burger: ASSETS.itemHamburguesa,
};

export class Collectible extends Phaser.Physics.Arcade.Image {
  readonly itemType: CollectibleType;
  private collected = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    itemType: CollectibleType
  ) {
    super(
      scene,
      x,
      y,
      ITEM_TEXTURES[itemType]
    );

    this.itemType = itemType;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this
      .setDisplaySize(52, 52)
      .setOrigin(0.5, 1)
      .setDepth(4);

    const body =
      this.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(72, 72, true);

    scene.tweens.add({
      targets: this,
      y: y - 7,
      duration: 760,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }

  collect(): boolean {
    if (this.collected || !this.active) {
      return false;
    }

    this.collected = true;

    const body =
      this.body as Phaser.Physics.Arcade.Body;

    body.setEnable(false);
    this.scene.tweens.killTweensOf(this);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: this.scaleX * 1.6,
      scaleY: this.scaleY * 1.6,
      angle: 18,
      duration: 180,
      ease: "Back.In",
      onComplete: () => this.destroy(),
    });

    return true;
  }
}
