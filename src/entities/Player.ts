import Phaser from "phaser";
import { ASSETS } from "../config/assets";

export class Player extends Phaser.Physics.Arcade.Sprite {
  // ---------------------------------------------------------------------------
  // INPUT
  // ---------------------------------------------------------------------------

  private moveLeft = false;
  private moveRight = false;
  private jumpHeld = false;

  // ---------------------------------------------------------------------------
  // JUMP STATE
  // ---------------------------------------------------------------------------

  private lastGroundedAt = Number.NEGATIVE_INFINITY;
  private jumpQueuedAt = Number.NEGATIVE_INFINITY;
  private jumpCut = false;
  private wasGrounded = false;

  // ---------------------------------------------------------------------------
  // SPRITE / PHYSICS
  // ---------------------------------------------------------------------------

  // Tamaño aproximado de cada frame del spritesheet.
  // (no usado, pero documentado para referencia)

  // Hitbox física expresada en píxeles del sprite original.
  // Con scale 0.12 termina siendo aproximadamente 16x53 px en el juego.
  private static readonly BODY_WIDTH = 86;
  private static readonly BODY_HEIGHT = 190;

  // Separación horizontal.
  private static readonly BODY_OFFSET_X = 26;

  // El cuerpo queda apoyado aproximadamente en los pies.
  private static readonly BODY_OFFSET_Y = 258;

  // ---------------------------------------------------------------------------
  // MOVEMENT
  // ---------------------------------------------------------------------------

  private static readonly MAX_SPEED = 210;

  private static readonly GROUND_ACCEL = 0.22;
  private static readonly GROUND_DECEL = 0.30;

  private static readonly AIR_ACCEL = 0.11;
  private static readonly AIR_DECEL = 0.08;

  // ---------------------------------------------------------------------------
  // JUMP
  // ---------------------------------------------------------------------------

  private static readonly JUMP_SPEED = 500;
  private static readonly JUMP_CUT_FACTOR = 0.42;

  // Permite saltar unos ms después de abandonar una plataforma.
  private static readonly COYOTE_TIME = 110;

  // Permite pulsar salto ligeramente antes de tocar el suelo.
  private static readonly JUMP_BUFFER_TIME = 130;

  // ---------------------------------------------------------------------------
  // FALL
  // ---------------------------------------------------------------------------

