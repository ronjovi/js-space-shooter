/**
 * Scene that has the content and logic for the game scene
 * This is where the user gets to control their ship and shoot enemies
 */
class StartScene extends Phaser.Scene {
  constructor() {
    super({
      key: "StartScene",
    });

    /**
     * Sets placeholder data in case there is none in storage
     *  name - string name of player
     *  bio - string bio of player
     *  highestScore - number the players current high score during session
     *  ship - string texture of ship chosen by player
     */
    this.profile = PLAYER_PLACEHOLDER;
  }

  preload() {
    this.loadFromStorage();

    // load space background
    this.load.image("space", "../../images/backgrounds/profile_background.png");

    this.load.spritesheet("embark", "../../images/gui/embark.png", {
      frameWidth: 213,
      frameHeight: 40.19,
    });

    this.load.spritesheet("go-back", "../../images/gui/go-back.png", {
      frameWidth: 213,
      frameHeight: 40.19,
    });

    // load ship A
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

    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );
  }

  create() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // add space background to game
    this.bg = this.add.tileSprite(0, 0, 10000, 10000, "space").setOrigin(0);

    // creates keys listener for playeer action/movement
    this.cursors = this.input.keyboard.createCursorKeys();

    // set the resize listener and callback
    this.scale.on("resize", this.resize, this);

    // get graphics for create method
    this.gameSceneGraphics = this.add.graphics();

    // Loaing in google font
    // once loaded, add the text for the Integrity
    WebFont.load({
      google: {
        families: ["Rationale"],
      },
    });

    /**
     * Display menu
     * Start Link - starts the game
     * Instructions Link - shows instructions
     */
    this.addProfile();
    this.addLogo(width, height);
    this.addStart(width, height);
    this.addInstructions(width, height);

    this.hideLoader();
  }

  /**
   * Loads
   */
  loadFromStorage() {
    if (localStorage.profile) {
      this.profile = JSON.parse(localStorage.profile);
    }
  }

  /**
   * Adds logo to the scene
   * @param {*} width
   * @param {*} height
   */
  addLogo(width, height) {
    //styles
    const styles = {
      fontFamily: "Rationale",
      fontSize: 55,
      color: "#F94A41",
    };

    // add logo
    this.logo = this.add
      .text(0, 0, "Space Odyssey", styles)
      .setInteractive({ useHandCursor: true });

    // update pos
    this.logo.setPosition(width / 2 - this.logo.width / 2, height * 0.25);
  }

  /**
   * Adds start link to menu
   * @param {*} width
   * @param {*} height
   */
  addStart(width, height) {
    // styles
    const styles = {
      fontFamily: "Rationale",
      fontSize: 26,
      color: "#F9F0D9",
    };
    // add start link
    this.start = this.add
      .text(0, 0, "NEW GAME", styles)
      .setInteractive({ useHandCursor: true });
    // update pos
    this.start.setPosition(width / 2 - this.start.width / 2, height * 0.35);

    /**
     * shows loader and navigates to game scene
     */
    this.start.on("pointerdown", () => {
      this.hideMenu();
      this.showProfile();
    });

    /**
     * changes start color to red on hover
     */
    this.start.on("pointerover", () => {
      const styles = { fontFamily: "Rationale", fontSize: 26, color: "F94A41" }; // start styles
      this.start.setStyle(styles);
    });

    /**
     * changes start color to white on no hover
     */
    this.start.on("pointerout", () => {
      const styles = {
        fontFamily: "Rationale",
        fontSize: 26,
        color: "#F9F0D9",
      }; // start styles
      this.start.setStyle(styles);
    });
  }

  /**
   * Adds instructions link to menu
   * @param {*} width
   * @param {*} height
   */
  addInstructions(width, height) {
    // styles
    const styles = {
      fontFamily: "Rationale",
      fontSize: 26,
      color: "#F9F0D9",
    };
    // add instructions link
    this.instructions = this.add
      .text(0, 0, "INSTRUCTIONS", styles)
      .setInteractive({ useHandCursor: true });
    // update pos
    this.instructions.setPosition(
      width / 2 - this.instructions.width / 2,
      height * 0.4
    );

    /**
     * changes instructions color to red on hover
     */
    this.instructions.on("pointerover", (pointer) => {
      const styles = {
        fontFamily: "Rationale",
        fontSize: 26,
        color: "#F94A41",
      }; // start styles
      this.instructions.setStyle(styles);
    });

    /**
     * changes instructions color to white on no hover
     */
    this.instructions.on("pointerout", (pointer) => {
      const styles = {
        fontFamily: "Rationale",
        fontSize: 26,
        color: "#F9F0D9",
      }; // start styles
      this.instructions.setStyle(styles);
    });
  }
  /**
   * Hides loader
   * changes opacity to 0 for fade effect
   * changes display to none after 300ms - we wait for fade out to finish
   */
  hideLoader() {
    $("#game-loader").animate({ opacity: 0 }, 300, function () {
      setTimeout(() => {
        $(this).css({ display: "none" });
      }, 300);
    });
  }

  addProfile() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.gameSceneGraphics.lineStyle(2, 0xf9f0d9, 1);
    this.profileContainer = this.gameSceneGraphics.strokeRoundedRect(
      width / 2 - 150,
      height / 2 - 150,
      300,
      400,
      10
    );

    // styles for score text
    const styles = {
      fontFamily: "Rationale",
      fontSize: 26,
      color: "#F9F0D9",
      wordWrap: { width: 250, useAdvancedWrap: true },
    };

    // styles for score label
    const labelStyles = {
      fontFamily: "Rationale",
      fontSize: 21,
      color: "#F94A41",
    };

    // add score label to scene
    this.nameLabel = this.add
      .text(0, 0, "NAME:", labelStyles)
      .setPosition(width / 2 - 138, height * 0.37);

    // add score text to scene
    this.name = this.add
      .text(0, 0, this.profile.name.substring(0, 25), styles)
      .setPosition(width / 2 - 120, height * 0.4);

    //
    this.phraseLabel = this.add
      .text(0, 0, "CATCH PHRASE:", labelStyles)
      .setPosition(width / 2 - 138, height * 0.45);

    //
    this.phrase = this.add
      .text(0, 0, this.profile.phrase.substring(0, 50), styles)
      .setPosition(width / 2 - 120, height * 0.48);

    //
    this.scoreLabel = this.add
      .text(0, 0, "HIGHEST SCORE:", labelStyles)
      .setPosition(width / 2 - 138, height * 0.55);

    //
    this.score = this.add
      .text(0, 0, this.profile.score, styles)
      .setPosition(width / 2 - 120, height * 0.58);

    //
    this.shipLabel = this.add
      .text(0, 0, "SHIP:", labelStyles)
      .setPosition(width / 2 - 138, height * 0.62);

    this.addPlayerShip(width, height);

    this.addEmbarkBtn(width, height);
    this.addBackBtn(width, height);

    this.hideProfile();
  }

  addEmbarkBtn(width, height) {
    // adds edit button to the scene
    this.embarkBtn = this.add
      .sprite(width / 2 + 140, height * 0.8, "embark")
      .setInteractive({ useHandCursor: true })
      .setScale(0.9);

    /**
     * adds on click event handler to the ship swap button
     * opens modal where user can select their ship
     */
    this.embarkBtn.on("pointerdown", () => {
      $("#game-loader").css({ opacity: 1, display: "flex" });
      this.scene.start("GameScene");
    });

    /**
     * Adds hover event handler to button
     * Changes color to red on hover
     */
    this.embarkBtn.on("pointerover", (pointer) => {
      this.embarkBtn.setFrame(1);
    });

    /**
     * Adds no hover event handler to button
     * Changes color to white on no hover
     */
    this.embarkBtn.on("pointerout", (pointer) => {
      this.embarkBtn.setFrame(0);
    });
  }

  addBackBtn(width, height) {
    // adds edit button to the scene
    this.backBtn = this.add
      .sprite(width / 2 - 140, height * 0.8, "go-back")
      .setInteractive({ useHandCursor: true })
      .setScale(0.9);

    /**
     * adds on click event handler to the ship swap button
     * opens modal where user can select their ship
     */
    this.backBtn.on("pointerdown", () => {
      this.hideProfile();
      this.showMenu();
    });

    /**
     * Adds hover event handler to button
     * Changes color to red on hover
     */
    this.backBtn.on("pointerover", (pointer) => {
      this.backBtn.setFrame(1);
    });

    /**
     * Adds no hover event handler to button
     * Changes color to white on no hover
     */
    this.backBtn.on("pointerout", (pointer) => {
      this.backBtn.setFrame(0);
    });
  }

  addPlayerShip() {
    // get viewport dimension
    const width = window.innerWidth;
    const height = window.innerHeight;

    /**
     * Adds the player's ship to the scene
     */
    if (this.profile.ship === "player-ship-a") {
      // add ship a
      this.player = new PlayerShipA(this, width / 2, height * 0.7).setScale(
        0.5
      );
    } else if (this.profile.ship === "player-ship-b") {
      // add ship b
      this.player = new PlayerShipB(this, width / 2, height * 0.7).setScale(
        0.5
      );
    } else if (this.profile.ship === "player-ship-c") {
      // add ship c
      this.player = new PlayerShipC(this, width / 2, height * 0.7).setScale(
        0.5
      );
    }
  }

  showMenu() {
    this.start.setVisible(true);
    this.start.setActive(true);

    this.instructions.setVisible(true);
    this.instructions.setActive(true);
  }

  hideMenu() {
    this.start.setVisible(false);
    this.start.setActive(false);

    this.instructions.setVisible(false);
    this.instructions.setActive(false);
  }

  showProfile() {
    this.nameLabel.setVisible(true);
    this.nameLabel.setActive(true);

    this.name.setVisible(true);
    this.name.setActive(true);

    this.phraseLabel.setVisible(true);
    this.phraseLabel.setActive(true);

    this.phrase.setVisible(true);
    this.phrase.setActive(true);

    this.scoreLabel.setVisible(true);
    this.scoreLabel.setActive(true);

    this.score.setVisible(true);
    this.score.setActive(true);

    this.shipLabel.setVisible(true);
    this.shipLabel.setActive(true);

    this.player.setVisible(true);
    this.player.setActive(true);

    this.embarkBtn.setVisible(true);
    this.embarkBtn.setActive(true);

    this.backBtn.setVisible(true);
    this.backBtn.setActive(true);

    this.profileContainer.setVisible(true);
    this.profileContainer.setActive(true);
  }

  hideProfile() {
    this.nameLabel.setVisible(false);
    this.nameLabel.setActive(false);

    this.name.setVisible(false);
    this.name.setActive(false);

    this.phraseLabel.setVisible(false);
    this.phraseLabel.setActive(false);

    this.phrase.setVisible(false);
    this.phrase.setActive(false);

    this.scoreLabel.setVisible(false);
    this.scoreLabel.setActive(false);

    this.score.setVisible(false);
    this.score.setActive(false);

    this.shipLabel.setVisible(false);
    this.shipLabel.setActive(false);

    this.player.setVisible(false);
    this.player.setActive(false);

    this.embarkBtn.setVisible(false);
    this.embarkBtn.setActive(false);

    this.backBtn.setVisible(false);
    this.backBtn.setActive(false);

    this.profileContainer.setVisible(false);
    this.profileContainer.setActive(false);
  }

  /**
   * Handles resizing the game when the viewport size changes
   */
  resize() {
    var width = window.innerWidth; // get viewport width
    var height = window.innerHeight; // get viewport height

    // resizes game and background
    this.cameras.resize(width, height);
    this.bg.setSize(width, height);

    this.logo.setPosition(width / 2 - this.logo.width / 2, height * 0.3); // centers logo
    this.start.setPosition(width / 2 - this.start.width / 2, height * 0.4); // centers start
    this.instructions.setPosition(
      width / 2 - this.instructions.width / 2,
      height * 0.45
    ); // centers instructions
  }
}
