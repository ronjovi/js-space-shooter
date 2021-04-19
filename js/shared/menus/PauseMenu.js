/**
 *
 */
class PauseMenu {
  constructor(scene) {
    // adds hidden logo
    this.logo = scene.add
      .text(0, 0, "Space Odyssey", MENU_LOGO_STYLES)
      .setVisible(false)
      .setDepth(-1);

    // adds hiddens resume link
    this.resumeLink = scene.add
      .text(0, 0, "RESUME GAME", MENU_LINK_STYLES)
      .setVisible(false)
      .setDepth(-1);

    // adds instructions link
    this.instructionsLink = scene.add
      .text(0, 0, "INSTRUCTIONS (TBA)", MENU_LINK_STYLES)
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
    // on start link click hide the pause menu and resume game
    this.resumeLink.on("pointerdown", () => {
      this.hide(scene);
      scene.gameSceneGraphics.clear();
      scene.isPaused = false;
    });

    /**
     * changes restart color to red on hover
     */
    this.resumeLink.on("pointerover", () => {
      const styles = { color: COLOR_RED }; // start styles
      this.resumeLink.setStyle(styles);
    });

    /**
     * changes restart color to white on no hover
     */
    this.resumeLink.on("pointerout", () => {
      const styles = { color: COLOR_WHITE }; // start styles
      this.resumeLink.setStyle(styles);
    });

    // quits the game
    this.quitLink.on("pointerdown", (pointer) => {
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
   * Hide menu
   * @param {*} scene
   */
  hide(scene) {
    scene.gameSceneGraphics.clear();
    this.logo.setVisible(false).setDepth(-1);
    this.resumeLink.setVisible(false).setDepth(-1).setInteractive(false);
    this.instructionsLink.setVisible(false).setDepth(-1).setInteractive(false);
    this.quitLink.setVisible(false).setDepth(-1).setInteractive(false);
  }

  /**
   * Show menu
   */
  show = (scene) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // show dark overlay
    scene.showOverlay(width, height, 0.6);

    // make logo visible
    this.logo
      .setPosition(width / 2 - this.logo.width / 2, height * 0.3)
      .setVisible(true)
      .setDepth(3);

    // make start link visible
    this.resumeLink
      .setPosition(width / 2 - this.resumeLink.width / 2, height * 0.4)
      .setVisible(true)
      .setDepth(3)
      .setInteractive({ useHandCursor: true });

    // make instructions link visible
    this.instructionsLink
      .setPosition(width / 2 - this.instructionsLink.width / 2, height * 0.45)
      .setVisible(true)
      .setDepth(3)
      .setInteractive({ useHandCursor: true });

    // make quit link visible
    this.quitLink
      .setPosition(width / 2 - this.quitLink.width / 2, height * 0.5)
      .setVisible(true)
      .setDepth(3)
      .setInteractive({ useHandCursor: true });
  };
}
