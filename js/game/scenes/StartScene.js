const LOGO_OFFSET = 150;

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
    //this.addProfile();
    this.profileCard = new ProfileCard(this);
    this.addEmbarkBtn();
    this.addBackBtn();
    this.addLogo(width);
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
  addLogo(width) {
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
    this.logo.setPosition(width / 2 - this.logo.width / 2, LOGO_OFFSET);
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
      this.profileCard.show(this);
      this.showBtns(width, height);
    });

    /**
     * changes start color to red on hover
     */
    this.start.on("pointerover", () => {
      const styles = {
        fontFamily: "Rationale",
        fontSize: 26,
        color: "#F94A41",
      }; // start styles
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

  showBtns(width) {

    this.embarkBtn
      .setPosition(width / 2 + this.embarkBtn.width / 1.5, 575)
      .setActive(true)
      .setVisible(true)
      .setInteractive({ useHandCursor: true });

    this.backBtn
      .setPosition(width / 2 - this.backBtn.width / 1.5, 575)
      .setVisible(true)
      .setActive(true)
      .setInteractive({ useHandCursor: true });
  }

  hideBtns() {
    this.embarkBtn
      .setPosition(0, 0)
      .setActive(false)
      .setVisible(false)
      .setInteractive(false);

    this.backBtn
      .setPosition(0, 0)
      .setVisible(false)
      .setActive(false)
      .setInteractive(false);
  }

  /**
   *
   * @param {*} width
   * @param {*} height
   */
  addEmbarkBtn() {
    // adds edit button to the scene
    this.embarkBtn = this.add
      .sprite(0, 0, "embark")
      .setActive(false)
      .setVisible(false);

    /**
     * adds on click event handler to the ship swap button
     * opens modal where user can select their ship
     */
    this.embarkBtn.on("pointerdown", () => {
      $("#game-loader").css({ opacity: 1, display: "flex" });
      this.scene.start("LevelOneScene");
      console.log("embark");
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

  /**
   *
   * @param {*} width
   * @param {*} height
   */
  addBackBtn() {
    // adds edit button to the scene
    this.backBtn = this.add
      .sprite(0, 0, "go-back")
      .setActive(false)
      .setVisible(false);

    /**
     * adds on click event handler to the ship swap button
     * opens modal where user can select their ship
     */
    this.backBtn.on("pointerdown", () => {
      this.profileCard.hide();
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

  /**
   *
   */
  showMenu() {
    this.logo.setVisible(true);
    this.logo.setActive(true);

    this.start.setVisible(true);
    this.start.setActive(true);

    this.instructions.setVisible(true);
    this.instructions.setActive(true);

    this.hideBtns();
  }

  /**
   *
   */
  hideMenu() {
    this.logo.setVisible(false);
    this.logo.setActive(false);

    this.start.setVisible(false);
    this.start.setActive(false);

    this.instructions.setVisible(false);
    this.instructions.setActive(false);
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

    this.logo.setPosition(width / 2 - this.logo.width / 2, LOGO_OFFSET);
    this.profileCard.resize(this, width);

    this.backBtn.setPosition(width / 2 - this.backBtn.width / 1.5, 575);
    this.embarkBtn.setPosition(width / 2 + this.embarkBtn.width / 1.5, 575);

    // update pos
    this.start.setPosition(width / 2 - this.start.width / 2, height * 0.35);
    // update pos
    this.instructions.setPosition(
      width / 2 - this.instructions.width / 2,
      height * 0.4
    );
  }
}
