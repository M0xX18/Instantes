import Phaser from "phaser";

import { Player } from "../entities/Player";
import { Family } from "../entities/Family";
import { Enemy } from "../entities/Enemy";
import { Projectile } from "../entities/Projectile";
import { Collectible } from "../entities/Collectible";

import { ASSETS } from "../config/assets";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  WORLD_TIME_LIMIT,
} from "../config/game";
import {
  isPlayableLevel,
  PLAYABLE_LEVELS,
} from "../config/levels";
import type { LevelDefinition } from "../data/levels/types";
import {
  ITEM_EFFECTS,
  POWER_LABELS,
  type CollectibleType,
  type PowerMode,
} from "../config/items";

import { InputManager } from "../systems/input/InputManager";
import { WorldHUD } from "../systems/ui/WorldHUD";
import { DialogueOverlay } from "../systems/ui/DialogueOverlay";
import { EnemyManager } from "../systems/world/EnemyManager";
import { ProjectileManager } from "../systems/world/ProjectileManager";
import { ItemManager } from "../systems/world/ItemManager";
import {
  LevelProgress,
  type LevelKey,
} from "../systems/progression/LevelProgress";

export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private ground!: Phaser.Tilemaps.TilemapLayer;
  private family!: Family;
  private goalSensor!: Phaser.GameObjects.Zone;

  private inputManager!: InputManager;
  private hud!: WorldHUD;
  private enemyManager!: EnemyManager;
  private projectileManager!: ProjectileManager;
  private itemManager!: ItemManager;

  private slowDebuffActive = false;
  private fireDebuffActive = false;
  private slowDebuffTimer?: Phaser.Time.TimerEvent;
  private fireDebuffTimer?: Phaser.Time.TimerEvent;

  private worldKey: LevelKey = "mundo-1";
  private level!: LevelDefinition;
  private timerMs = 0;
  private timerDone = false;
  private paused = false;
  private fallDeathY = 0;
  private introDialogueActive = false;
  private dialogue?: DialogueOverlay;
  private dialogueResumeTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super("WorldScene");
  }

  init(data: { worldKey?: LevelKey }) {
    this.worldKey =
      data?.worldKey ?? "mundo-1";

    this.timerMs =
      WORLD_TIME_LIMIT * 1000;

    this.timerDone = false;
    this.paused = false;
    this.slowDebuffActive = false;
    this.fireDebuffActive = false;
    this.slowDebuffTimer = undefined;
    this.fireDebuffTimer = undefined;
    this.fallDeathY = 0;
    this.introDialogueActive = false;
    this.dialogue = undefined;
    this.dialogueResumeTimer = undefined;
  }

  create() {
    // Mundo 6 es una secuencia final, nunca un nivel controlable.
    if (!isPlayableLevel(this.worldKey)) {
      this.scene.start("CinematicScene", {
        worldKey: this.worldKey,
      });
      return;
    }

    this.level = PLAYABLE_LEVELS[this.worldKey];

    // Puede quedar pausado después de completar o perder una ejecución anterior.
    this.physics.world.resume();
    this.physics.world.gravity.y = this.level.gravityY;

    // Sistemas.
    this.inputManager = new InputManager(this);
    this.hud = new WorldHUD(this);
    this.enemyManager = new EnemyManager(this);
    this.projectileManager = new ProjectileManager(this);
    this.itemManager = new ItemManager(this);

    // Nivel.
    const map = this.createMap();

    this.createBackground(map);
    this.createPlayer(map);
    this.createCamera(map);
    this.createEnemies(map);
    this.createItems(map);
    this.createFamily(map);
    this.createCombatCollisions();
    this.createItemCollisions();

    // HUD.
    this.hud.create(this.timerMs);

    if (this.worldKey === "mundo-1") {
      this.showIntroDialogue();
    }

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
      this.timerDone ||
      this.introDialogueActive
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

    // Sin límite físico inferior, Papitas atraviesa los huecos reales del
    // terreno. Cuando desaparece bajo el mapa, pierde el nivel.
    if (this.player.y > this.fallDeathY) {
      this.triggerGameOver("vacio");
      return;
    }

    // Player.
    this.player.setMoveInput(
      this.inputManager.left,
      this.inputManager.right,
      this.inputManager.jumpPressed
    );

    this.player.setJumpHeld(
      this.inputManager.jumpHeld
    );

    // Enemigos.
    this.enemyManager.update();

    // Proyectiles.
    this.projectileManager.shoot(
      this.player,
      this.inputManager.crouching,
      this.inputManager.shootHeld
    );

    this.projectileManager.update();
  }

  // ---------------------------------------------------------------------------
  // INTRO DIALOGUE
  // ---------------------------------------------------------------------------

  private showIntroDialogue() {
    this.introDialogueActive = true;
    this.physics.world.pause();

    this.dialogue = new DialogueOverlay(
      this,
      {
        speaker: "ANDRÉS",
        pages: [
          "Papitas, todo viaje comienza con un primer paso.",
          "Esta isla guarda el inicio de nuestra historia.",
          "Recórrela con calma y encuéntranos al final.",
        ],
        onDismiss: () => {
          this.dialogue = undefined;

          // Evita que la misma tecla usada para cerrar el diálogo active una
          // acción del juego durante ese instante.
          this.dialogueResumeTimer =
            this.time.delayedCall(
              120,
              () => {
                this.introDialogueActive = false;
                this.physics.world.resume();
              }
            );
        },
      }
    );
  }

  // ---------------------------------------------------------------------------
  // MAP
  // ---------------------------------------------------------------------------

  private createMap(): Phaser.Tilemaps.Tilemap {
    const map = this.make.tilemap({
      key: this.level.mapKey,
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

    // El tileset reserva su primer cuadro para vacío, mientras que el mapa
    // histórico guarda césped/tierra/plataforma como 1/2/3. Normalizamos a
    // los índices visuales 2/3/4 para que dibujo y colisión coincidan.
    groundLayer.forEachTile((tile) => {
      if (
        tile.index >= 1 &&
        tile.index <= 3
      ) {
        tile.index += 1;
      }
    });

    groundLayer.setCollision([2, 3, 4]);

    this.ground = groundLayer;

    // Límites físicos del mundo.
    this.physics.world.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels,
      true,
      true,
      true,
      false
    );

    this.fallDeathY =
      map.heightInPixels + 40;

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
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        this.level.background
      )
      .setScrollFactor(0)
      .setDepth(-20);

    bg.setDisplaySize(
      GAME_WIDTH,
      GAME_HEIGHT
    );

    // En Ríos, la cascada sólo entra en cámara al alcanzar el último tramo.
    if (this.level.finalBackground) {
      this.add
        .image(
          map.widthInPixels -
            GAME_WIDTH / 2,
          GAME_HEIGHT / 2,
          this.level.finalBackground
        )
        .setDisplaySize(
          GAME_WIDTH,
          GAME_HEIGHT
        )
        .setScrollFactor(1, 0)
        .setDepth(-19);
    }
  }

  // ---------------------------------------------------------------------------
  // PLAYER
  // ---------------------------------------------------------------------------

  private createPlayer(
    map: Phaser.Tilemaps.Tilemap
  ) {
    const x =
      this.level.playerSpawnX;

    const y =
      map.heightInPixels -
      this.level.playerSpawnYOffset;

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
      this.ground,
      this.level.enemies
    );
  }

  private createItems(
    map: Phaser.Tilemaps.Tilemap
  ) {
    this.itemManager.spawn(
      this,
      map,
      this.level.items
    );
  }

  private createItemCollisions() {
    this.physics.add.overlap(
      this.player,
      this.itemManager.getGroup(),
      (_playerObject, itemObject) => {
        this.collectItem(
          itemObject as Collectible
        );
      }
    );
  }

  private collectItem(item: Collectible) {
    if (!item.collect()) {
      return;
    }

    const itemType = item.itemType;

    if (
      itemType === "broccoli" ||
      itemType === "guava"
    ) {
      this.applyDowngrade(itemType);
      this.cameras.main.flash(
        130,
        170,
        35,
        45
      );
      return;
    }

    this.applyPowerUp(itemType);
    this.cameras.main.flash(
      130,
      65,
      185,
      105
    );
  }

  private applyDowngrade(
    itemType: "broccoli" | "guava"
  ) {
    if (itemType === "broccoli") {
      this.slowDebuffActive = true;
      this.player.setSpeedMultiplier(
        ITEM_EFFECTS.broccoliSpeedMultiplier
      );

      this.slowDebuffTimer?.remove(false);
      this.slowDebuffTimer =
        this.time.delayedCall(
          ITEM_EFFECTS.debuffDurationMs,
          () => {
            this.slowDebuffActive = false;
            this.player.setSpeedMultiplier(1);
            this.refreshDebuffHud();
          }
        );
    } else {
      this.fireDebuffActive = true;
      this.projectileManager.setCooldownMultiplier(
        ITEM_EFFECTS.guavaCooldownMultiplier
      );

      this.fireDebuffTimer?.remove(false);
      this.fireDebuffTimer =
        this.time.delayedCall(
          ITEM_EFFECTS.debuffDurationMs,
          () => {
            this.fireDebuffActive = false;
            this.projectileManager.setCooldownMultiplier(1);
            this.refreshDebuffHud();
          }
        );
    }

    this.refreshDebuffHud();
  }

  private applyPowerUp(
    itemType: Exclude<
      CollectibleType,
      "broccoli" | "guava"
    >
  ) {
    const powerMode: PowerMode =
      itemType === "fries"
        ? "fries"
        : itemType === "lulo"
          ? "lulo"
          : "burger";

    this.projectileManager.setPowerMode(
      powerMode
    );
    this.hud.setPower(
      POWER_LABELS[powerMode]
    );
  }

  private refreshDebuffHud() {
    const debuffs: string[] = [];

    if (this.slowDebuffActive) {
      debuffs.push("MOVIMIENTO LENTO");
    }

    if (this.fireDebuffActive) {
      debuffs.push("DISPARO LENTO");
    }

    this.hud.setDebuffs(debuffs);
  }

  private createCombatCollisions() {
    const enemies =
      this.enemyManager.getGroup();

    const projectiles =
      this.projectileManager.getGroup();

    // Contacto corporal de Papitas con cualquier enemigo.
    this.physics.add.overlap(
      this.player,
      enemies,
      () => this.triggerGameOver("enemigo")
    );

    // Un proyectil sólo puede resolver un impacto válido una vez.
    this.physics.add.overlap(
      projectiles,
      enemies,
      (projectileObject, enemyObject) => {
        const projectile =
          projectileObject as Projectile;

        const enemy =
          enemyObject as Enemy;

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

    // Los disparos ya no atraviesan suelo, paredes ni plataformas.
    this.physics.add.collider(
      projectiles,
      this.ground,
      (projectileObject) => {
        const projectile =
          projectileObject as Projectile;

        if (projectile.active) {
          projectile.destroy();
        }
      }
    );
  }

  // ---------------------------------------------------------------------------
  // FAMILY
  // ---------------------------------------------------------------------------

  private createFamily(
    map: Phaser.Tilemaps.Tilemap
  ) {
    const x =
      this.level.goalTileX *
        map.tileWidth +
      map.tileWidth / 2;

    const y =
      this.level.goalTileY *
      map.tileHeight;

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

    // Sensor independiente del cuerpo animado de la familia. El cuerpo de
    // Family cambia de posición al resolver su colisión con la plataforma y
    // podía dejar de solaparse aunque los sprites sí se estuvieran tocando.
    this.goalSensor = this.add
      .zone(
        x,
        y - 72,
        170,
        150
      )
      .setOrigin(0.5);

    this.physics.add.existing(
      this.goalSensor,
      true
    );

    // Papitas entra al área visible de Andrés o Arabella: completa el nivel.
    this.physics.add.overlap(
      this.player,
      this.goalSensor,
      () => this.triggerWin()
    );
  }

  // ---------------------------------------------------------------------------
  // WIN
  // ---------------------------------------------------------------------------

  private triggerWin() {
    if (this.timerDone) {
      return;
    }

    this.timerDone = true;

    const { newlyUnlockedLevel } =
      LevelProgress.complete(
        this.worldKey
      );

    this.stopPhysicsAfterResult();

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

            unlockedLevel:
              newlyUnlockedLevel,
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
      | "enemigo"
      | "vacio" = "tiempo"
  ) {
    if (this.timerDone) {
      return;
    }

    this.timerDone = true;
    this.stopPhysicsAfterResult();

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

  private stopPhysicsAfterResult() {
    this.player.setVelocity(0, 0);
    this.physics.world.pause();
  }

  // ---------------------------------------------------------------------------
  // CLEANUP
  // ---------------------------------------------------------------------------

  private cleanup() {
    this.dialogue?.destroy();
    this.dialogueResumeTimer?.remove(false);
    this.slowDebuffTimer?.remove(false);
    this.fireDebuffTimer?.remove(false);
    this.hud?.destroy();
  }
}
