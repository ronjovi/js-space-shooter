/**
 * Class for the player
 */
 class PlayerShipB extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, "player-ship-b"); // load player ship asset
  
      this.health = 200;
      this.fireRate = PLAYER_FIRE_RATE_DEAFULT;
      this.lastBulletFired = 0;
      this.initPlayer(scene); // start physics for playter -allows for movement and collision detection
    }
  
    initPlayer(scene) {
      scene.add.existing(this); // add player to scene
      this.scene.physics.world.enable(this); // enable phyics engine on player - mainly for collisions
      
      this.setCollideWorldBounds(true); //
      this.visible = true; // show user
  
      /**
       * CREATE and play animation for player object
       * Animation is played by default
       */
      this.scene.anims.create({
        key: "player-ship-b-idle",
        frames: this.anims.generateFrameNumbers("player-ship-b"),
        frameRate: 20,
        repeat: -1,
      });
  
      this.playAnim();
      this.setScale(1)
    }
  
    /**
     * Pauses the player idle animation
     */
    pauseAnim() {
      this.play("player-ship-b-idle");
    }
  
    /**
     * Starts playing the idle animation
     */
    playAnim() {
      this.play("player-ship-b-idle");
    }
  
    /**
     * Moves the player ship up
     */
    moveDown() {
      this.body.setVelocityY(PLAYER_VELOCITY_DEFAULT);
    }
  
    /**
     * Moves the player ship down
     */
    moveUp() {
      this.body.setVelocityY(-1 * PLAYER_VELOCITY_DEFAULT);
    }
  
    /**
     * Moves the player ship right
     */
    moveRight() {
      this.body.setVelocityX(PLAYER_VELOCITY_DEFAULT);
    }
  
    /**
     * Moves the player ship left
     */
    moveLeft() {
      this.body.setVelocityX(-1 * PLAYER_VELOCITY_DEFAULT);
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
  