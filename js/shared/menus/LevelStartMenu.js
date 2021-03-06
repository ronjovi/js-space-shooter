/**
 * This is the start menu that contains the mission brief
 * This menu is only shown when isReady = true
 * Once user clicks on the start button this menu is hidden
 */
class levelStartMenu {
  constructor(scene, message) {
    // GET VIEWPORT DIMENSIONS
    const width = window.innerWidth;
    const height = window.innerHeight;

    // mission brief
    this.message = message;

    // creates the mission brief auto typer
    this.createStartMessage(scene, width, height);
    // creates start button
    this.createStartBtn(scene, width, height);
  }

  /**
   * Creates a box with the mission objective/brief
   * Message is hidden by default
   * @param {object} scene game object
   */
  createStartMessage(scene, width, height) {
    this.startMessageBox = this.createTextBox(
      scene,
      width / 2 - 125,
      height * 0.45,
    );

    this.startMessageBox.setVisible(false).setDepth(-1);
  }

  /**
   * Creates the start button. Button is hidden by default
   * On click it hides the start menu and starts game
   * @param {ibject} scene  game object
   */
  createStartBtn(scene, width, height) {
    // create start button
    this.startBtn = scene.add
      .sprite(width / 2, height * 0.61, "start-btn")
      .setScale(1)
      .setVisible(false)
      .setDepth(-1);

    // on click listener -> hides the menu
    this.startBtn.on("pointerdown", () => {
      this.hide(scene);
    });

    // changes sprite to red frame
    this.startBtn.on("pointerover", (pointer) => {
      this.startBtn.setFrame(1);
    });

    // changes sprite to white frame
    this.startBtn.on("pointerout", (pointer) => {
      this.startBtn.setFrame(0);
    });
  }

  /**
   * Hide menu content. Hides the misson box and the start button
   * @param {object} scene  game object
   */
  hide(scene) {
    scene.gameSceneGraphics.clear();
    this.startMessageBox.setVisible(false).setDepth(-1);
    this.startBtn.setVisible(false).setDepth(-1).setInteractive(false);

    scene.isReady = true;
    scene.isPaused = false;
    scene.gameClock.paused = false;
  }

  /**
   * Shows the menu content. Shows the mission box and start button.
   * Also shows the dark overlay for easier reading
   * @param {object} scene  game object
   */
  show(scene) {
    // get viewport dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // show dark overlay
    scene.showOverlay(width, height, 0.85);

    this.startMessageBox.setVisible(true).setDepth(3).start(this.message, 30);
    this.startBtn
      .setVisible(true)
      .setDepth(3)
      .setInteractive({ useHandCursor: true })
      .setPosition(
        width / 2,
        this.startMessageBox.y + this.startMessageBox.height + 30
      );
  }

  /**
   * Creates the typwriter animation using the rexUI plugin
   * @param {object} scene game object
   * @param {number} x x position for positioing
   * @param {number} y y position for positioing
   * @returns text box with typewriter animation
   */
  createTextBox(scene, x, y) {
    // width at which text whould wrap
    const wrapWidth = 240;
    // width and height of box container
    const fixedWidth = 250;
    const fixedHeight = 75;

    // we use the rexUI plugin to create typewriter text
    let textBox = scene.rexUI.add
      .textBox({
        x: x,
        y: y,
        background: scene.rexUI.add
          .roundRectangle(0, 0, 2, 2, 8, "0x201F35")
          .setStrokeStyle(2, "0xF9F0D9"),
        text: this.getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight), // returns text in BBCode protocol
        space: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
          text: 10,
        },
      })
      .setOrigin(0)
      .layout()
      .setDepth(3);

    return textBox;
  }

  /**
   * Draws text with the BBCode protocol
   * @param {object} scene level/game object
   * @param {number} wrapWidth
   * @param {number} fixedWidth
   * @param {number} fixedHeight
   * @returns text in BBCode protocol. This will be used to animate the text
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

  /**
   * Re positions the level start menu game objects
   * Keeps the items centered
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.startBtn.setPosition(
      width / 2,
      this.startMessageBox.y + this.startMessageBox.height + 30
    );
    this.startMessageBox.setPosition(width / 2 - 125, height * 0.45);
  }
}
