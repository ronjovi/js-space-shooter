/**
 *
 */
class WinnerMenu {
  constructor(scene) {
    this.message = LEVEL_WINNER_MESSAGE;

    this.winner = scene.add
      .text(0, 0, "LEVEL COMPLETE!", MENU_GAME_OVER_STYLES)
      .setVisible(false)
      .setDepth(-1);

    // adds hiddens restart link
    this.restartLink = scene.add
      .text(0, 0, "REPLAY LEVEL", MENU_LINK_STYLES)
      .setVisible(false)
      .setDepth(-1);

    // adds quit link
    this.quitLink = scene.add
      .text(0, 0, "QUIT", MENU_LINK_STYLES)
      .setVisible(false)
      .setDepth(-1);

    // Create game mission description
    this.summary = this.createTextBox(scene, -500, -500)
      .setVisible(false)
      .setDepth(-1);

    this.addLinkListeners(scene);
  }

  /**
   *
   */
  addLinkListeners(scene) {
    // on restart link click to restart game
    this.restartLink.on("pointerdown", () => {
      this.hide(scene);
      scene.resetGame();
    });

    /**
     * changes restart color to red on hover
     */
    this.restartLink.on("pointerover", () => {
      const styles = { color: COLOR_RED }; // start styles
      this.restartLink.setStyle(styles);
    });

    /**
     * changes restart color to white on no hover
     */
    this.restartLink.on("pointerout", () => {
      const styles = { color: COLOR_WHITE }; // start styles
      this.restartLink.setStyle(styles);
    });

    // quits the game
    this.quitLink.on("pointerdown", () => {
      document.querySelector("#game-loader").style.opacity = 1;
      document.querySelector("#game-loader").style.display = "flex";
      scene.quitGame();
    });

    /**
     * changes restart color to red on hover
     */
    this.quitLink.on("pointerover", () => {
      const styles = { color: COLOR_RED }; // start styles
      this.quitLink.setStyle(styles);
    });

    /**
     * changes restart color to white on no hover
     */
    this.quitLink.on("pointerout", () => {
      const styles = { color: COLOR_WHITE }; // start styles
      this.quitLink.setStyle(styles);
    });
  }

  /**
   * Hides menu objects
   * @param {*} scene
   */
  hide(scene) {
    // clear the black overlay
    scene.gameSceneGraphics.clear();
    // hide the game over text
    this.winner.setVisible(false).setDepth(-1);
    this.restartLink.setVisible(false).setDepth(-1).setInteractive(false);
    this.quitLink.setVisible(false).setDepth(-1).setInteractive(false);
    this.summary.setVisible(false).setDepth(-1);
  }

  /**
   * Show menu
   */
  show = (scene) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // show dark overlay
    scene.showOverlay(width, height, 0.9);

    // make game over text visible
    this.winner
      .setPosition(width / 2 - this.winner.width / 2, height * 0.1)
      .setVisible(true)
      .setDepth(3);

    this.summary
      .setPosition(width / 2 - this.summary.width / 2, height * 0.2)
      .setDepth(3)
      .start(this.message, 10);

    // make restart link visible
    this.restartLink
      .setPosition(width / 2 - this.restartLink.width / 2, height * 0.55)
      .setVisible(true)
      .setInteractive({ useHandCursor: true })
      .setDepth(3);

    this.quitLink
      .setPosition(width / 2 - this.quitLink.width / 2, height * 0.6)
      .setVisible(true)
      .setDepth(3)
      .setInteractive({ useHandCursor: true });

    setTimeout(() => {
      this.summary.setVisible(true);
    }, 1);
  };

  /**
   *
   * @param {*} scene
   * @param {*} x
   * @param {*} y
   * @param {*} config
   * @returns
   */
  createTextBox(scene, x, y) {
    const wrapWidth = 300;
    const fixedWidth = 300;
    const fixedHeight = 0;

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
      fontSize: "22px",
      wrap: {
        mode: "word",
        width: wrapWidth,
      },
      maxLines: 10,
    });
  }
}
