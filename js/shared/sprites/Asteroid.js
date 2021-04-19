/**
 * Class for the bullet is sent by the player ship
 */
class Asteroid extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, SM_ASTEROID_SPRITE);
    this.initPhysics(); // start physics for playter -allows for movement and collision detection
    this.speed = SM_ASTEROID_SPEED; // set default speed;
    this.health = SM_ASTEROID_HEALTH; // set default health
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
    this.setPosition(x, -100);

    this.setActive(true);
    this.setVisible(true);
    this.setDepth(1);

    console.log(this.speed);
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

  /**
   * Updates the asteroid frame state based on health
   *
   * @param {*} bullet
   */
  collisionHandler() {
    // detect health of asteroid
    if (this.health === 3) {
      this.health -= 1;
      this.setFrame(1);
    } else if (this.health === 2) {
      this.health -= 1;
      this.setFrame(2);
    } else {
      this.destroy(); // no more health destroy
    }
  }

  hide() {
    this.setVisible(false);
    this.setActive(false);
    this.setPosition(-100, -100);
    this.setVelocity(0);
  }
}
