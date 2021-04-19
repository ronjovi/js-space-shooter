/**
 *
 */
class GameOverMenu {
  constructor(scene) {
    this.gameOver = scene.add
      .text(0, 0, "GAME OVER", MENU_GAME_OVER_STYLES)
      .setVisible(false)
      .setDepth(-1);

    // adds hiddens restart link
    this.restartLink = scene.add
      .text(0, 0, "RESTART LEVEL", MENU_LINK_STYLES)
      .setVisible(false)
      .setDepth(-1);

    // adds quit link
    this.quitLink = scene.add
      .text(0, 0, "QUIT", MENU_LINK_STYLES)
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
    this.gameOver.setVisible(false).setDepth(-1);
    this.restartLink.setVisible(false).setDepth(-1).setInteractive(false);
    this.quitLink.setVisible(false).setDepth(-1).setInteractive(false);
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
    this.gameOver
      .setPosition(width / 2 - this.gameOver.width / 2, height * 0.3)
      .setVisible(true)
      .setDepth(3);

    // make restart link visible
    this.restartLink
      .setPosition(width / 2 - this.restartLink.width / 2, height * 0.4)
      .setVisible(true)
      .setInteractive({ useHandCursor: true })
      .setDepth(3);

    this.quitLink
      .setPosition(width / 2 - this.quitLink.width / 2, height * 0.45)
      .setVisible(true)
      .setDepth(3)
      .setInteractive({ useHandCursor: true });
  };
}
