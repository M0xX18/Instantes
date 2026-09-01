import Phaser from "phaser";
import { ASSETS } from "../config/assets";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/game";

type Zone = {
  name: string;
  subtitle: string;
  x: number;
  y: number;
  radius: number;
  available: boolean;
  previewTexture?: string;
  mapKey?: string;
};

export class MapSelectScene extends Phaser.Scene {
  private cursor!: Phaser.GameObjects.Sprite;
  private mapImage!: Phaser.GameObjects.Image;
  private status!: Phaser.GameObjects.Text;
  private playButton!: Phaser.GameObjects.Text;
  private activeZone: Zone | null = null;
  private zoneMarkers: Phaser.GameObjects.Text[] = [];

  private static readonly CURSOR_SCALE = 0.20;

  private readonly zones: Zone[] = [
    {
      name: "ISLA DEL NACIMIENTO",
      subtitle: "Primer nivel",
      x: 342,
      y: 376,
      radius: 80,
      available: true,
      mapKey: "mundo-1",
    },
    {
      name: "JUNGLA DE LA NIÑEZ",
      subtitle: "Segundo nivel",
      x: 603,
      y: 185,
      radius: 120,
      available: false,
    },
    {
      name: "RIOS DE LA ADOLESCENCIA",
      subtitle: "Tercer nivel",
      x: 690,
      y: 300,
      radius: 100,
      available: false,
    },
    {
      name: "CIUDAD DE LA ADULTEZ",
      subtitle: "Cuarto nivel",
      x: 536,
      y: 475,
      radius: 130,
      available: false,
    },
    {
      name: "PRADERA DEL PRESENTE",
      subtitle: "Quinto nivel",
      x: 752,
      y: 520,
      radius: 120,
      available: false,
    },
    {
      name: "ISLA DEL FUTURO",
      subtitle: "?",
      x: 900,
      y: 376,
      radius: 80,
      available: false,
      previewTexture: ASSETS.mapaIsla,
      // mapKey: "mundo-1",
    },
  ];

  constructor() {
    super("MapSelectScene");
  }

  create() {
    // MAP

    this.mapImage = this.add
      .image(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        ASSETS.mapaZonas
      )
      .setDisplaySize(GAME_WIDTH, 714)
      .setDepth(0);

    // TITLE

    this.add
      .text(
        GAME_WIDTH / 2,
        28,
        "SELECCIONA UNA ZONA",
        {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "18px",
          color: "#fff5d6",
          stroke: "#102443",
          strokeThickness: 6,
        }
      )
      .setOrigin(0.5)
      .setDepth(2);

    // -------------------------------------------------------------------------
    // STATUS
    // -------------------------------------------------------------------------

    this.status = this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 82,
        "Elige una zona del mapa",
        {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "12px",
          color: "#fff5d6",
          align: "center",
          stroke: "#102443",
          strokeThickness: 5,
        }
      )
      .setOrigin(0.5)
      .setDepth(2);

    // -------------------------------------------------------------------------
    // UI
    // -------------------------------------------------------------------------

    this.createZoneMarkers();
    this.createCursor();
    this.createPlayButton();
    this.createZoneTargets();

    // Estado inicial.
    this.activeZone = null;
    this.mapImage.setTexture(ASSETS.mapaZonas);
    this.status.setText("Elige una zona del mapa");
    this.updatePlayButton(null);

