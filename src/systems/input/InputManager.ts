import Phaser from "phaser";

export class InputManager {
  readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  readonly wasd: Record<
    "W" | "A" | "S" | "D",
    Phaser.Input.Keyboard.Key
  >;

  private readonly pauseKey: Phaser.Input.Keyboard.Key;
  private readonly shootKeys: Phaser.Input.Keyboard.Key[];
  private readonly spaceKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;

    if (!keyboard) {
      throw new Error("No se pudo inicializar el teclado.");
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

    this.cursors = keyboard.createCursorKeys();

    this.wasd = {
      W: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.spaceKey = keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.pauseKey = keyboard.addKey(
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
  }

  get left(): boolean {
    return (
      this.cursors.left.isDown ||
      this.wasd.A.isDown
    );
  }

  get right(): boolean {
    return (
      this.cursors.right.isDown ||
      this.wasd.D.isDown
    );
  }

  get jumpHeld(): boolean {
    return (
      this.cursors.up.isDown ||
      this.wasd.W.isDown ||
      this.spaceKey.isDown
    );
  }

  get jumpPressed(): boolean {
    return (
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.W) ||
      Phaser.Input.Keyboard.JustDown(this.spaceKey)
    );
  }

  get crouching(): boolean {
    return (
      this.cursors.down.isDown ||
      this.wasd.S.isDown
    );
  }

  get shootHeld(): boolean {
    return this.shootKeys.some(
      (key) => key.isDown
    );
  }

  get pausePressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(
      this.pauseKey
    );
  }
}