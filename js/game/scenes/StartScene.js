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
  }

  /**
   * Load all game assets
   */
  preload() {
    // load local profile
    this.loadFromStorage();

    // loads plugin for the auto text scroller
    this.load.scenePlugin({
      key: "rexuiplugin",
      url:
        "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      sceneKey: "rexUI",
    });

    // load space background
    this.load.image(
      "space",
      "https://temp-assets-t.s3-us-west-1.amazonaws.com/profile_background.png"
    );

    // load embark btn
    this.load.spritesheet(
      "embark",
      "https://temp-assets-t.s3-us-west-1.amazonaws.com/embark.png",
      {
        frameWidth: 213,
        frameHeight: 40.19,
      }
    );

    // load go back btn
    this.load.spritesheet(
      "go-back",
      "https://temp-assets-t.s3-us-west-1.amazonaws.com/go-back.png",
      {
        frameWidth: 213,
        frameHeight: 40.19,
      }
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

    // load google font
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );
  }

  /**
   * Creates all game objects
   */
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

    this.profileCard = new ProfileCard(this, width);
    this.profileCard.hide();
    this.addEmbarkBtn();
    this.addBackBtn();
    this.addLogo(width);
    this.addStart(width, height);
    //this.addInstructions(width, height);

    this.hideLoader();
  }

  /**
   * Loads profile from storage if it exists
   * otherwise sets the default profile data
   */
  loadFromStorage() {
    if (localStorage.profile) {
      this.profile = JSON.parse(localStorage.profile);
    } else {
      /**
       * Sets placeholder data in case there is none in storage
       *  name - string name of player
       *  phrase - string player catch phrase
       *  highestScore - number the players current high score during session
       *  ship - string texture of ship chosen by player
       */
      this.profile = PLAYER_PLACEHOLDER;
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
   * Adds new game link to menu
   * @param {number} width viewport width
   * @param {number} height viewport height
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
    this.start.setPosition(
      width / 2 - this.start.width / 2,
      this.logo.y + this.logo.height + 30
    );

    /**
     *
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
      this.start.y + this.start.height + 16
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
    $("#loader").animate({ opacity: 0 }, 300, function () {
      setTimeout(() => {
        $(this).css({ display: "none" });
      }, 300);
    });
  }

  /**
   * Shows the embark and go back button
   * @param {number} width viewport width
   */
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

  /**
   * Hides the embark and go back button
   */
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
   * @param {number} width viewport width
   * @param {number} height view port height
   */
  addEmbarkBtn() {
    // adds edit button to the scene
    this.embarkBtn = this.add
      .sprite(0, 0, "embark")
      .setActive(false)
      .setVisible(false);

    // listen for button clicks -> starts level one
    this.embarkBtn.on("pointerdown", () => {
      $("#loader").css({ opacity: 1, display: "flex" });
      this.scene.start("LevelOneScene");
    });

    // listen for hover -> changes color to red
    this.embarkBtn.on("pointerover", () => {
      this.embarkBtn.setFrame(1);
    });

    // listen for no hover -> changes color to white
    this.embarkBtn.on("pointerout", () => {
      this.embarkBtn.setFrame(0);
    });
  }

  /**
   * Adds back button to screen. this allows user
   * to go back to previous menu
   * @param {number} width
   * @param {number} height
   */
  addBackBtn() {
    // adds edit button to the scene
    this.backBtn = this.add
      .sprite(0, 0, "go-back")
      .setActive(false)
      .setVisible(false);

    // listen for clicks on button
    this.backBtn.on("pointerdown", () => {
      this.profileCard.hide();
      this.hideBtns();
      this.showMenu();
    });

    // listen for hover -> changes color to red
    this.backBtn.on("pointerover", () => {
      this.backBtn.setFrame(1);
    });

    //listen for no hover -> changes color to white
    this.backBtn.on("pointerout", () => {
      this.backBtn.setFrame(0);
    });
  }

  /**
   * Shows the menu items (logo and game link)
   */
  showMenu() {
    this.logo.setVisible(true);
    this.logo.setActive(true);

    this.start.setVisible(true);
    this.start.setActive(true);

    // this.instructions.setVisible(true);
    // this.instructions.setActive(true);
  }

  /**
   * Hides the menu items (logo and new game link)
   */
  hideMenu() {
    this.logo.setVisible(false);
    this.logo.setActive(false);

    this.start.setVisible(false);
    this.start.setActive(false);

    //this.instructions.setVisible(false);
    //this.instructions.setActive(false);
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

    // re position logo
    this.logo.setPosition(width / 2 - this.logo.width / 2, LOGO_OFFSET);
    // re position start link
    this.start.setPosition(
      width / 2 - this.start.width / 2,
      this.logo.y + this.logo.height + 30
    );
    // re position the instructions link
    this.instructions.setPosition(
      width / 2 - this.instructions.width / 2,
      this.start.y + this.start.height + 16
    );

    // reposition the action buttons
    this.backBtn.setPosition(width / 2 - this.backBtn.width / 1.5, 575);
    this.embarkBtn.setPosition(width / 2 + this.embarkBtn.width / 1.5, 575);

    this.profileCard.resize(this, width);
  }

  /**
   * Shows a black transparent overlay that makes it easier
   * to read the text on the screen
   * @param {number} width
   * @param {number} height
   */
  showOverlay(width, height, alpha) {
    // sets fill color to black
    this.gameSceneGraphics.fillStyle(0x000000, alpha);
    // adds a black transparent layer
    this.overlay = this.gameSceneGraphics.fillRect(0, 0, width, height);
    this.overlay.setDepth(2).setVisible(true);
  }
}
