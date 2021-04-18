/**
 * Scene that has the content and logic for the game scene
 * This is where the user gets to control their ship and shoot enemies
 */
class ProfileScene extends Phaser.Scene {
  constructor() {
    super({
      key: "ProfileScene",
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

  /**
   * Loads Profile from storage
   */
   loadProfile() {
    if (localStorage.profile) {
      this.profile = JSON.parse(localStorage.profile);
    }
  }

  /**
   * Preloads assets for the scene
   */
  preload() {
    this.loadProfile();

    // load space background
    this.load.image("space", "../../images/backgrounds/profile_background.png");

    // load edit button
    this.load.spritesheet(
      "edit-profile-btn",
      "../../images/gui/edit-profile.png",
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

    // load font
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );

    // creates object reference for the edit name modal
    this.editModal = new bootstrap.Modal(document.getElementById("edit-modal"));
  }

  /**
   * Creates game objects for the scene
   */
  create() {
    // get viewport dimension
    const width = window.innerWidth;
    const height = window.innerHeight;

    // add space background to game
    this.bg = this.add.tileSprite(0, 0, 10000, 10000, "space").setOrigin(0);

    // get graphics for create method
    this.gameSceneGraphics = this.add.graphics();

    // Loaing in google font
    // once loaded, add the text for the Integrity
    WebFont.load({
      google: {
        families: ["Rationale"],
      },
    });

    // Adds game objects to scene
    this.addNameContent(height, width);
    this.addPhraseContent(height, width);
    this.addScoreContent(height, width);
    this.addShipContent(height, width);
    this.addEditBtn(height, width);

    // add form events
    this.addFormHandlers();

    // hide loader since game objects are loaded
    this.hideLoader();

    // set the resize listener and callback
    this.scale.on("resize", this.resize, this);
  }

  /**
   * On every frame, update the the values based on localstorage
   */
  update() {
    this.name.setText(this.profile.name.substring(0, 25));
    this.phrase.setText(this.profile.phrase.substring(0, 35));
  }

  /**
   * Adds handlers for the form and modals
   */
  addFormHandlers() {
    /**
     * Adds click handler to
     */
    $("#save-btn").click(() => {
      const reg = /^$/; // regex to check for empty strings

      const name = $("#name").val().trim();
      const phrase = $("#phrase").val().trim();
      const ship = $(".active-ship").attr("id");

      // we set the payload to the default values
      // name: "Tommy Trojan"
      // phrase: "Fight On!"
      // ship: "player-ship-a"
      let payload = {
        ...PLAYER_PLACEHOLDER,
      };

      // set name if its not empty
      if (!reg.test(name)) {
        payload = {
          ...payload,
          name: name,
        };
      }

      // set phrase if its not empty
      if (!reg.test(phrase)) {
        payload = {
          ...payload,
          phrase: phrase,
        };
      }

      // set ship if its not empty
      if (!reg.test(ship)) {
        payload = {
          ...payload,
          ship: ship,
        };
      }

      this.profile = payload; // update obj with new values

      // update localstorage
      const str = JSON.stringify(payload);
      localStorage.profile = str;

      // destroy previous ship obj and create new ship with new values
      this.player.destroy();
      this.addPlayerShip();

      // close modal and show success alert
      this.editModal.toggle();
      this.showSuccessAlert("Profile updated successfully!");
    });

    /**
     * Add click handler to ships in select ship modal
     * Changes active border to users selection
     */
    $(".ship").click(function () {
      $(".active-ship").removeClass("active-ship"); // remove border
      $(this).addClass("active-ship"); // add border
    });

    /**
     * Listens for changes in the phrase textarea field
     * Updates the chracter count for the catch phrase
     */
    $("#phrase").on("change keyup paste", function () {
      const val = $(this).val();
      $("#char-phrase-count").html(val.length);
    });

    /**
     * Listens for changes in the name input field
     * Updates the chracter count for the name
     */
    $("#name").on("change keyup paste", function () {
      const val = $(this).val();
      $("#char-name-count").html(val.length);
    });
  }

  /**
   * Adds name label, value and edit button to the scene
   * @param {number} height viewport height
   * @param {number} width viewport width
   */
  addNameContent(height, width) {
    // styles for name text
    const styles = {
      fontFamily: "Rationale",
      fontSize: 36,
      color: "#F9F0D9",
    };
    // styles for name label
    const labelStyles = {
      fontFamily: "Rationale",
      fontSize: 22,
      color: "#F94A41",
    };

    //  add name text
    this.name = this.add.text(0, 0, this.profile.name.substring(0, 25), styles);

    // center text
    this.name.setPosition(width / 2 - LABEL_OFFSET / 2, height * 0.15);

    // add name label
    this.nameLabel = this.add
      .text(0, 0, "NAME:", labelStyles)
      .setPosition(width / 2 - LABEL_OFFSET, height * 0.12);
  }

  /**
   * Adds phrase label, value and edit button to the scene
   * @param {number} height viewport height
   * @param {number} width viewport width
   */
  addPhraseContent(height, width) {
    // styles for phrase text
    const styles = {
      fontFamily: "Rationale",
      fontSize: 28,
      color: "#F9F0D9",
      height: 200,
      wordWrap: { width: 450, useAdvancedWrap: true },
    };

    // styles for label
    const labelStyles = {
      fontFamily: "Rationale",
      fontSize: 22,
      color: "#F94A41",
    };

    // add phrase text - only show 50 characters
    this.phrase = this.add.text(
      0,
      0,
      this.profile.phrase.substring(0, 35),
      styles
    );

    // center text
    this.phrase.setPosition(width / 2 - LABEL_OFFSET/2, height * 0.26);

    // add phrase label
    this.phraseLabel = this.add
      .text(0, 0, "CATCH PHRASE:", labelStyles)
      .setPosition(width / 2 - LABEL_OFFSET, height * 0.23);
  }

  /**
   * Adds score label and value to the scene
   * @param {number} height viewport height
   * @param {number} width viewport width
   */
  addScoreContent(height, width) {
    // styles for score text
    const styles = {
      fontFamily: "Rationale",
      fontSize: 32,
      color: "#F9F0D9",
    };

    // styles for score label
    const labelStyles = {
      fontFamily: "Rationale",
      fontSize: 22,
      color: "#F94A41",
    };

    // add score label to scene
    this.scoreLabel = this.add
      .text(0, 0, "HIGHEST SCORE:", labelStyles)
      .setPosition(width / 2 - LABEL_OFFSET, height * 0.33);

    // add score text to scene
    this.score = this.add.text(0, 0, this.profile.score, styles);

    // center text
    this.score.setPosition(width / 2 - LABEL_OFFSET/ 2, height * 0.36);
  }

  /**
   * Adds ship label, value and swap button to the scene
   * @param {number} height viewport height
   * @param {number} width viewport width
   */
  addShipContent(height, width) {
    // styles for label
    const labelStyles = {
      fontFamily: "Rationale",
      fontSize: 22,
      color: "#F94A41",
    };

    // adds ship label to the scene
    this.shipLabel = this.add
      .text(0, 0, "SHIP:", labelStyles)
      .setPosition(width / 2 - LABEL_OFFSET, height * 0.42);

    this.addPlayerShip();
  }

  /**
   * Adds player ship
   */
  addPlayerShip() {
    // get viewport dimension
    const width = window.innerWidth;
    const height = window.innerHeight;

    /**
     * Adds the players ship to the scene
     */
    if (this.profile.ship === "player-ship-a") {
      // add ship a
      this.player = new PlayerShipA(this, width / 2, height * 0.55).setScale(
        0.7
      );
    } else if (this.profile.ship === "player-ship-b") {
      // add ship b
      this.player = new PlayerShipB(this, width / 2, height * 0.55).setScale(
        0.7
      );
    } else if (this.profile.ship === "player-ship-c") {
      // add ship c
      this.player = new PlayerShipC(this, width / 2, height * 0.55).setScale(
        0.7
      );
    }
  }

  /**
   * Adds edit button to scene
   * Opens modal that allows user to update their profile
   * @param {*} height
   * @param {*} width
   */
  addEditBtn(height, width) {
    // // adds edit button to the scene
    this.editBtn = this.add
      .sprite(0, 0, "edit-profile-btn")
      .setInteractive({ useHandCursor: true })
      .setScale(1);

    this.editBtn.setPosition(width / 2, height * 0.73);

    /**
     * adds on click event handler to the ship swap button
     * opens modal where user can select their ship
     */
    this.editBtn.on("pointerdown", () => {
      // updates name field with current value + update char count
      $("#name").val(this.profile.name);
      $("#char-name-count").html(this.profile.name.length);
      // updates phrase field with current value + update char count
      $("#phrase").val(this.profile.phrase);
      $("#char-phrase-count").html(this.profile.phrase.length);

      $(`#${this.profile.ship}`).addClass("active-ship");

      // show modal to select ship
      this.editModal.show();
    });

    /**
     * Adds hover event handler to button
     * Changes color to red on hover
     */
    this.editBtn.on("pointerover", () => {
      this.editBtn.setFrame(1);
    });

    /**
     * Adds no hover event handler to button
     * Changes color to white on no hover
     */
    this.editBtn.on("pointerout", () => {
      this.editBtn.setFrame(0);
    });
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

    // Keep all the game objects centered
    this.name.setPosition(width / 2 - LABEL_OFFSET / 2, height * 0.15);
    this.nameLabel.setPosition(width / 2 - LABEL_OFFSET, height * 0.12);
    this.phrase.setPosition(width / 2 - LABEL_OFFSET / 2, height * 0.26);
    this.phraseLabel.setPosition(width / 2 - LABEL_OFFSET, height * 0.23);
    this.shipLabel.setPosition(width / 2 - LABEL_OFFSET, height * 0.42);
    this.player.setPosition(width / 2, height * 0.55);
    this.score.setPosition(width / 2 - LABEL_OFFSET / 2, height * 0.36);
    this.scoreLabel.setPosition(width / 2 - LABEL_OFFSET, height * 0.33);
    this.editBtn.setPosition(width / 2, height * 0.73);
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

  /**
   * Shows success alert top right of viewport
   * Alert disappears after 2 seconds of fadeout
   * @param {*} msg 
   */
  showSuccessAlert(msg) {
    $("#alert-msg").text(msg);
    // set fade in / fade out animation
    $(".toast").animate({ opacity: 1 }, function () {
      setTimeout(() => {
        $(this).animate({ opacity: 0 });
      }, 2000);
    });
  }
}