  private static readonly MAX_FALL_SPEED = 850;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.personajeIdle);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;

    // -------------------------------------------------------------------------
    // SPRITE
    // -------------------------------------------------------------------------

    this.setOrigin(0.5, 0.5);
    this.setScale(0.12);
    this.setDepth(5);

    this.setCollideWorldBounds(false);
    this.setBounce(0);

    // Evitamos rotación física.
    body.setAllowRotation(false);

    // -------------------------------------------------------------------------
    // HITBOX
    // -------------------------------------------------------------------------

    /*
     * El sprite original mide:
     *
     *   139 x 448
     *
     * Con escala 0.28:
     *
     *   139 * 0.28 = 38.92 px
     *   448 * 0.28 = 125.44 px
     *
     * Por eso NO debemos utilizar:
     *
     *   setBodySize(25, 70)
     *
     * porque Phaser aplica la escala al body.
     *
     * Utilizamos aproximadamente:
     *
     *   86 x 190
     *
     * que termina siendo:
     *
     *   24 x 53 px
     *
     * en el mundo del juego.
     */

    body.setSize(
      Player.BODY_WIDTH,
      Player.BODY_HEIGHT,
      false
    );

    /*
     * Centrado horizontal:
     *
     * (139 - 86) / 2 = 26.5
     *
     * Usamos 26.
     *
     * Verticalmente:
     *
     * 448 - 190 = 258
     *
     * Así el cuerpo termina aproximadamente en los pies.
     */
    body.setOffset(
      Player.BODY_OFFSET_X,
      Player.BODY_OFFSET_Y
    );

    // No queremos que conserve aceleración o drag extraño.
    body.setDrag(0);

    // Velocidades máximas físicas.
    body.setMaxVelocity(
      Player.MAX_SPEED,
      Player.MAX_FALL_SPEED
    );

    // -------------------------------------------------------------------------
    // ANIMATIONS
    // -------------------------------------------------------------------------

    this.createAnimations(scene);
    this.play("idle");
  }

  // ---------------------------------------------------------------------------
  // INPUT
  // ---------------------------------------------------------------------------

  setMoveInput(
    left: boolean,
    right: boolean,
    jumpPressed: boolean
  ) {
    this.moveLeft = left;
    this.moveRight = right;

    // Guardamos cuándo fue pulsado el salto.
    // Esto permite utilizar Jump Buffer.
    if (jumpPressed) {
      this.jumpQueuedAt = this.scene.time.now;
    }
  }

  setJumpHeld(held: boolean) {
    this.jumpHeld = held;
  }

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    this.updateMovement();
    this.updateJump();
    this.updateAnimation();
  }

  // ---------------------------------------------------------------------------
  // MOVEMENT
  // ---------------------------------------------------------------------------

  private updateMovement() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const now = this.scene.time.now;

    const grounded =
      body.blocked.down ||
      body.touching.down;

    // Guardamos el último momento en el suelo.
    if (grounded) {
      this.lastGroundedAt = now;

      if (!this.wasGrounded) {
        this.onLanded();
      }
    }

    this.wasGrounded = grounded;

    // -------------------------------------------------------------------------
    // DIRECTION
    // -------------------------------------------------------------------------

    let direction = 0;

    if (this.moveLeft && !this.moveRight) {
      direction = -1;
    } else if (this.moveRight && !this.moveLeft) {
      direction = 1;
    }

    // -------------------------------------------------------------------------
    // TARGET VELOCITY
    // -------------------------------------------------------------------------

    const targetVelocity =
      direction * Player.MAX_SPEED;

    const moving = direction !== 0;

    // Más control en tierra.
    // Menos control en aire.
    const acceleration = grounded
      ? Player.GROUND_ACCEL
      : Player.AIR_ACCEL;

    const deceleration = grounded
      ? Player.GROUND_DECEL
      : Player.AIR_DECEL;

    const factor = moving
      ? acceleration
      : deceleration;

    // Suavizamos la velocidad para evitar cambios demasiado bruscos.
    const velocityX = Phaser.Math.Linear(
      body.velocity.x,
      targetVelocity,
      factor
    );

    this.setVelocityX(
      Math.abs(velocityX) < 0.5
        ? 0
        : velocityX
    );

    // -------------------------------------------------------------------------
    // FACING
    // -------------------------------------------------------------------------

    if (direction < 0) {
      this.setFlipX(true);
    } else if (direction > 0) {
      this.setFlipX(false);
    }
  }

  // ---------------------------------------------------------------------------
  // JUMP
  // ---------------------------------------------------------------------------

  private updateJump() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const now = this.scene.time.now;

    const grounded =
      body.blocked.down ||
      body.touching.down;

    // -------------------------------------------------------------------------
    // JUMP BUFFER
    // -------------------------------------------------------------------------

    const jumpBuffered =
      now - this.jumpQueuedAt <=
      Player.JUMP_BUFFER_TIME;

    // -------------------------------------------------------------------------
    // COYOTE TIME
    // -------------------------------------------------------------------------

    const coyoteAvailable =
      now - this.lastGroundedAt <=
      Player.COYOTE_TIME;

    // -------------------------------------------------------------------------
    // PERFORM JUMP
    // -------------------------------------------------------------------------

    if (
      jumpBuffered &&
      coyoteAvailable
    ) {
      this.performJump();
      return;
    }

    // -------------------------------------------------------------------------
    // VARIABLE JUMP HEIGHT
    // -------------------------------------------------------------------------

    /*
     * Si el jugador suelta el botón mientras está subiendo,
     * reducimos inmediatamente la velocidad vertical.
     *
     * Resultado:
     *
     * mantener salto = salto alto
     * soltar rápido  = salto corto
     */

    if (
      !this.jumpHeld &&
      !grounded &&
      !this.jumpCut &&
      body.velocity.y < 0
    ) {
      this.setVelocityY(
        body.velocity.y *
        Player.JUMP_CUT_FACTOR
      );

      this.jumpCut = true;
    }

    // -------------------------------------------------------------------------
    // LIMIT FALL SPEED
    // -------------------------------------------------------------------------

    if (
      body.velocity.y >
      Player.MAX_FALL_SPEED
    ) {
      this.setVelocityY(
        Player.MAX_FALL_SPEED
      );
    }
  }

  private performJump() {
    this.setVelocityY(
      -Player.JUMP_SPEED
    );

    // Consumimos el input.
    this.jumpQueuedAt =
      Number.NEGATIVE_INFINITY;

    // Desactivamos coyote time.
    this.lastGroundedAt =
      Number.NEGATIVE_INFINITY;

    this.jumpCut = false;
    this.wasGrounded = false;
  }

  // ---------------------------------------------------------------------------
  // LANDING
  // ---------------------------------------------------------------------------

  private onLanded() {
    this.jumpCut = false;

    // Aquí puedes agregar:
    // - sonido
    // - partículas
    // - squash/stretch
    // - pequeña vibración de cámara
  }

  // ---------------------------------------------------------------------------
  // ANIMATIONS
  // ---------------------------------------------------------------------------

  private updateAnimation() {
    const body = this.body as Phaser.Physics.Arcade.Body;

    const grounded =
      body.blocked.down ||
      body.touching.down;

    // En el aire.
    if (!grounded) {
      this.play("jump", true);
      return;
    }

    // Hay movimiento real.
    const moving =
      Math.abs(body.velocity.x) > 8;

    if (moving) {
      this.play("walk", true);
    } else {
      this.play("idle", true);
    }
  }

  // ---------------------------------------------------------------------------
  // CREATE ANIMATIONS
  // ---------------------------------------------------------------------------

  private createAnimations(scene: Phaser.Scene) {
    const anims = scene.anims;

    // -------------------------------------------------------------------------
    // IDLE
    // -------------------------------------------------------------------------

    if (!anims.exists("idle")) {
      anims.create({
        key: "idle",
        frames: anims.generateFrameNumbers(
          ASSETS.personajeIdle,
          {
            start: 0,
            end: 3,
          }
        ),
        frameRate: 4,
        repeat: -1,
      });
    }

    // -------------------------------------------------------------------------
    // WALK
    // -------------------------------------------------------------------------

    if (!anims.exists("walk")) {
      anims.create({
        key: "walk",
        frames: anims.generateFrameNumbers(
          ASSETS.personajeCaminar,
          {
            start: 0,
            end: 3,
          }
        ),
        frameRate: 9,
        repeat: -1,
      });
    }

    // -------------------------------------------------------------------------
    // JUMP
    // -------------------------------------------------------------------------

    if (!anims.exists("jump")) {
      anims.create({
        key: "jump",
        frames: anims.generateFrameNumbers(
          ASSETS.personajeSalto,
          {
            start: 0,
            end: 1,
          }
        ),
        frameRate: 6,
        repeat: -1,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // PUBLIC METHODS
  // ---------------------------------------------------------------------------

  getFacingDirection(): number {
    return this.flipX ? -1 : 1;
  }

  isGrounded(): boolean {
    const body =
      this.body as Phaser.Physics.Arcade.Body;

    return (
      body.blocked.down ||
      body.touching.down
    );
  }

  getSpeed(): number {
    const body =
      this.body as Phaser.Physics.Arcade.Body;

    return Math.abs(body.velocity.x);
  }
}