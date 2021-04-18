/**
 * Class for the explosions
 */
 class Explosion extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, 0, 0, "explosion");
    }
  
    show(x, y) {
      this.setPosition(x, y);
      this.setActive(true);
      this.setVisible(true);
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