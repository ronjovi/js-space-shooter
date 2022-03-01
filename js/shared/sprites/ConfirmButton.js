/**
 * Class for the confirmation button
 */
class ConfirmButton extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "confirm-btn"); // load player ship asset

    scene.add.existing(this);
    this.setScale(1.1);
    this.setInteractive({ useHandCursor: true });

    // shows the hover sprite frame
    this.on("pointerover", (pointer) => {
      this.setFrame(1);
    });

    // shows the no hover sprite frame
    this.on("pointerout", (pointer) => {
      this.setFrame(0);
    });
  }
}
