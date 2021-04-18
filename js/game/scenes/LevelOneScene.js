/**
 * Scene that has the content and logic for the game scene
 * This is where the user gets to control their ship and shoot enemies
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
    this.levelTimer = 5;
    this.currentTime = 120;
  }

  /**
   * Loads Profile from storage
   */
  loadProfile() {
    this.startMessageText = `1st Mission:\n\nGet past the asteroid field!`;
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

    // loads small asteroid sprite
    this.load.spritesheet(
      "asteroid",
      "https://temp-assets-t.s3-us-west-1.amazonaws.com/asteroid_1.png",
      { frameWidth: 100, frameHeight: 88 }
    );

    // loads explosion sprite
    this.load.spritesheet(
      "explosion",
      "https://temp-assets-t.s3-us-west-1.amazonaws.com/explosion.png",
      { frameWidth: 80, frameHeight: 80 }
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

    // get graphics for create method
    this.gameSceneGraphics = this.add.graphics();

    // creates keys listener for playeer action/movement
    this.cursors = this.input.keyboard.createCursorKeys();

    this.gameClock = this.time.addEvent({
      delay: 1000,
      callback: this.onClockEvent,
      callbackScope: this,
      loop: true,
    });
    this.gameClock.paused = true;

    // ADD space background to game
    this.addBackground(width);

    this.addOverlay(width, height);
    this.createGameObjects(); // creates all game objects for this level
    this.createCollisionHandlers(); // creates collision events for game objects
    this.addHUD(height, width); // adds HUD to game
    this.addStartOverlay(width, height);

    // //
    // this.addActionButtons
    this.hideLoader(); // hide the spinner

    // set the resize listener and callback
    this.scale.on("resize", this.resize, this);
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

    if (!this.isPaused && this.isReady) {
      // const seconds = this.getSeconds();
      // this.currentTime = this.gameLength - seconds;
      // scroll the background down
      this.bg.tilePositionY -= 2.5;
      // // check for player input
      this.playerInputHandler(time);
      // // handles spawns of asteroids
      // this.asteroidSpawnHandler(time, delta);
      // // listen for any pauses
      this.pauseHandler();
    }
  }

  
  onClockEvent(){
    this.currentTime -= 1;
    console.log('Countdown: ' + this.formatTime(this.currentTime))
  }

  formatTime(seconds){
    console.log(seconds)
    // Minutes
    var minutes = Math.floor(seconds/60);
    // Seconds
    var partInSeconds = seconds%60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2,'0');
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
}

  getSeconds() {
    let elapsedTime = this.gameClock.getElapsedSeconds();
    let minutes = Math.floor(elapsedTime / 60);
    return Math.floor(elapsedTime - minutes * 60);
  }

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
   *
   */
  createGameObjects() {
    // CREATE bullet object []
    this.bullets = this.add.group({
      classType: Bullet, // type of sprite
      maxSize: PLAYER_MAX_BULLETS, // max on screen
      runChildUpdate: true,
    });

    // CREATE asteroid object []
    this.asteroids_SM = this.add.group({
      classType: AsteroidSM, // type of sprite
      maxSize: MAX_SM_ASTEROID, // max on screen
      // runChildUpdate: true
    });

    // CREATE explosions object []
    this.explosions = this.add.group({
      classType: Explosion, // type of sprite
      maxSize: MAX_EXPLOSION, // max on screen
      // runChildUpdate: true
    });

    this.addPlayerShip();
  }

  /**
   * Adds the players ship to the scene
   */
  addPlayerShip() {
    /**
     * GET VIEWPORT DIMENSIONS
     */
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.profile.ship === "player-ship-a") {
      // add ship a
      this.player = new PlayerShipA(this, width / 2, height - 260);
    } else if (this.profile.ship === "player-ship-b") {
      // add ship b
      this.player = new PlayerShipB(this, width / 2, height - 260);
    } else if (this.profile.ship === "player-ship-c") {
      // add ship c
      this.player = new PlayerShipC(this, width / 2, height - 260);
    }

    /**
     * set  custom boundary in rectangle ship
     * this prevents the player from accessing the the top 125px and bottom 200px of screen
     * both of these sections contain the HUD score, level and ship integrity
     */
    this.player.body.setBoundsRectangle(
      new Phaser.Geom.Rectangle(145, 145, width - 290, height - 260)
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
      this.asteroids_SM,
      (bullet, asteroid) => {
        var explosion = this.explosions.get();

        if (explosion) {
          explosion.show(bullet.x, bullet.y);

          explosion.play("explosion_anim");

          setTimeout(() => {
            explosion.kill();
          }, 350);
        }

        bullet.kill(); // get rid of bullet

        // detect health of asteroid
        if (asteroid.health === 3) {
          asteroid.health -= 1;
          asteroid.setFrame(1);
          this.score += 50;
        } else if (asteroid.health === 2) {
          asteroid.health -= 1;
          asteroid.setFrame(2);
          this.score += 50;
        } else {
          this.score += 50;
          asteroid.kill(); // no more health destroy
        }
      }
    );
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
      active: () => {
        this.add.text(30, window.innerHeight - 50, `${this.player.health}: `, {
          fontFamily: "Rationale",
          fontSize: 23,
          color: "#fff",
        });
      },
    });

    // styles for the score and level values
    const styles = { fontFamily: "Rationale", fontSize: 23, color: "#fff" };

    // add score label
    this.add.text(30, 75, "Score: ", styles);
    // add level label
    this.add.text(30, 105, "Level: ", styles);

    // add profile name
    this.profileHUD = this.add.text(0, 0, `${this.profile.name}`, styles);
    this.profileHUD.setPosition(width - 40 - this.profileHUD.width, 75);

    // add the text for score, level value
    this.scoreText = this.add.text(90, 75, "0", styles);
    this.levelText = this.add.text(90, 105, "1", styles);

    // add ship health
    this.hp = new HealthBar(
      this,
      120,
      height - 47,
      this.player.health,
      200,
      20
    );

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
  addStartOverlay(width, height) {
    // Create game mission description
    this.startMessageBox = this.createTextBox(
      this,
      width / 2 - 125,
      height * 0.45,
      {
        wrapWidth: 250,
      }
    ).start(this.startMessageText, 50);

    //
    this.addStartBtn(width, height);
  }

  /**
   *
   * @param {*} width
   * @param {*} height
   */
  addOverlay(width, height) {
    console.log("add");
    // adds a black transparent layer
    this.gameSceneGraphics.fillStyle(0x000000, 0.5);

    this.overlay = this.gameSceneGraphics.fillRect(0, 0, width, height);
    this.overlay.setDepth(2).setVisible(true);
  }

  /**
   *
   * @param {*} width
   * @param {*} height
   */
  addStartBtn(width, height) {
    //
    this.startBtn = this.add
      .sprite(width / 2, height * 0.61, "start-btn")
      .setInteractive({ useHandCursor: true })
      .setScale(1)
      .setDepth(3);

    /**

     */
    this.startBtn.on("pointerdown", () => {
      this.gameSceneGraphics.clear();
      this.startMessageBox.setVisible(false);
      this.startBtn.setVisible(false);
      this.isReady = true;

      // DEBUG
      this.gameSceneGraphics
        .lineStyle(2, 0x00ffff, 2)
        .strokeRectShape(this.player.body.customBoundsRectangle)
        .setDepth(2);

      this.gameClock.paused = false;
    });

    /**

     */
    this.startBtn.on("pointerover", (pointer) => {
      this.startBtn.setFrame(1);
    });

    /**

     */
    this.startBtn.on("pointerout", (pointer) => {
      this.startBtn.setFrame(0);
    });
  }

  /**
   * CREATE the animations for the game objects
   * Some will be started by default others will start on show()
   */
  createAnimations() {
    /**
     * CREATE animation for explosion sprite
     * Animation plays once show() is called on explosion
     */
    this.anims.create({
      key: "explosion_anim",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  /**
   *
   * @param {*} time
   * @param {*} delta
   */
  asteroidSpawnHandler(time, delta) {
    const width = window.innerWidth;
    var lowerBorder = width * 0.15;
    var highBorder = width - lowerBorder;
    var x = Math.floor(Math.random() * highBorder + lowerBorder);

    const num = this.asteroids_SM.children.entries.length;
    if ((num < this.MAX_ASTEROIDS) & (time > this.ASTEROID_DELAY)) {
      var check = this.asteroids_SM.getFirstDead();
      if (check) {
        check.show(x);
      } else {
        var asteroid = this.asteroids_SM.get();
        asteroid.show(x);
      }
      this.ASTEROID_DELAY = time + 500;
    }
  }

  /**
   *
   */
  pauseHandler() {
    this.input.keyboard.on("keydown-P", (event) => {
      if (!this.isPaused) {
        this.gameClock.paused = true;
        this.addPauseMenu();
        this.isPaused = true;
      } else {
      }
    });
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

    if (!this.isReady) {
      //
      this.addOverlay(width, height);

      this.startBtn.setPosition(width / 2, height * 0.61);
      this.startMessageBox.setPosition(width / 2 - 125, height * 0.45);
    }
  }

  resizeBackground(width) {
    if (width > 1400) {
      this.bg.setScale(1.8);
    } else if (width > 1068) {
      this.bg.setScale(1.3);
    } else {
      this.bg.setScale(1);
    }
  }

  /**
   * Display menu
   * adds hover event listener to change color of link
   * adds click event listener to:
   *    1. Show loader and navigate to game scene
   *    2. Show instructions image
   */
  addPauseMenu() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    /**
     * Adds logo
     * shows hand cursor on hover
     * centers logo
     */
    const logoStyles = {
      fontFamily: "Rationale",
      fontSize: 43,
      color: COLOR_RED,
    };
    this.logo = this.add
      .text(0, 0, "Space Odyssey", logoStyles)
      .setInteractive({ useHandCursor: true });
    this.logo.setPosition(width / 2 - this.logo.width / 2, height * 0.3);

    /**
     * Adds start link
     * shows hand cursor on hover
     * centers logo
     */
    const startStyles = {
      fontFamily: "Rationale",
      fontSize: 26,
      color: COLOR_WHITE,
    };
    this.start = this.add
      .text(0, 0, "RESUME GAME", startStyles)
      .setInteractive({ useHandCursor: true });
    this.start.setPosition(width / 2 - this.start.width / 2, height * 0.4);

    /**
     * Adds instructions link
     * shows hand cursor on hover
     * centers logo
     */
    const instructionsStyles = {
      fontFamily: "Rationale",
      fontSize: 26,
      color: COLOR_WHITE,
    };
    this.instructions = this.add
      .text(0, 0, "INSTRUCTIONS", instructionsStyles)
      .setInteractive({ useHandCursor: true });
    this.instructions.setPosition(
      width / 2 - this.instructions.width / 2,
      height * 0.45
    );

    /**
     * Adds quit link
     * shows hand cursor on hover
     * centers logo
     */
    const quitStyles = {
      fontFamily: "Rationale",
      fontSize: 26,
      color: COLOR_WHITE,
    };
    this.quit = this.add
      .text(0, 0, "QUIT", quitStyles)
      .setInteractive({ useHandCursor: true });
    this.quit.setPosition(width / 2 - this.quit.width / 2, height * 0.5);

    /**
     * shows loader and navigates to game scene
     */
    this.start.on("pointerdown", (pointer) => {
      this.start.visible = false;
      this.logo.visible = false;
      this.instructions.visible = false;
      this.quit.visible = false;
      this.gameSceneGraphics.clear();
      this.isPaused = false;
    });

    /**
     * shows loader and navigates to game scene
     */
    this.quit.on("pointerdown", (pointer) => {
      document.querySelector("#game-loader").style.opacity = 1;
      document.querySelector("#game-loader").style.display = "flex";
      this.isPaused = false;
      this.score = 0;
      this.level = 1;
      this.integrity = 1;
      this.scene.start("StartScene");
    });

    /**
     * changes start color to red on hover
     */
    this.start.on("pointerover", (pointer) => {
      const styles = { fontFamily: "Rationale", fontSize: 26, color: red }; // start styles
      this.start.setStyle(styles);
    });

    /**
     * changes start color to white on no hover
     */
    this.start.on("pointerout", (pointer) => {
      const styles = { fontFamily: "Rationale", fontSize: 26, color: white }; // start styles
      this.start.setStyle(styles);
    });

    /**
     * changes instructions color to red on hover
     */
    this.instructions.on("pointerover", (pointer) => {
      const styles = { fontFamily: "Rationale", fontSize: 26, color: red }; // start styles
      this.instructions.setStyle(styles);
    });

    /**
     * changes instructions color to white on no hover
     */
    this.instructions.on("pointerout", (pointer) => {
      const styles = { fontFamily: "Rationale", fontSize: 26, color: white }; // start styles
      this.instructions.setStyle(styles);
    });

    /**
     * changes instructions color to red on hover
     */
    this.quit.on("pointerover", (pointer) => {
      const styles = { fontFamily: "Rationale", fontSize: 26, color: red }; // start styles
      this.quit.setStyle(styles);
    });

    /**
     * changes instructions color to white on no hover
     */
    this.quit.on("pointerout", (pointer) => {
      const styles = { fontFamily: "Rationale", fontSize: 26, color: white }; // start styles
      this.quit.setStyle(styles);
    });
  }

  /**
   *
   * @param {*} scene
   * @param {*} x
   * @param {*} y
   * @param {*} config
   * @returns
   */
  createTextBox(scene, x, y, config) {
    const wrapWidth = 240;
    const fixedWidth = 250;
    const fixedHeight = 75;

    let textBox = scene.rexUI.add
      .textBox({
        x: x,
        y: y,
        background: scene.rexUI.add
          .roundRectangle(0, 0, 2, 2, 8, "0x201F35")
          .setStrokeStyle(2, "0xF9F0D9"),
        text: this.getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),
        space: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
          icon: 10,
          text: 10,
        },
      })
      .setOrigin(0)
      .layout()
      .setDepth(3);

    return textBox;
  }

  /**
   *
   * @param {*} scene
   * @param {*} wrapWidth
   * @param {*} fixedWidth
   * @param {*} fixedHeight
   * @returns
   */
  getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, "", {
      fixedWidth: fixedWidth,
      fixedHeight: fixedHeight,
      fontFamily: "Rationale",
      fontSize: "24px",
      wrap: {
        mode: "word",
        width: wrapWidth,
      },
      maxLines: 3,
    });
  }
}