    this.cameras.main.fadeIn(500, 2, 1, 10);
  }

  // ---------------------------------------------------------------------------
  // ZONE MARKERS
  // ---------------------------------------------------------------------------

  private createZoneMarkers() {
    this.zoneMarkers = [];

    for (const zone of this.zones) {
      const color = zone.available
        ? "#ffd67e"
        : "#8899aa";

      const marker = this.add
        .text(
          zone.x,
          zone.y - 14,
          "?",
          {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "22px",
            color,
            stroke: "#102443",
            strokeThickness: 5,
          }
        )
        .setOrigin(0.5)
        .setDepth(4);

      // Las zonas disponibles tienen una animación de pulso.
      if (zone.available) {
        this.tweens.add({
          targets: marker,
          scaleX: 1.15,
          scaleY: 1.15,
          duration: 700,
          yoyo: true,
          repeat: -1,
          ease: "Sine.InOut",
        });
      }

      this.zoneMarkers.push(marker);
    }
  }

  // ---------------------------------------------------------------------------
  // CURSOR / PLAYER
  // ---------------------------------------------------------------------------

  private createCursor() {
    // Animaciones exclusivas del mapa.
    if (!this.anims.exists("map-idle")) {
      this.anims.create({
        key: "map-idle",
        frames: this.anims.generateFrameNumbers(
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

    if (!this.anims.exists("map-walk")) {
      this.anims.create({
        key: "map-walk",
        frames: this.anims.generateFrameNumbers(
          ASSETS.personajeCaminar,
          {
            start: 0,
            end: 3,
          }
        ),
        frameRate: 8,
        repeat: -1,
      });
    }

    // -------------------------------------------------------------------------
    // CURSOR
    // -------------------------------------------------------------------------

    this.cursor = this.add
      .sprite(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        ASSETS.personajeIdle
      )
      .setDepth(5)
      .setAlpha(0)
      .setScale(MapSelectScene.CURSOR_SCALE)
      .setOrigin(0.5, 0.5);

    this.cursor.play("map-idle");

    // Pequeño movimiento vertical para que el cursor no parezca estático.
    this.tweens.add({
      targets: this.cursor,
      y: "-=4",
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
      paused: true,
    });
  }

  // ---------------------------------------------------------------------------
  // PLAY BUTTON
  // ---------------------------------------------------------------------------

  private createPlayButton() {
    this.playButton = this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 32,
        "ELIGE UNA ZONA",
        {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "12px",
          color: "#a5b0bf",
          backgroundColor: "#173252",
          padding: {
            x: 14,
            y: 8,
          },
        }
      )
      .setOrigin(0.5)
      .setDepth(3)
      .setInteractive({
        useHandCursor: true,
      });

    this.playButton.on("pointerover", () => {
      if (this.activeZone?.available) {
        this.playButton.setColor("#ffd67e");
      }
    });

    this.playButton.on("pointerout", () => {
      this.updatePlayButton(this.activeZone);
    });

    this.playButton.on("pointerup", () => {
      if (this.activeZone?.available) {
        this.startSelectedZone();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // ZONE TARGETS
  // ---------------------------------------------------------------------------

  private createZoneTargets() {
    for (const zone of this.zones) {
      // Área invisible de interacción.
      const target = this.add
        .circle(
          zone.x,
          zone.y,
          zone.radius,
          0xffffff,
          0
        )
        .setDepth(1)
        .setInteractive({
          useHandCursor: true,
        });

      target.on("pointerover", () => {
        this.selectZone(zone);
      });

      target.on("pointerup", () => {
        this.selectZone(zone);

        if (zone.available) {
          this.startSelectedZone();
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // SELECT ZONE
  // ---------------------------------------------------------------------------

  private selectZone(zone: Zone) {
    this.activeZone = zone;

    // Si existe preview, lo mostramos.
    // Si no, mantenemos el mapa general.
    this.mapImage.setTexture(
      zone.previewTexture ?? ASSETS.mapaZonas
    );

    // Texto de estado.
    this.status.setText(
      `${zone.name}\n${zone.subtitle}`
    );

    this.updatePlayButton(zone);

    // -------------------------------------------------------------------------
    // CURSOR
    // -------------------------------------------------------------------------

    this.cursor.setAlpha(1);

    // Cancelamos cualquier movimiento anterior.
    this.tweens.killTweensOf(this.cursor);

    // Animación de caminar durante el desplazamiento.
    this.cursor.play("map-walk", true);

    // Mirar hacia la dirección del movimiento.
    if (zone.x < this.cursor.x) {
      this.cursor.setFlipX(true);
    } else if (zone.x > this.cursor.x) {
      this.cursor.setFlipX(false);
    }

    this.tweens.add({
      targets: this.cursor,
      x: zone.x,
      y: zone.y + 4,
      duration: 380,
      ease: "Sine.Out",
      onComplete: () => {
        this.cursor.play("map-idle", true);

        // Pequeño rebote al llegar.
        this.tweens.add({
          targets: this.cursor,
          y: zone.y,
          duration: 140,
          yoyo: true,
          ease: "Sine.Out",
        });
      },
    });
  }

  // ---------------------------------------------------------------------------
  // PLAY BUTTON STATE
  // ---------------------------------------------------------------------------

  private updatePlayButton(zone: Zone | null) {
    if (!zone) {
      this.playButton
        .setText("ELIGE UNA ZONA")
        .setColor("#a5b0bf")
        .setAlpha(0.85);

      return;
    }

    if (zone.available) {
      this.playButton
        .setText("JUGAR ESTA ZONA")
        .setColor("#fff5d6")
        .setAlpha(1);

      return;
    }

    this.playButton
      .setText("PROXIMAMENTE")
      .setColor("#a5b0bf")
      .setAlpha(0.85);
  }

  // ---------------------------------------------------------------------------
  // START WORLD
  // ---------------------------------------------------------------------------

  private startSelectedZone() {
    if (!this.activeZone?.available) {
      return;
    }

    this.input.enabled = false;

    this.cameras.main.fadeOut(
      350,
      2,
      1,
      10
    );

    this.cameras.main.once(
      "camerafadeoutcomplete",
      () => {
        this.scene.start(
          "WorldScene",
          {
            worldKey:
              this.activeZone?.mapKey ??
              "mundo-1",
          }
        );
      }
    );
  }
}
