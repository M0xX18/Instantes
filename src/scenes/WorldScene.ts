import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { Enemy } from "../entities/Enemy";
import { ASSETS } from "../config/assets";
import { GAME_WIDTH, WORLD_TIME_LIMIT } from "../config/game";
import { WORLD_CONFIG } from "../config/world";
import { WORLD_1_ENEMIES } from "../data/worldData";

export class WorldScene extends Phaser.Scene {
  private player!: Player;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private wasd!: Record<
    "W" | "A" | "S" | "D",
    Phaser.Input.Keyboard.Key
  >;

  private pauseKey!: Phaser.Input.Keyboard.Key;

  private shootKeys!: Phaser.Input.Keyboard.Key[];

  private paused = false;
  private lastShotAt = Number.NEGATIVE_INFINITY;

  private readonly projectiles = new Set<Projectile>();
  private readonly enemies = new Set<Enemy>();

  private worldKey = "mundo-1";

  // Timer
  private timerMs = 0;
  private timerDone = false;
  private timerText!: Phaser.GameObjects.Text;

  // Goal
  private goalZone!: Phaser.GameObjects.Zone;
  private portalGfx!: Phaser.GameObjects.Graphics;
  private portalLight!: Phaser.GameObjects.Graphics;
  private portalParticles: Phaser.GameObjects.Arc[] = [];
  private portalAngle = 0;

  constructor() {
    super("WorldScene");
  }

  // INIT

  init(data: { worldKey?: string }) {
    this.worldKey = data?.worldKey ?? "mundo-1";

    this.timerMs = WORLD_TIME_LIMIT * 1000;
    this.timerDone = false;
    this.paused = false;

    this.lastShotAt = Number.NEGATIVE_INFINITY;

    this.projectiles.clear();
    this.enemies.clear();
    this.portalParticles = [];
    this.portalAngle = 0;
  }

  // CREATE

  create() {
    this.paused = false;

    // MAP

    const map = this.make.tilemap({
      key: ASSETS.mapaMundo1,
    });

    const tiles = map.addTilesetImage(
      "tileset-plataformas",
      ASSETS.tileset
    );

    if (!tiles) {
      throw new Error("No se pudo cargar el tileset.");
    }

    const groundLayer = map.createLayer(
      "suelo",
      tiles,
      0,
      0
    );

    if (!groundLayer) {
      throw new Error(
        "No se encontró la capa 'suelo'."
      );
    }

    // Tiles 1-8 son sólidos.
    // Tile 0 representa vacío.
    groundLayer.setCollisionBetween(1, 8);

    // WORLD BOUNDS

    this.physics.world.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels
    );

    // BACKGROUND

    const bg = this.add
      .image(
        0,
        0,
        ASSETS.fondoEspacio
      )
      .setOrigin(0, 0);

    bg.setDisplaySize(
      map.widthInPixels,
      map.heightInPixels
    );

    bg.setDepth(-10);
    bg.setAlpha(0.45);
    bg.setScrollFactor(0.15);

    this.addStars(
      map.widthInPixels,
      map.heightInPixels
    );

    // -------------------------------------------------------------------------
    // PLAYER
    // -------------------------------------------------------------------------

    /*
     * El Player ya establece:
     *
     * scale  = 0.28
     * body   = 86 x 190
     * offset = 26 x 258
     *
     * No debemos volver a cambiar su escala desde esta escena.
     */

    const playerX = WORLD_CONFIG.playerSpawnX;

    // El jugador tiene aproximadamente 125 px visuales de altura.
    // Lo colocamos un poco por encima del piso inicial.
    const playerY =
      map.heightInPixels - WORLD_CONFIG.playerSpawnYOffset;

    this.player = new Player(
      this,
      playerX,
      playerY
    );

    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(
      this.player,
      groundLayer
    );

    // -------------------------------------------------------------------------
    // CAMERA
    // -------------------------------------------------------------------------

