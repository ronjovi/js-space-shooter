/**
 * Class for the explosions
 */
class Explosion extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, 0, 0, "explosion");
    this.setDepth(2);

    /**
     * CREATE animation for explosion sprite
     * Animation plays once show() is called on explosion
     */
     this.scene.anims.create({
      key: "explosion_anim",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  show(x, y) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);

    this.play("explosion_anim");

    setTimeout(() => {
      this.setActive(false);
      this.setVisible(false);
    }, 350);
  }

  update(time, delta) {
    // if (!this.scene.isPaused) {
    //     this.visible = true;
    //     this.y += this.speed * delta;
    //     if (this.y > window.innerHeight + 100) {
    //         this.destroy();
    //     }
    // } else {
    //     this.visible = false;
    // }
  }
}
