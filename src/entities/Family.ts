import Phaser from "phaser";
import { ASSETS } from "../config/assets";

export class Family extends Phaser.Physics.Arcade.Sprite {
  private static readonly SCALE = 0.28;
  private static readonly CHARACTER_WIDTH = 139;

  private readonly arabella: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number
  ) {
    super(
      scene,
      x,
      y,
      ASSETS.andres
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body =
      this.body as Phaser.Physics.Arcade.Body;

    // -------------------------------------------------------------------------
    // ANDRÉS
    // -------------------------------------------------------------------------

    this.setScale(
      Family.SCALE
    );

    // x/y representan los pies de Andrés.
    this.setOrigin(
      0.5,
      1
    );

    this.setDepth(5);

    // -------------------------------------------------------------------------
    // ARABELLA
    // -------------------------------------------------------------------------

    /*
     * Arabella es otro personaje visual que forma parte de la misma entidad.
     *
     * No necesita un segundo cuerpo físico:
     * la entidad Family completa se mueve mediante el cuerpo de Andrés.
     */

    this.arabella =
      scene.add.image(
        x +
          Family.CHARACTER_WIDTH *
            Family.SCALE,
        y,
        ASSETS.arabella
      );

    this.arabella
      .setScale(Family.SCALE)
      .setOrigin(0.5, 1)
      .setDepth(5);

    // -------------------------------------------------------------------------
    // PHYSICS
    // -------------------------------------------------------------------------

    /*
     * Family sí utiliza gravedad.
     *
     * Al igual que Papitas / enemigos / Player,
     * la entidad cae hasta tocar el suelo.
     */
    body.setAllowGravity(true);
    body.setImmovable(false);
    body.setCollideWorldBounds(true);

    /*
     * Hitbox de interacción.
     *
     * El cuerpo es más pequeño que los sprites para evitar
     * que el jugador tenga que tocar exactamente los bordes visuales.
     */
    body.setSize(
      220,
      170,
      false
    );

    /*
     * El frame original es aproximadamente 139x448.
     * Dejamos el cuerpo en la parte inferior del personaje.
     */
    body.setOffset(
      29,
      278
    );
  }

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  preUpdate(
    time: number,
    delta: number
  ) {
    super.preUpdate(
      time,
      delta
    );

    /*
     * Arabella sigue exactamente la posición de la entidad Family.
     */
    this.arabella.setPosition(
      this.x +
        Family.CHARACTER_WIDTH *
          Family.SCALE,
      this.y
    );
  }

  // ---------------------------------------------------------------------------
  // DESTROY
  // ---------------------------------------------------------------------------

  destroy(
    fromScene?: boolean
  ) {
    this.arabella.destroy();

    super.destroy(
      fromScene
    );
  }
}