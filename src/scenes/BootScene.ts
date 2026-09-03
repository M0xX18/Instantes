import Phaser from "phaser";
import { ASSETS } from "../config/assets";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image(ASSETS.fondoEspacio, "assets/images/fondo-espacio.png");
    this.load.image(ASSETS.fondoIsla, "assets/images/fondo-isla.png");
    this.load.image(ASSETS.fondoJungla, "assets/images/fondo-jungla.png");
    this.load.image(ASSETS.fondoRios, "assets/images/fondo-rios.png");
    this.load.image(ASSETS.fondoCiudad, "assets/images/fondo-ciudad.png");
    this.load.image(ASSETS.fondoPradera, "assets/images/fondo-pradera.png");
    this.load.image(ASSETS.mapaZonas, "assets/images/mapa.jpg");
    this.load.image(ASSETS.mapaIsla, "assets/images/mapa-isla.jpg");
    this.load.image(ASSETS.tileset, "assets/images/tileset-plataformas.png");
    this.load.tilemapTiledJSON(ASSETS.mapaMundo1, "assets/maps/mundo-1.json");
    this.load.tilemapTiledJSON(ASSETS.mapaMundo2, "assets/maps/mundo-2.json");
    this.load.tilemapTiledJSON(ASSETS.mapaMundo3, "assets/maps/mundo-3.json");
    this.load.tilemapTiledJSON(ASSETS.mapaMundo4, "assets/maps/mundo-4.json");
    this.load.tilemapTiledJSON(ASSETS.mapaMundo5, "assets/maps/mundo-5.json");

    // Papitas
    this.load.spritesheet(ASSETS.personajeIdle, "assets/images/papitas-idle.png", {
      frameWidth: 139, frameHeight: 448,
    });
    this.load.spritesheet(ASSETS.personajeCaminar, "assets/images/papitas-caminar.png", {
      frameWidth: 139, frameHeight: 448,
    });
    // Andres
    this.load.spritesheet(
      ASSETS.andres,
      "assets/images/andres.png",
      {
        frameWidth: 292,
        frameHeight: 927,
      }
    );
    // Arabella
    this.load.spritesheet(
      ASSETS.arabella,
      "assets/images/arabella-celebracion.png",
      {
        frameWidth: 177,
        frameHeight: 351,
      }
    );
    this.load.spritesheet(
      ASSETS.victoriaBeso,
      "assets/images/victoria-beso-sprites.png",
      {
        frameWidth: 512,
        frameHeight: 512,
      }
    );
    this.load.image(
      ASSETS.victoriaMesaPastel,
      "assets/images/victoria-mesa-pastel.png"
    );

    // Enemies
    this.load.spritesheet(ASSETS.enemySpider, "assets/images/araña.png", {
      frameWidth: 204, frameHeight: 306,
    });
    this.load.spritesheet(ASSETS.enemyAvocado, "assets/images/aguacate.png", {
      frameWidth: 204, frameHeight: 306,
    });
    this.load.image(
      ASSETS.enemyRiverWorm,
      "assets/images/enemigo-gusano-rio.png"
    );

    // Collectibles y proyectiles de poderes.
    this.load.image(ASSETS.itemBrocoli, "assets/images/item-brocoli.png");
    this.load.image(ASSETS.itemJugoGuayaba, "assets/images/item-jugo-guayaba.png");
    this.load.image(ASSETS.itemPapitasFritas, "assets/images/item-papitas-fritas.png");
    this.load.image(ASSETS.itemJugoLulo, "assets/images/item-jugo-lulo.png");
    this.load.image(ASSETS.itemHamburguesa, "assets/images/item-hamburguesa.png");
    this.load.image(ASSETS.proyectilPapa, "assets/images/proyectil-papa.png");
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

    const luloProjectile = this.make.graphics({ x: 0, y: 0 });
    luloProjectile.fillStyle(0xffc928, 1);
    luloProjectile.fillCircle(7, 7, 6);
    luloProjectile.lineStyle(2, 0x79c83d, 1);
    luloProjectile.strokeCircle(7, 7, 5);
    luloProjectile.generateTexture(ASSETS.proyectilLulo, 14, 14);
    luloProjectile.destroy();

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
