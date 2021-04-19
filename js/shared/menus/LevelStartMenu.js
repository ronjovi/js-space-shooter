/**
 *
 */
class levelStartMenu {
  constructor(scene, message) {
    // GET VIEWPORT DIMENSIONS
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.message = message;

    this.createStartMessage(scene, width, height);
    this.createStartBtn(scene, width, height);
    this.show(scene);
  }

  /**
   * Creates the box with the level objective
   * @param {} scene
   */
  createStartMessage(scene, width, height) {
    // Create game mission description
    this.startMessageBox = this.createTextBox(
      scene,
      width / 2 - 125,
      height * 0.45,
      {
        wrapWidth: 250,
      }
    )
  }

  /**
   * Creates the start button
   * On click it hids the start menu and starts game
   * @param {*} scene
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
        scene.gameSceneGraphics
        .lineStyle(2, 0x00ffff, 2)
        .strokeRectShape(scene.player.body.customBoundsRectangle)
        .setVisible(true)
        .setDepth(3);
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

  hide(scene) {
    scene.gameSceneGraphics.clear();
    this.startMessageBox.setVisible(false).setDepth(-1);
    this.startBtn.setVisible(false).setDepth(-1).setInteractive(false);

    scene.isReady = true;
    scene.isPaused = false;
    scene.gameClock.paused = false;
  }

  show(scene) {
    // get viewport dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // show dark overlay
    scene.showOverlay(width, height, 0.85);

    this.startMessageBox.setVisible(true).setDepth(3).start(this.message, 30);
    this.startBtn.setVisible(true).setDepth(3).setInteractive({ useHandCursor: true }).setPosition(width / 2, this.startMessageBox.y + this.startMessageBox.height + 30)
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
