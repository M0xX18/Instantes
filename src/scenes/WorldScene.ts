import Phaser from "phaser";

import { Player } from "../entities/Player";
import { Family } from "../entities/Family";

import { ASSETS } from "../config/assets";
import { WORLD_TIME_LIMIT } from "../config/game";
import { WORLD_CONFIG } from "../config/world";

import { InputManager } from "../systems/input/InputManager";
import { WorldHUD } from "../systems/ui/WorldHUD";
import { EnemyManager } from "../systems/world/EnemyManager";
import { ProjectileManager } from "../systems/world/ProjectileManager";

export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private ground!: Phaser.Tilemaps.TilemapLayer;
  private family!: Family;

  private inputManager!: InputManager;
  private hud!: WorldHUD;
  private enemyManager!: EnemyManager;
  private projectileManager!: ProjectileManager;

  private worldKey = "mundo-1";
  private timerMs = 0;
  private timerDone = false;
  private paused = false;

  constructor() {
    super("WorldScene");
  }

  init(data: { worldKey?: string }) {
    this.worldKey =
      data?.worldKey ?? "mundo-1";

    this.timerMs =
      WORLD_TIME_LIMIT * 1000;

    this.timerDone = false;
    this.paused = false;
  }

  create() {
    // Sistemas.
    this.inputManager = new InputManager(this);
    this.hud = new WorldHUD(this);
    this.enemyManager = new EnemyManager(this);
    this.projectileManager = new ProjectileManager(this);

    // Nivel.
    const map = this.createMap();

    this.createBackground(map);
    this.createPlayer(map);
    this.createCamera(map);
    this.createEnemies(map);
    this.createFamily(map);

    // HUD.
    this.hud.create(this.timerMs);

    this.cameras.main.fadeIn(
      500,
      2,
      1,
      10
    );

    // Limpieza al apagar la escena.
    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      this.cleanup,
      this
    );
  }

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

    // Pausa.
    if (this.inputManager.pausePressed) {
      this.openPause();
      return;
    }

    // Timer.
    this.timerMs -= delta;

    if (this.timerMs <= 0) {
      this.timerMs = 0;

      this.hud.updateTimer(
        this.timerMs
      );

      this.triggerGameOver("tiempo");
      return;
    }

    this.hud.updateTimer(
      this.timerMs
    );

    // Player.
    this.player.setMoveInput(
      this.inputManager.left,
      this.inputManager.right,
      this.inputManager.jumpPressed
    );

    this.player.setJumpHeld(
      this.inputManager.jumpHeld
    );

    // Familia.
    this.updateFamily();

    // Enemigos.
    this.enemyManager.update(
      this.player,
      this.projectileManager.getAll(),
      () => this.triggerGameOver("enemigo")
    );

    // Proyectiles.
    this.projectileManager.shoot(
      this.player,
      this.inputManager.crouching,
      this.inputManager.shootHeld
    );

    this.projectileManager.update();
  }

  // ---------------------------------------------------------------------------
  // MAP
  // ---------------------------------------------------------------------------

  private createMap(): Phaser.Tilemaps.Tilemap {
    const map = this.make.tilemap({
      key: ASSETS.mapaMundo1,
    });

    const tiles = map.addTilesetImage(
      "tileset-plataformas",
      ASSETS.tileset
    );

    if (!tiles) {
      throw new Error(
        "No se pudo cargar el tileset."
      );
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

    // Tiles sólidos.
    groundLayer.setCollisionBetween(
      1,
      8
    );

    this.ground = groundLayer;

    // Límites físicos del mundo.
    this.physics.world.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels
    );

    return map;
  }

  // ---------------------------------------------------------------------------
  // BACKGROUND
  // ---------------------------------------------------------------------------

  private createBackground(
    map: Phaser.Tilemaps.Tilemap
  ) {
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

    bg
      .setDepth(-10)
      .setAlpha(0.45)
      .setScrollFactor(0.15);

    this.addStars(
      map.widthInPixels,
      map.heightInPixels
    );
  }

  // ---------------------------------------------------------------------------
  // PLAYER
  // ---------------------------------------------------------------------------

  private createPlayer(
    map: Phaser.Tilemaps.Tilemap
  ) {
    const x =
      WORLD_CONFIG.playerSpawnX;

    const y =
      map.heightInPixels -
      WORLD_CONFIG.playerSpawnYOffset;

    this.player = new Player(
      this,
      x,
      y
    );

    // Player controla su propia escala e hitbox.
    this.player.setCollideWorldBounds(
      true
    );

    // Player ↔ suelo.
    this.physics.add.collider(
      this.player,
      this.ground
    );
  }

  // ---------------------------------------------------------------------------
  // CAMERA
  // ---------------------------------------------------------------------------

  private createCamera(
    map: Phaser.Tilemaps.Tilemap
  ) {
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
  }

  // ---------------------------------------------------------------------------
  // ENEMIES
  // ---------------------------------------------------------------------------

  private createEnemies(
    map: Phaser.Tilemaps.Tilemap
  ) {
    this.enemyManager.spawn(
      map,
      this.ground
    );
  }

  // ---------------------------------------------------------------------------
  // FAMILY
  // ---------------------------------------------------------------------------

  private createFamily(
    map: Phaser.Tilemaps.Tilemap
  ) {
    const x =
      WORLD_CONFIG.goalTileX *
        map.tileWidth +
      map.tileWidth;

    const y =
      map.heightInPixels -
      WORLD_CONFIG.playerSpawnYOffset;

    this.family = new Family(
      this,
      x,
      y
    );

    // La familia cae y se apoya sobre el mapa.
    this.physics.add.collider(
      this.family,
      this.ground
    );
  }

  private updateFamily() {
    this.physics.overlap(
      this.player,
      this.family,
      () => this.triggerWin()
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
  // WIN
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
              WORLD_TIME_LIMIT * 1000 -
              this.timerMs,
          }
        );
      }
    );
  }

  // ---------------------------------------------------------------------------
  // GAME OVER
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // CLEANUP
  // ---------------------------------------------------------------------------

  private cleanup() {
    this.hud?.destroy();
    this.enemyManager?.clear();
    this.projectileManager?.clear();

    if (this.family?.active) {
      this.family.destroy();
    }
  }
}