    this.cameras.main.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels
    );

    this.cameras.main.startFollow(
      this.player,
      true,
      0.12,
      0.12
    );

    this.cameras.main.fadeIn(
      500,
      2,
      1,
      10
    );

    // -------------------------------------------------------------------------
    // ENEMIES
    // -------------------------------------------------------------------------

    this.spawnEnemies(
      map,
      groundLayer
    );

    // -------------------------------------------------------------------------
    // GOAL PORTAL
    // -------------------------------------------------------------------------

    const goalX =
      WORLD_CONFIG.goalTileX *
        map.tileWidth +
      map.tileWidth;

    const goalY =
      map.heightInPixels - 230;

    this.createGoalPortal(
      goalX,
      goalY
    );

    this.goalZone = this.add.zone(
      goalX,
      goalY,
      56,
      96
    );

    this.physics.world.enable(
      this.goalZone,
      Phaser.Physics.Arcade.STATIC_BODY
    );

    // -------------------------------------------------------------------------
    // HUD
    // -------------------------------------------------------------------------

    this.createHUD();

    // -------------------------------------------------------------------------
    // INPUT
    // -------------------------------------------------------------------------

    const keyboard =
      this.input.keyboard;

    if (!keyboard) {
      throw new Error("Sin teclado.");
    }

    keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.SPACE,
      Phaser.Input.Keyboard.KeyCodes.W,
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.S,
      Phaser.Input.Keyboard.KeyCodes.D,
      Phaser.Input.Keyboard.KeyCodes.J,
      Phaser.Input.Keyboard.KeyCodes.X,
      Phaser.Input.Keyboard.KeyCodes.ESC,
    ]);

    this.cursors =
      keyboard.createCursorKeys();

    this.wasd = {
      W: keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.W
      ),
      A: keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.A
      ),
      S: keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.S
      ),
      D: keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.D
      ),
    };

    this.pauseKey =
      keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ESC
      );

    this.shootKeys = [
      keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.J
      ),
      keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.X
      ),
    ];

    // -------------------------------------------------------------------------
    // CONTROLS HINT
    // -------------------------------------------------------------------------

    this.add
      .text(
        16,
        16,
        "<< >> / AD mover   ^ / W saltar   v / S agachar   J / X disparar   ESC pausa",
        {
          fontFamily:
            '"Press Start 2P", monospace',
          fontSize: "8px",
          color: "#efe6d0",
        }
      )
      .setScrollFactor(0)
      .setDepth(20)
      .setAlpha(0.7);

    // -------------------------------------------------------------------------
    // EVENTS
    // -------------------------------------------------------------------------

    this.events.on(
      "resume-world",
      () => {
        this.paused = false;
      }
    );
  }

  // ---------------------------------------------------------------------------
  // ENEMIES
  // ---------------------------------------------------------------------------

  private spawnEnemies(
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

      // Parte superior del tile.
      const py =
        row * map.tileHeight;

      const enemy = new Enemy(
        this,
        px,
        py,
        type,
        patrolRange
      );

      this.physics.add.collider(
        enemy,
        groundLayer
      );

      this.enemies.add(enemy);
    }
  }

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  update(
    _time: number,
    delta: number
  ) {
    if (
      this.paused ||
      this.timerDone
    ) {
      return;
    }

    // -------------------------------------------------------------------------
    // PAUSE
    // -------------------------------------------------------------------------

    if (
      Phaser.Input.Keyboard.JustDown(
        this.pauseKey
      )
    ) {
      this.openPause();
      return;
    }

    // -------------------------------------------------------------------------
    // TIMER
    // -------------------------------------------------------------------------

    this.timerMs -= delta;

    if (this.timerMs <= 0) {
      this.timerMs = 0;

      this.triggerGameOver(
        "tiempo"
      );

      return;
    }

    this.updateTimerHUD();

    // -------------------------------------------------------------------------
    // GOAL
    // -------------------------------------------------------------------------

    this.physics.overlap(
      this.player,
      this.goalZone,
      () => this.triggerWin()
    );

    // -------------------------------------------------------------------------
    // ENEMIES
    // -------------------------------------------------------------------------

    for (const enemy of this.enemies) {
      if (enemy.isDead()) {
        continue;
      }

      // Player toca enemigo.
      this.physics.overlap(
        this.player,
        enemy,
        () =>
          this.triggerGameOver(
            "enemigo"
          )
      );

      // Projectiles golpean enemigo.
      for (const projectile of this.projectiles) {
        this.physics.overlap(
          projectile,
          enemy,
          () => {
            projectile.destroy();
            enemy.die();
          }
        );
      }

      enemy.update();
    }

    // -------------------------------------------------------------------------
    // PLAYER INPUT
    // -------------------------------------------------------------------------

    const left =
      this.cursors.left.isDown ||
      this.wasd.A.isDown;

    const right =
      this.cursors.right.isDown ||
      this.wasd.D.isDown;

    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(
        this.cursors.up
      ) ||
      Phaser.Input.Keyboard.JustDown(
        this.wasd.W
      );

    const jumpHeld =
      this.cursors.up.isDown ||
      this.wasd.W.isDown;

    this.player.setMoveInput(
      left,
      right,
      jumpPressed
    );

    this.player.setJumpHeld(
      jumpHeld
    );

    // -------------------------------------------------------------------------
    // STANCE
    // -------------------------------------------------------------------------

    /*
     * IMPORTANTE:
     *
     * No cambiamos la escala del Player aquí.
     *
     * Antes tenías:
     *
     *     setScale(0.12, ...)
     *
     * Eso hacía que el Player cambiara de tamaño cada frame.
     *
     * Ahora mantenemos 0.28 constantemente.
     *
     * La tecla S se sigue utilizando para:
     * - estado de agachado
     * - posición del disparo
     *
     * La implementación visual/física del crouch puede añadirse
     * posteriormente dentro de Player.
     */
    const crouching =
      this.isCrouching();

    // Evita que TypeScript considere que el estado no se usa.
    if (crouching) {
      // Reservado para animación/estado de crouch.
    }

    // -------------------------------------------------------------------------
    // SHOOTING
    // -------------------------------------------------------------------------

    this.tryShoot();

    // -------------------------------------------------------------------------
    // PROJECTILES
    // -------------------------------------------------------------------------

    for (const projectile of this.projectiles) {
      projectile.update();
    }

    // -------------------------------------------------------------------------
    // PORTAL
    // -------------------------------------------------------------------------

    this.animatePortal();
  }

  // ---------------------------------------------------------------------------
  // CROUCH
  // ---------------------------------------------------------------------------

  private isCrouching(): boolean {
    return (
      this.cursors.down.isDown ||
      this.wasd.S.isDown
    );
  }

  // ---------------------------------------------------------------------------
  // PORTAL
  // ---------------------------------------------------------------------------

  private createGoalPortal(
    x: number,
    y: number
  ) {
    // -------------------------------------------------------------------------
    // LIGHT
    // -------------------------------------------------------------------------

    this.portalLight =
      this.add.graphics();

    this.portalLight
      .fillStyle(
        0xa8f0ff,
        0.07
      )
      .fillRect(
        -20,
        -280,
        40,
        320
      );

    this.portalLight.setPosition(
      x,
      y
    );

    this.portalLight.setDepth(3);

    // -------------------------------------------------------------------------
    // PORTAL
    // -------------------------------------------------------------------------

    this.portalGfx =
      this.add.graphics();

    this.portalGfx.setPosition(
      x,
      y - 24
    );

    this.portalGfx.setDepth(4);

    this.drawPortalCircle(1);

    // -------------------------------------------------------------------------
    // LABEL
    // -------------------------------------------------------------------------

    this.add
      .text(
        x,
        y - 80,
        "META",
        {
          fontFamily:
            '"Press Start 2P", monospace',
          fontSize: "10px",
          color: "#a8f0ff",
          stroke: "#003355",
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5)
      .setDepth(5);

    // -------------------------------------------------------------------------
    // PARTICLES
    // -------------------------------------------------------------------------

    this.portalParticles = [];

    for (let i = 0; i < 8; i++) {
      const dot = this.add.circle(
        x,
        y - 24,
        3,
        0xa8f0ff,
        0.85
      );

      dot.setDepth(5);

      this.portalParticles.push(
        dot
      );
    }

    // -------------------------------------------------------------------------
    // LIGHT ANIMATION
    // -------------------------------------------------------------------------

    this.tweens.add({
      targets:
        this.portalLight,
      alpha: {
        from: 0.07,
        to: 0.18,
      },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }

  private drawPortalCircle(
    scale: number
  ) {
    this.portalGfx.clear();

    const r = 28 * scale;

    this.portalGfx.fillStyle(
      0x56d4ff,
      0.12
    );

    this.portalGfx.fillCircle(
      0,
      0,
      r + 8
    );

    this.portalGfx.lineStyle(
      2.5,
      0xa8f0ff,
      0.9
    );

    this.portalGfx.strokeCircle(
      0,
      0,
      r
    );

    this.portalGfx.fillStyle(
      0x003399,
      0.55
    );

    this.portalGfx.fillCircle(
      0,
      0,
      r - 3
    );

    this.portalGfx.fillStyle(
      0xffffff,
      0.85
    );

    this.portalGfx.fillCircle(
      0,
      0,
      4
    );
  }

  private animatePortal() {
    this.portalAngle += 0.04;

    const scale =
      1 +
      0.06 *
        Math.sin(
          this.portalAngle * 1.5
        );

    this.drawPortalCircle(
      scale
    );

    const orbitR = 38;

    for (
      let i = 0;
      i <
      this.portalParticles.length;
      i++
    ) {
      const angle =
        this.portalAngle +
        (i /
          this.portalParticles.length) *
          Math.PI *
          2;

      const dot =
        this.portalParticles[i];

      dot.setPosition(
        this.portalGfx.x +
          Math.cos(angle) *
            orbitR,
        this.portalGfx.y +
          Math.sin(angle) *
            orbitR
      );

      dot.setAlpha(
        0.4 +
          0.5 *
            ((Math.sin(
              angle * 2
            ) +
              1) /
              2)
      );
    }
  }

  // ---------------------------------------------------------------------------
  // HUD
  // ---------------------------------------------------------------------------

  private createHUD() {
    const pad = 12;
    const boxW = 110;
    const boxH = 34;

    const bx =
      GAME_WIDTH -
      boxW -
      pad;

    const by = pad;

    // -------------------------------------------------------------------------
    // TIMER BACKGROUND
    // -------------------------------------------------------------------------

    const hudBg =
      this.add.graphics();

    hudBg.fillStyle(
      0x000000,
      0.55
    );

    hudBg.fillRoundedRect(
      bx,
      by,
      boxW,
      boxH,
      8
    );

    hudBg
      .setScrollFactor(0)
      .setDepth(19);

    // -------------------------------------------------------------------------
    // TIMER TEXT
    // -------------------------------------------------------------------------

    this.timerText = this.add
      .text(
        GAME_WIDTH -
          pad -
          boxW / 2,
        by +
          boxH / 2,
        this.formatTime(
          this.timerMs
        ),
        {
          fontFamily:
            '"Press Start 2P", monospace',
          fontSize: "16px",
          color: "#a8f0ff",
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(20);
  }

  private updateTimerHUD() {
    this.timerText.setText(
      this.formatTime(
        this.timerMs
      )
    );

    if (this.timerMs < 20_000) {
      const flash =
        Math.floor(
          this.timerMs / 350
        ) %
          2 ===
        0;

      this.timerText.setColor(
        flash
          ? "#ff4444"
          : "#ff9999"
      );
    } else if (
      this.timerMs < 40_000
    ) {
      this.timerText.setColor(
        "#ffcc44"
      );
    } else {
      this.timerText.setColor(
        "#a8f0ff"
      );
    }
  }

  private formatTime(
    ms: number
  ): string {
    const total =
      Math.ceil(ms / 1000);

    const minutes =
      Math.floor(total / 60);

    const seconds =
      total % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  // ---------------------------------------------------------------------------
  // SHOOTING
  // ---------------------------------------------------------------------------

  private tryShoot() {
    // Solo disparamos mientras J/X esté presionado.
    const shootPressed =
      this.shootKeys.some(
        (key) => key.isDown
      );

    // Cooldown.
    if (
      !shootPressed ||
      this.time.now -
        this.lastShotAt <
        WORLD_CONFIG.shotCooldown
    ) {
      return;
    }

    this.lastShotAt =
      this.time.now;

    // Dirección actual del personaje.
    const direction =
      this.player.getFacingDirection();

    const crouching =
      this.isCrouching();

    // -------------------------------------------------------------------------
    // PROJECTILE POSITION
    // -------------------------------------------------------------------------

    /*
     * El sprite visual mide aproximadamente:
     *
     * 139 x 448
     *       x 0.28
     *
     * ≈ 39 x 125 px
     *
     * Por eso 19 px es aproximadamente la mitad
     * del ancho visual del personaje.
     */

    const projectileX =
      this.player.x +
      direction * 19;

    const projectileY =
      this.player.y -
      (crouching ? 4 : 12);

    const projectile =
      new Projectile(
        this,
        projectileX,
        projectileY,
        direction
      );

    projectile.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.projectiles.delete(
          projectile
        );
      }
    );

    this.projectiles.add(
      projectile
    );
  }

  // ---------------------------------------------------------------------------
  // STARS
  // ---------------------------------------------------------------------------

  private addStars(
    width: number,
    height: number
  ) {
    const random =
      new Phaser.Math.RandomDataGenerator([
        "instantes-level-1",
      ]);

    for (let i = 0; i < 90; i++) {
      const star = this.add.circle(
        random.between(
          0,
          width
        ),
        random.between(
          40,
          height - 120
        ),
        random.realInRange(
          0.6,
          1.7
        ),
        0xe8e7ff,
        random.realInRange(
          0.15,
          0.55
        )
      );

      star
        .setDepth(-5)
        .setScrollFactor(0.32);
    }
  }

  // ---------------------------------------------------------------------------
  // GAME OVER / WIN
  // ---------------------------------------------------------------------------

  private triggerWin() {
    if (this.timerDone) {
      return;
    }

    this.timerDone = true;

    this.cameras.main.fadeOut(
      500,
      2,
      1,
      10
    );

    this.cameras.main.once(
      "camerafadeoutcomplete",
      () => {
        this.scene.start(
          "WinScene",
          {
            worldKey:
              this.worldKey,
            timeMs:
              WORLD_TIME_LIMIT *
                1000 -
              this.timerMs,
          }
        );
      }
    );
  }

  private triggerGameOver(
    reason:
      | "tiempo"
      | "enemigo" = "tiempo"
  ) {
    if (this.timerDone) {
      return;
    }

    this.timerDone = true;

    this.cameras.main.fadeOut(
      500,
      30,
      0,
      0
    );

    this.cameras.main.once(
      "camerafadeoutcomplete",
      () => {
        this.scene.start(
          "GameOverScene",
          {
            worldKey:
              this.worldKey,
            reason,
          }
        );
      }
    );
  }

  // ---------------------------------------------------------------------------
  // PAUSE
  // ---------------------------------------------------------------------------

  private openPause() {
    this.paused = true;

    this.scene.pause();

    this.scene.launch(
      "PauseScene"
    );
  }
}