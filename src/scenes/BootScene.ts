import Phaser from "phaser";
import { ASSETS } from "../config/assets";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image(ASSETS.fondoEspacio, "assets/images/fondo-espacio.png");
    this.load.image(ASSETS.mapaZonas, "assets/images/mapa.jpg");
    this.load.image(ASSETS.mapaIsla, "assets/images/mapa-isla.jpg");
    this.load.image(ASSETS.tileset, "assets/images/tileset-plataformas.png");
    this.load.tilemapTiledJSON(ASSETS.mapaMundo1, "assets/maps/mundo-1.json");

    // Papitas
    this.load.spritesheet(ASSETS.personajeIdle, "assets/images/papitas-idle.png", {
      frameWidth: 139, frameHeight: 448,
    });
    this.load.spritesheet(ASSETS.personajeCaminar, "assets/images/personaje-caminar.png", {
      frameWidth: 64, frameHeight: 96,
    });
    this.load.spritesheet(ASSETS.personajeSalto, "assets/images/personaje-salto.png", {
      frameWidth: 64, frameHeight: 96,
    });

    // Andres
    this.load.spritesheet(
      ASSETS.andres,
      "assets/images/andres.png",
      {
        frameWidth: 139,
        frameHeight: 448,
      }
    );
 
    // Arabella
    this.load.spritesheet(
      ASSETS.arabella,
      "assets/images/arabella.png",
      {
        frameWidth: 139,
        frameHeight: 448,
      }
    );

    // Enemies
    this.load.spritesheet(ASSETS.enemySpider, "assets/images/araña.png", {
      frameWidth: 204, frameHeight: 306,
    });
    this.load.spritesheet(ASSETS.enemyAvocado, "assets/images/aguacate.png", {
      frameWidth: 204, frameHeight: 306,
    });
  }

  create() {
    // Projectile texture
    const projectile = this.make.graphics({ x: 0, y: 0 });
    projectile.fillStyle(0xffe6a3, 1);
    projectile.fillCircle(6, 6, 5);
    projectile.lineStyle(1, 0xffffff, 0.9);
    projectile.strokeCircle(6, 6, 5);
    projectile.generateTexture(ASSETS.proyectil, 12, 12);
    projectile.destroy();

    // Enemy animations
    const anims = this.anims;
    if (!anims.exists("spider-walk")) {
      anims.create({
        key: "spider-walk",
        frames: anims.generateFrameNumbers(ASSETS.enemySpider, { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
      anims.create({
        key: "avocado-walk",
        frames: anims.generateFrameNumbers(ASSETS.enemyAvocado, { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1,
      });
    }

    this.scene.start("TitleScene");
  }
}
