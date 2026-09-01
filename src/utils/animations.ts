import Phaser from "phaser";
import { ASSETS } from "../config/assets";

export function createCharacterAnimations(
  scene: Phaser.Scene
) {
  if (!scene.anims.exists("idle")) {
    scene.anims.create({
      key: "idle",
      frames: scene.anims.generateFrameNumbers(
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

  if (!scene.anims.exists("walk")) {
    scene.anims.create({
      key: "walk",
      frames: scene.anims.generateFrameNumbers(
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

  if (!scene.anims.exists("jump")) {
    scene.anims.create({
      key: "jump",
      frames: scene.anims.generateFrameNumbers(
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

export function createEnemyAnimations(
  scene: Phaser.Scene
) {
  if (!scene.anims.exists("spider-walk")) {
    scene.anims.create({
      key: "spider-walk",
      frames: scene.anims.generateFrameNumbers(
        ASSETS.enemySpider,
        {
          start: 0,
          end: 3,
        }
      ),
      frameRate: 8,
      repeat: -1,
    });
  }

  if (!scene.anims.exists("avocado-walk")) {
    scene.anims.create({
      key: "avocado-walk",
      frames: scene.anims.generateFrameNumbers(
        ASSETS.enemyAvocado,
        {
          start: 0,
          end: 3,
        }
      ),
      frameRate: 6,
      repeat: -1,
    });
  }
}
