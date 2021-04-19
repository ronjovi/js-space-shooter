/**
 * Scene for the first level in the game
 * Mission: the player must escape the asteroid field without dying
 * The level lasts for 240 seconds
 */
class LevelOneScene extends Phaser.Scene {
  constructor() {
    super({
      key: "LevelOneScene",
    });

    // USER PROFILE
    this.profile = PLAYER_PLACEHOLDER;
    // GAME STATE
    this.isPaused = false;
    this.isReady = false;
    this.level = 1;
    this.score = 0;
    this.integrity = 1;
    this.clockTime = 1; //LEVEL_ONE_TIME;
    this.asteroidSpawnDelay = 500;
  }

  /**
   * Loads Profile from storage
   */
  loadProfile() {
    if (localStorage.profile) {
      this.profile = JSON.parse(localStorage.profile);
    }
  }

  /**
   *
   */
  preload() {
    this.load.scenePlugin({
      key: "rexuiplugin",
      url:
        "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      sceneKey: "rexUI",
    });

    this.loadProfile();

    // load space background
    this.load.image(
      "level-one-background",
      "../../images/backgrounds/lvl_one_background.png"
    );

    // load start btn
    this.load.spritesheet("start-btn", "../../images/gui/start-btn.png", {
      frameWidth: 124,
      frameHeight: 34.62,
    });

    // load small asteroid
    this.load.spritesheet(
      SM_ASTEROID_SPRITE,
      "../../images/asteroids/asteroid_sm_1.png",
      {
        frameWidth: SM_ASTEROID_W,
        frameHeight: SM_ASTEROID_H,
      }
    );

    // loads explosion sprite
    this.load.spritesheet(
      "explosion",
      "../../images/explosions/explosion.png",
      { frameWidth: 100, frameHeight: 99.88 }
    );

    // load ship A
    this.load.spritesheet(
      "player-ship-a",
      "https://temp-assets-t.s3-us-west-1.amazonaws.com/ship-A.png",
      { frameWidth: 100, frameHeight: 119 }
    );

    // load ship B
    this.load.spritesheet(
      "player-ship-b",
      "https://temp-assets-t.s3-us-west-1.amazonaws.com/ship-B.png",
      { frameWidth: 122.8, frameHeight: 140 }
    );

    // load ship C
    this.load.spritesheet(
      "player-ship-c",
      "https://temp-assets-t.s3-us-west-1.amazonaws.com/ship-C.png",
      { frameWidth: 95, frameHeight: 173.4 }
    );

    // loads player bullet img
    this.load.image(
      "player-bullet",
      "https://temp-assets-t.s3-us-west-1.amazonaws.com/player-bullet.png"
    );

    // loads the instructions image
    this.load.image(
      "instructions-sm",
      "https://temp-assets-t.s3-us-west-1.amazonaws.com/instructions-sm.png"
    );

    // loads the font
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );
  }

  /**
   *
   */
  create() {
    /**
     * GET VIEWPORT DIMENSIONS
     */
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.clockTime = 1;

    // get graphics for create method
    this.gameSceneGraphics = this.add.graphics();

    // creates keys listener for player action/movement
    // Used to listen for "space", "up", "down", "right", "left", "p"
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    this.pauseMenu = new PauseMenu(this);
    this.gameOverMenu = new GameOverMenu(this);
    this.winnerMenu = new WinnerMenu(this);
    this.startMenu = new levelStartMenu(this, LEVEL_START_MESSAGE);

    // creates the timer event to track time elapsed in the game
    this.createTimerEvent();

    // add space background to game
    this.addBackground(width);

    // adds explosions - explosion on asteroid hit and player hit
    this.createExplosions();

    // creates asteroid for the game
    this.createAsteroids();

    // creates the player bullets for the game
    this.createBullets();

    // creates the player ship sprite for game
    this.addPlayer();

    this.createCollisionHandlers(); // creates collision events for game objects
    this.addHUD(height, width); // adds HUD to game

    // this.addActionButtons
    this.hideLoader(); // hide the spinner

    // set the resize listener and callback
    this.scale.on("resize", this.resize, this);

    // DEBUG
    this.gameSceneGraphics
      .lineStyle(2, 0x00ffff, 2)
      .strokeRectShape(this.player.body.customBoundsRectangle)
      .setVisible(true)
      .setDepth(3);
  }

  /**
   *
   * @param {*} time
   * @param {*} delta
   */
  update(time, delta) {
    // update values of GUI text
    this.levelText.setText(`${this.level}`);
    this.scoreText.setText(`${this.score}`);
    this.timeHUD.setText(`Time Left: ${this.clockTime}`);
    this.hp.setText(`${this.player.hp.currentHealth}`);

    if (!this.isPaused && this.isReady) {
      if (this.player.hp.currentHealth > 0) {
        // scroll the background down
        this.bg.tilePositionY -= 2.5;
        // check for player input
        this.playerInputHandler(time);
        // handles spawns of asteroids
        this.asteroidSpawnHandler(time, delta);

        if (this.clockTime === 0) {
          this.gameOverHandler();
        }
      }
    }
  }

  /**
   * Creates the clock timer event for the game
   * Timer fires decrementClock every second
   */
  createTimerEvent() {
    this.gameClock = this.time.addEvent({
      delay: 1000, // value in ms
      callback: this.decrementClock, // decrements clock by 1 (second)
      callbackScope: this, // game scene obj
      loop: true, // loop infinitely
    });
    // by default timer is paused
    this.gameClock.paused = true;
  }

  /**
   * Decrement the clock time by 1
   * clockTime value is in seconds
   */
  decrementClock() {
    this.clockTime -= 1;
    //console.log("Countdown: " + this.formatTime(this.clockTime));
  }

  /**
   *
   * @param {*} seconds
   * @returns
   */
  formatTime(seconds) {
    //console.log(seconds);
    // Minutes
    var minutes = Math.floor(seconds / 60);
    // Seconds
    var partInSeconds = seconds % 60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2, "0");
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
  }

  /**
   *
   * @returns
   */
  getSeconds() {
    let elapsedTime = this.gameClock.getElapsedSeconds();
    let minutes = Math.floor(elapsedTime / 60);
    return Math.floor(elapsedTime - minutes * 60);
  }

  /**
   *
   * @param {*} width
   */
  addBackground(width) {
    this.bg = this.add
      .tileSprite(0, 0, 10000, 10000, "level-one-background")
      .setOrigin(0);

    this.resizeBackground(width);
  }

  /**
   *  Listens for keyboard input "up", "down", "left", "right", "space".
   *    "up" - moves the player ship up
   *    "down" - moves the player ship down
   *    "right" - moves the player ship right
   *    "left" - moves the player ship left
   *    "space" - fire a player bullet
   * @param {number} time amount time that has elaspsed in the game in ms
   */
  playerInputHandler(time) {
    //  horizontal movement
    if (this.cursors.left.isDown) {
      this.player.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.player.moveRight();
    } else {
      this.player.stopMovingHorizontally();
    }

    // vertical movement
    if (this.cursors.up.isDown) {
      this.player.moveUp();
    } else if (this.cursors.down.isDown) {
      this.player.moveDown();
    } else {
      this.player.stopMovingVertically();
    }

    // bullet firing
    if (this.cursors.space.isDown) {
      this.player.fireBullet(time, this.bullets);
    }

    if (this.keyP.isDown) {
      if (!this.isPaused) {
        this.gameClock.paused = true;
        this.pauseMenu.show(this);
        this.isPaused = true;
      } else {
        this.gameClock.paused = false;
        this.pauseMenu.hide(this);
        this.isPaused = false;
      }
    }
  }

  /**
   * Hides loader
   * changes opacity to 0 for fade effect
   * changes display to none after 300ms - we wait for fade out to finish
   */
  hideLoader() {
    document.querySelector("#game-loader").style.opacity = 0; // fade out loader

    // give the loader element enough time to transition to 0 opacity (300ms)
    // then hide element
    setTimeout(() => {
      document.querySelector("#game-loader").style.display = "none";
    }, 300);
  }

  /**
   * Creates bullets that will be shown player
   * presses the fire button
   * There can only be a max of 30 bullets on screen at same time
   */
  createBullets() {
    // list of bullets - max 30
    this.bullets = this.add.group({
      classType: Bullet, // sprite obj
      maxSize: PLAYER_MAX_BULLETS, // 30
      runChildUpdate: true,
    });
  }

  /**
   * Creates asteroid sprites for game
   *    - Creates small asteroid - 10 max
   */
  createAsteroids() {
    // list of small asteroids - max 10
    this.asteroids_SM_1 = this.add.group({
      classType: Asteroid, // asteroid sprite
      maxSize: SM_ASTEROID_MAX, // 10
      runChildUpdate: true, // runs the asteroid update function on every frame
      createCallback: function (obj) {
        obj.setTexture(SM_ASTEROID_SPRITE); // set texture to small asteroid
        obj.setBodySize(SM_ASTEROID_W, SM_ASTEROID_H); // update body width + height
        obj.health = SM_ASTEROID_HEALTH; // set asteroid health to 3
      },
    });
  }

  /**
   * Creates explosion sprites for game
   * There are explosions when player hits asteroid
   * There are explosions when asteroid hits player
   */
  createExplosions() {
    // list of explosions - when player hits asteroid
    this.asteroidHitExplosions = this.add.group({
      classType: Explosion, // sprite obj
      maxSize: MAX_EXPLOSION, // 30
    });

    // list of explosions - when asteroid hits player
    this.playerHitExplosions = this.add.group({
      classType: Explosion, // sprite obj
      maxSize: MAX_EXPLOSION, // 30
      createCallback: function (obj) {
        obj.setScale(1.5);
      },
    });
  }

  /**
   * Adds the players ship to the scene
   */
  addPlayer() {
    /**
     * GET VIEWPORT DIMENSIONS
     */
    const width = window.innerWidth;
    const height = window.innerHeight;

    // add player
    this.player = new Player(this, width / 2, height - 260, this.profile.ship);

    /**
     * set  custom boundary in rectangle ship
     * this prevents the player from accessing the the top 125px and bottom 200px of screen
     * both of these sections contain the HUD score, level and ship integrity
     */
    this.player.body.setBoundsRectangle(
      new Phaser.Geom.Rectangle(
        145,
        145,
        width - HORIZONTAL_BOUNDARY_OFFSET,
        height - VERTICAL_BOUNDARY_OFFSET
      )
    );

    this.player.setScale(0.7); // scales sprite down to fit game

    this.player.setDepth(1);
  }

  /**
   *
   */
  createCollisionHandlers() {
    /**
     * CREATE collision event between a bullet and asteroid
     * Whenever a bullet hits an asteroid:
     *  1. show an explosion and play explosion animation (if we can!)
     *  2. remove bullet from game
     */
    this.physics.add.collider(
      this.bullets,
      this.asteroids_SM_1,
      (bullet, asteroid) => {
        const explosion = this.asteroidHitExplosions.get();

        // show explosion and then for 350ms to remove explosion
        if (explosion) {
          explosion.show(bullet.x, bullet.y);
        }

        bullet.hide();
        asteroid.collisionHandler();
      }
    );

    this.physics.add.collider(
      this.player,
      this.asteroids_SM_1,
      (player, asteroid) => {
        const explosion = this.playerHitExplosions.get();

        // show explosion and then for 350ms to remove explosion
        if (explosion) {
          explosion.show(asteroid.x, asteroid.y + asteroid.width / 2);
        }

        asteroid.hide();
        player.updateHealthBar(asteroid.health * 500);
        // update player health bar
        this.player.hp.draw();

        if (player.hp.currentHealth === 0) {
          this.gameOverHandler();
        }
      }
    );
  }

  /**
   *
   */
  gameOverHandler() {
    this.winnerMenu.show(this);
    this.isPaused = false;
    this.isReady = false;
    this.gameClock.paused = true;
    this.player.setVelocity(0);
  }

  resetGame() {
    console.log("reset");
    /**
     * GET VIEWPORT DIMENSIONS
     */
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.isPaused = false;
    this.isReady = false;

    this.player.setPosition(width / 2, height - 260);

    this.clockTime = LEVEL_ONE_TIME;

    this.player.hp.currentHealth = PLAYER_HEALTH;

    this.player.hp.draw();

    this.startMenu.show(this);
  }

  /**
   * ADDS score, level, ship health and instructions to screen
   * @param {number} height  screen height
   */
  addHUD(height, width) {
    // Loaing in google font
    // once loaded, add the text for the Integrity
    WebFont.load({
      google: {
        families: ["Rationale"],
      },
    });

    // styles for the score and level values
    const styles = { fontFamily: "Rationale", fontSize: 23, color: "#fff" };

    this.hp = this.add.text(
      30,
      window.innerHeight - 50,
      `${this.player.health}: `,
      {
        fontFamily: "Rationale",
        fontSize: 23,
        color: "#fff",
      }
    );

    // add score label
    this.add.text(30, 75, "Score: ", styles);
    // add level label
    this.add.text(30, 105, "Level: ", styles);

    // add profile name
    this.profileHUD = this.add.text(0, 0, `${this.profile.name}`, styles);
    this.profileHUD.setPosition(width - 40 - this.profileHUD.width, 75);

    this.timeHUD = this.add.text(0, 0, `Time Left: ${this.clockTime}`, styles);
    this.timeHUD.setPosition(width - 40 - this.timeHUD.width, 105);

    // add the text for score, level value
    this.scoreText = this.add.text(90, 75, "0", styles);
    this.levelText = this.add.text(90, 105, "1", styles);

    // ADD instructions to bottom left of screen
    this.instructionsSm = this.add.image(
      width - 185,
      height - 60,
      "instructions-sm"
    );
  }

  /**
   *
   * @param {*} width
   * @param {*} height
   */
  showOverlay(width, height, alpha) {
    // sets fill color to black
    this.gameSceneGraphics.fillStyle(0x000000, alpha);
    // adds a black transparent layer
    this.overlay = this.gameSceneGraphics.fillRect(0, 0, width, height);
    this.overlay.setDepth(2).setVisible(true);
  }

  /**
   * CREATE the animations for the game objects
   * Some will be started by default others will start on show()
   */
  createAnimations() {}

  /**
   *
   * @param {*} time
   * @param {*} delta
   */
  asteroidSpawnHandler(time) {
    if (time > this.asteroidSpawnDelay) {
      // get avaiable asteroid in list -
      // Is undefined if there arent any
      const asteroid = this.asteroids_SM_1.get();

      if (asteroid) {
        const width = window.innerWidth;
        const x = Phaser.Math.Between(
          HORIZONTAL_BOUNDARY_OFFSET,
          width - HORIZONTAL_BOUNDARY_OFFSET
        );
        asteroid.spawn(x);
        this.asteroidSpawnDelay = time + SM_ASTEROID_SPAWN_DELAY;
      }
    }
  }

  /**
   * Handles resizing the game when the viewport size changes
   */
  resize() {
    this.gameSceneGraphics.clear();

    var width = window.innerWidth;
    var height = window.innerHeight;

    //
    this.cameras.resize(width, height);

    //
    this.resizeBackground(width);

    //
    this.player.body.setBoundsRectangle(
      new Phaser.Geom.Rectangle(145, 145, width - 290, height - 260)
    );

    this.gameSceneGraphics
      .lineStyle(2, 0x00ffff, 2)
      .strokeRectShape(this.player.body.customBoundsRectangle)
      .setDepth(3);

    // adds instructions to bottom of screen
    this.instructionsSm.setPosition(width - 185, height - 60);

    //
    this.profileHUD.setPosition(width - 40 - this.profileHUD.width, 75);
    //
    this.timeHUD.setPosition(width - 40 - this.timeHUD.width, 105);

    if (!this.isReady) {
      this.showOverlay(width, height, 0.85);

      this.startMenu.startBtn.setPosition(
        width / 2,
        this.startMenu.startMessageBox.y +
          this.startMenu.startMessageBox.height +
          30
      );
      this.startMenu.startMessageBox.setPosition(
        width / 2 - 125,
        height * 0.45
      );
    }
  }

  /**
   *
   * @param {*} width
   */
  resizeBackground(width) {
    if (width > 1400) {
      this.bg.setScale(1.8);
    } else if (width > 1068) {
      this.bg.setScale(1.3);
    } else {
      this.bg.setScale(1);
    }
  }

  quitGame() {
    // this.player.hp.destroy();
    this.scene.start("StartScene");
  }
}
