/**
 * Class for Game asteroid. This class will be used
 * for small asteroids with 3 health and large asteroids with 6 health
 */
class Asteroid extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, SM_ASTEROID_SPRITE);
    this.initPhysics(); // start physics for playter -allows for movement and collision detection

  }

  initPhysics() {
    this.scene.physics.world.enable(this);
  }

  /**
   * Spawns asteroid on random x axis val
   * Sets asteroid to be visible and active for collisions
   * @param {*} x
   */
  spawn(x) {
    this.setPosition(x, -10);

    this.setActive(true);
    this.setVisible(true);
    this.setDepth(1);
  }

  /**
   * Updates the asteroid Y position

   */
  update() {
    // only show and move asteroid when game is not paused
    if (!this.scene.isPaused && this.scene.isReady) {
      if (this.visible) {
        // move asteroid down
        this.y += this.speed;

        // hide asteroid if its past the game viewport/screen
        if (this.y > window.innerHeight + 100) {
          this.setActive(false);
          this.setVisible(false);
        }
      } else {
        this.setVisible(true);

      }
    } else if (this.scene.isPaused && this.scene.isReady) {
      // hide asteroid
      this.visible = false;

    } else {
      // hide asteroid
      this.visible = false;
      this.setActive(false);
      this.setPosition(-100, -100);
    }
  }

  hide() {
    this.setVisible(false);
    this.setActive(false);
    this.setPosition(-1000, -1000);
    this.setVelocity(0);
  }
}
