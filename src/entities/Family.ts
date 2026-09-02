import Phaser from "phaser";
import { ASSETS } from "../config/assets";

export class Family extends Phaser.Physics.Arcade.Sprite {
  private static readonly ANDRES_SCALE = 0.16;
  private static readonly ARABELLA_SCALE = 0.38;
  private static readonly ARABELLA_OFFSET_X = 58;

  // El contenido visible de Arabella termina en y=249 dentro del frame 351px.
  // Este origen pone sus patas en el mismo suelo que Andrés.
  private static readonly ARABELLA_ORIGIN_Y =
    249 / 351;

  // El cuerpo cubre visualmente a Andrés y Arabella y termina en sus pies.
  // Phaser expresa estas medidas en píxeles del frame de Andrés antes de scale.
  private static readonly BODY_WIDTH = 748;
  private static readonly BODY_HEIGHT = 867;
  private static readonly BODY_OFFSET_X = 0;
  private static readonly BODY_OFFSET_Y = 60;

  private readonly arabella: Phaser.GameObjects.Sprite;
  private readonly glow: Phaser.GameObjects.Ellipse;
  private readonly goalLabel: Phaser.GameObjects.Text;
  private readonly sparkles: Phaser.GameObjects.Text[];

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

    this.createAnimations(scene);

    // x/y representan los pies de Andrés.
    this
      .setScale(Family.ANDRES_SCALE)
      .setOrigin(0.5, 1)
      .setDepth(5)
      .play("family-andres-celebrate");

    // Arabella tiene su propia animación, pero sigue el cuerpo físico de Family.
    this.arabella = scene.add
      .sprite(
        x + Family.ARABELLA_OFFSET_X,
        y,
        ASSETS.arabella
      )
      .setScale(Family.ARABELLA_SCALE)
      .setOrigin(
        0.5,
        Family.ARABELLA_ORIGIN_Y
      )
      .setDepth(5)
      .play("family-arabella-celebrate");

    this.glow = scene.add
      .ellipse(
        x + 30,
        y - 68,
        150,
        150,
        0xffd86b,
        0.1
      )
      .setDepth(3);

    scene.tweens.add({
      targets: this.glow,
      alpha: { from: 0.05, to: 0.18 },
      scale: { from: 0.92, to: 1.08 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    this.goalLabel = scene.add
      .text(
        x + 30,
        y - 154,
        "META",
        {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "10px",
          color: "#ffe6a3",
          stroke: "#4a2030",
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5)
      .setDepth(6);

    const sparkleOffsets = [
      [-28, -122],
      [87, -108],
      [-20, -48],
      [88, -43],
    ] as const;

    this.sparkles = sparkleOffsets.map(
      ([offsetX, offsetY], index) => {
        const sparkle = scene.add
          .text(
            x + offsetX,
            y + offsetY,
            "✦",
            {
              fontFamily: "monospace",
              fontSize: "15px",
              color:
                index % 2 === 0
                  ? "#fff2a6"
                  : "#a8f0ff",
            }
          )
          .setOrigin(0.5)
          .setDepth(6)
          .setData("offsetX", offsetX)
          .setData("offsetY", offsetY);

        scene.tweens.add({
          targets: sparkle,
          alpha: { from: 0.15, to: 1 },
          scale: { from: 0.65, to: 1.25 },
          angle: { from: -20, to: 20 },
          delay: index * 160,
          duration: 620,
          yoyo: true,
          repeat: -1,
          ease: "Sine.InOut",
        });

        return sparkle;
      }
    );

    const body =
      this.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(true);
    body.setImmovable(false);
    body.setCollideWorldBounds(true);
    body.setSize(
      Family.BODY_WIDTH,
      Family.BODY_HEIGHT,
      false
    );
    body.setOffset(
      Family.BODY_OFFSET_X,
      Family.BODY_OFFSET_Y
    );
  }

  preUpdate(
    time: number,
    delta: number
  ) {
    super.preUpdate(
      time,
      delta
    );

    this.arabella.setPosition(
      this.x + Family.ARABELLA_OFFSET_X,
      this.y
    );

    this.glow.setPosition(
      this.x + 30,
      this.y - 68
    );

    this.goalLabel.setPosition(
      this.x + 30,
      this.y - 154
    );

    for (const sparkle of this.sparkles) {
      sparkle.setPosition(
        this.x + sparkle.getData("offsetX"),
        this.y + sparkle.getData("offsetY")
      );
    }
  }

  destroy(
    fromScene?: boolean
  ) {
    this.arabella.destroy();
    this.glow.destroy();
    this.goalLabel.destroy();

    for (const sparkle of this.sparkles) {
      sparkle.destroy();
    }

    super.destroy(
      fromScene
    );
  }

  private createAnimations(
    scene: Phaser.Scene
  ) {
    if (!scene.anims.exists("family-andres-celebrate")) {
      scene.anims.create({
        key: "family-andres-celebrate",
        frames: scene.anims.generateFrameNumbers(
          ASSETS.andres,
          {
            frames: [
              0,
              1,
              2,
              1,
              3,
              2,
              1,
            ],
          }
        ),
        frameRate: 5,
        repeat: -1,
        repeatDelay: 320,
      });
    }

    if (!scene.anims.exists("family-arabella-celebrate")) {
      scene.anims.create({
        key: "family-arabella-celebrate",
        frames: scene.anims.generateFrameNumbers(
          ASSETS.arabella,
          {
            frames: [0, 1, 2, 3, 2, 1],
          }
        ),
        frameRate: 7,
        repeat: -1,
      });
    }
  }
}
