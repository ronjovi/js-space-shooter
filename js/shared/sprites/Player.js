/**
 * Class for the player
 */
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite); // load player ship asset

    this.visible = true; // show user
    this.sprite = sprite;
    this.fireRate = PLAYER_FIRE_RATE_X2;
    this.lastBulletFired = 0;
    this.addHealthbar(scene);
    this.initPlayerPhysics(scene); // start physics for playter -allows for movement and collision detection
    this.createAnimation();
  }

  /**
   * Adds health bar for player
   * @param {*} scene 
   */
  addHealthbar(scene) {
    const height = window.innerHeight;
    // add ship health
    this.hp = new HealthBar(
      scene,
      120,
      height - 47,
      PLAYER_HEALTH,
      200,
      20
    );
  }

  /**
   * Updates the remaining health in health bar
   * @param {number} damage number to decrease by
   */
  updateHealthBar(damage){
    this.hp.updateHealth(damage);
  }

  /**
   * Sets 
   * @param {*} scene 
   */
  initPlayerPhysics(scene) {
    scene.add.existing(this); // add player to scene
    this.scene.physics.world.enable(this); // enable phyics engine on player - mainly for collisions
    this.setCollideWorldBounds(true); //
  }

  createAnimation(){
    /**
     * CREATE and play animation for player object
     * Animation is played by default
     */
    this.scene.anims.create({
      key: "player-ship-idle",
      frames: this.anims.generateFrameNumbers(this.sprite),
      frameRate: 20,
      repeat: -1,
    });

    this.playAnim();
    this.setScale(1);
  }

  /**
   * Pauses the player idle animation
   */
  pauseAnim() {
    this.play("player-ship-idle");
  }

  /**
   * Starts playing the idle animation
   */
  playAnim() {
    this.play("player-ship-idle");
  }

  /**
   * Moves the player ship up
   */
  moveDown() {
    this.body.setVelocityY(PLAYER_VELOCITY_X2);
  }

  /**
   * Moves the player ship down
   */
  moveUp() {
    this.body.setVelocityY(-1 * PLAYER_VELOCITY_X2);
  }

  /**
   * Moves the player ship right
   */
  moveRight() {
    this.body.setVelocityX(PLAYER_VELOCITY_X2);
  }

  /**
   * Moves the player ship left
   */
  moveLeft() {
    this.body.setVelocityX(-1 * PLAYER_VELOCITY_X2);
  }

  /**
   * Stops the player movement on horizontal axis
   */
  stopMovingHorizontally() {
    this.body.setVelocityX(0); // stop horizontal movement
  }

  /**
   * Stops the player movement on vertical axis
   */
  stopMovingVertically() {
    this.body.setVelocityY(0); // stop horizontal movement
  }

  /**
   * Fires a bullet form players ship
   * First checks if the current time elaspsed is bigger that timestamp for the firing delay
   * If there is a bullet avaialbe (isActive: false) - it fires it
   * @param {number} time time that has elapsed in game
   * @param {objects[]} bullets list of bullet instances
   */
  fireBullet(time, bullets) {
    if (time > this.lastBulletFired) {
      const bullet = bullets.get(); // check for a avaialble bullet

      if (bullet) {
        bullet.fire(this.x, this.y); // fire bullet from player pos
        this.lastBulletFired = time + this.fireRate; // update fire delay timestamp
      }
    }
  }
}
