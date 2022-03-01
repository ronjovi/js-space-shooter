/**
 * The profile scene shows the user their current profile configuration
 * And allows users to update their profile
 * Users are able to update their profile name, catch phrase and ship
 */
class ProfileScene extends Phaser.Scene {
  constructor() {
    super({
      key: "ProfileScene",
    });

    /**
     * Sets placeholder data in case there is none in storage
     *    name - string name of player
     *    catch phrase - string player catch phrase
     *    highestScore - numbers player's highest score
     *    ship - string texture of ship chosen by player
     */
    this.profile = PLAYER_PLACEHOLDER;
  }

  /**
   * Updates the user profile with the data in local storage
   * If there is no data in local storage, profile will keep the default settings
   */
  loadProfile() {
    if (localStorage.profile) {
      this.profile = JSON.parse(localStorage.profile);
    }
  }

  /**
   * Preloads assets for the scene
   * Users will see a loading screen as assets are loaded
   */
  preload() {
    this.loadProfile();

    // load space background
    this.load.image(
      "space",
      "https://temp-assets-t.s3-us-west-1.amazonaws.com/profile_background.png"
    );

    // load edit button
    this.load.spritesheet(
      "edit-profile-btn",
      "https://temp-assets-t.s3-us-west-1.amazonaws.com/edit-profile.png",
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
   * Users will see loading screen as the game objects are created
   * Once all objects are created, the loading screen is hidden
   */
  create() {
    // get viewport dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // add space background to game
    this.bg = this.add.tileSprite(0, 0, 10000, 10000, "space").setOrigin(0);

    // get graphics for create method
    this.gameSceneGraphics = this.add.graphics();

    // Loaing in google font
    WebFont.load({
      google: {
        families: ["Rationale"],
      },
    });

    // add the profile details to the scene
    this.profileCard = new ProfileCard(this, width);
    // this.profileCard.show();

    // adds edit button to scene
    this.addEditBtn(width);

    // add form events
    this.addFormHandlers();

    // hide loader since game objects are loaded
    this.hideLoader();

    // set the resize listener and callback
    this.scale.on("resize", this.resize, this);
  }

  /**
   * Adds click handlers for the form in modal
   * listens for clicks on save btn and changes in the form fields
   */
  addFormHandlers() {
    /**
     * Checks is str is empty
     * returns true if empty and show err, otherwise returns false
     * @param {*} val
     */
    function isEmpty(val, errId) {
      const reg = /^$/; // regex to check for empty strings

      if (reg.test(val)) {
        $(errId).css({ display: "block" }); // show err since name is empty
        return true;
      } else {
        $(errId).css({ display: "none" }); // hide err since name is not empty
        return false;
      }
    }

    /**
     * Listens for clicks on the submit btn in the modal.
     * Validates the form fields before attempting to save
     * On successful validation the data is saved to localstorage and
     * the scene game objects are updated to reflect the new values
     */
    $("#save-btn").click(() => {
      const name = $("#name").val().trim();
      const phrase = $("#phrase").val().trim();
      const ship = $(".active-ship").attr("id");

      // check for empty fields
      const nameCheck = isEmpty(name, "#name-err");
      const phraseCheck = isEmpty(phrase, "#phrase-err");

      if (!nameCheck && !phraseCheck) {
        // profile data to be saved in storage
        const payload = {
          name: name,
          phrase: phrase,
          score: this.profile.score,
          ship: ship,
        };

        // update localstorage
        const str = JSON.stringify(payload);
        localStorage.profile = str;

        this.profile = payload;

        // update ship in scnene so it reflects the new choice
        this.profileCard.reloadShip(this);
        // update the name and phrase
        this.profileCard.updateText(this.profile.phrase, this.profile.name);
        // show success alert
        this.showSuccessAlert("Profile updated successfully!");
        //close modal
        this.editModal.toggle();
      }
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
      isEmpty(val, "#phrase-err");
    });

    /**
     * Listens for changes in the name input field
     * Updates the chracter count for the name
     */
    $("#name").on("change keyup paste", function () {
      const val = $(this).val();
      $("#char-name-count").html(val.length);
      isEmpty(val, "#name-err");
    });
  }

  /**
   * Adds edit button to scene
   * Opens modal that allows user to update their profile
   * @param {*} height
   * @param {*} width
   */
  addEditBtn(width) {
    // // adds edit button to the scene
    this.editBtn = this.add
      .sprite(0, 0, "edit-profile-btn")
      .setInteractive({ useHandCursor: true })
      .setScale(1)
      .setPosition(width / 2, 600);

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
   * Handles resizing the game/game objects when the viewport size changes.
   * Resizes the scene background and centers the game objects
   */
  resize() {
    var width = window.innerWidth; // get viewport width
    var height = window.innerHeight; // get viewport height

    // resizes game scene and background
    this.cameras.resize(width, height);
    this.bg.setSize(width, height);

    // Keep all the game objects centered
    this.editBtn.setPosition(width / 2, 600);
    this.profileCard.resize(width);
  }

  /**
   * Hides loader
   * changes opacity to 0 for fade effect
   * changes display to none after 300ms to wait for fade out to finish
   */
  hideLoader() {
    $("#loader").animate({ opacity: 0 }, 300, function () {
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
