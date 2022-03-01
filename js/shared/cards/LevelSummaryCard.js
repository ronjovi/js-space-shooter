class LevelSummaryCard {
  constructor(scene, y) {
    this.y = y;
    scene.gameSceneGraphics.lineStyle(2, 0xf9f0d9, 1);

    this.container = scene.add
      .rectangle(0, 0, 300, 100)
      .setStrokeStyle(2, 0xefc53f)
      .setVisible(false);

    // add score label to scene
    this.nameLabel = scene.add
      .text(0, 0, "NAME:", SUMMARY_CARD_LABEL)
      .setVisible(false);

    // add score text to scene
    this.name = scene.add
      .text(0, 0, scene.profile.name.substring(0, 25), SUMMARY_CARD_VALUE)
      .setVisible(false);

    //
    this.scoreLabel = scene.add
      .text(0, 0, "SCORE:", SUMMARY_CARD_LABEL)
      .setVisible(false);

    //
    this.score = scene.add
      .text(0, 0, scene.score, SUMMARY_CARD_VALUE)
      .setVisible(false);
  }

  hide() {
    this.isVisible = false;

    this.container.setVisible(false).setDepth(-1);

    // NAME
    this.nameLabel.setVisible(false).setDepth(-1);
    this.name.setVisible(false).setDepth(-1);

    // SCORE
    this.scoreLabel.setVisible(false).setDepth(-1);
    this.score.setVisible(false).setDepth(-1);
  }

  show(y) {
    this.isVisible = true;
    const width = window.innerWidth;

    // Card Container with light border
    this.container
      .setVisible(true)
      .setPosition(width / 2, y)
      .setDepth(3);

    // name label
    this.nameLabel
      .setVisible(true)
      .setPosition(
        this.container.getTopLeft().x + 16,
        this.container.getTopLeft().y + 16
      )
      .setDepth(3);

    // name value
    const nameY = this.container.getTopLeft().y + this.nameLabel.height + 21;
    this.name
      .setVisible(true)
      .setPosition(this.container.getTopLeft().x + 16, nameY)
      .setDepth(3);

    this.scoreLabel
      .setVisible(true)
      .setPosition(
        this.container.getTopLeft().x + 166,
        this.container.getTopLeft().y + 16
      )
      .setDepth(3);

    // score
    const scoreY = this.container.getTopLeft().y + this.scoreLabel.height + 21;
    this.score
      .setVisible(true)
      .setPosition(this.container.getTopLeft().x + 166, scoreY)
      .setDepth(3);
  }

  resize(y, width) {
    if (this.isVisible) {
      // Card Container with light border
      this.container.setPosition(width / 2, y);

      // name label
      this.nameLabel.setPosition(
        this.container.getTopLeft().x + 16,
        this.container.getTopLeft().y + 16
      );

      // name value
      const nameY = this.container.getTopLeft().y + this.nameLabel.height + 21;
      this.name.setPosition(this.container.getTopLeft().x + 16, nameY);

      this.scoreLabel.setPosition(
        this.container.getTopLeft().x + 166,
        this.container.getTopLeft().y + 16
      );

      // score
      const scoreY =
        this.container.getTopLeft().y + this.scoreLabel.height + 21;
      this.score.setPosition(this.container.getTopLeft().x + 166, scoreY);
    }
  }

  updateScore(score){
    this.score.setText(`${score}`)
  }
}
