import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "./config/game";
import { BootScene } from "./scenes/BootScene";
import { TitleScene } from "./scenes/TitleScene";
import { IntroScene } from "./scenes/IntroScene";
import { WorldScene } from "./scenes/WorldScene";
import { PauseScene } from "./scenes/PauseScene";
import { MapSelectScene } from "./scenes/MapSelectScene";
import { WinScene } from "./scenes/WinScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { CinematicScene } from "./scenes/CinematicScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#02010a",
  pixelArt: true,
  antialias: false,
  render: {
    powerPreference: "high-performance",
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 900 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, TitleScene, IntroScene, MapSelectScene, WorldScene, CinematicScene, PauseScene, WinScene, GameOverScene],
};

new Phaser.Game(config);
