class ProfileCard {
  constructor(scene) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    scene.gameSceneGraphics.lineStyle(2, 0xf9f0d9, 1);

    this.container = scene.gameSceneGraphics
      .strokeRoundedRect(0, 0, 300, 430, 10)
      .setVisible(false);

    // add score label to scene
    this.nameLabel = scene.add
      .text(0, 0, "NAME:", CARD_LABEL)
      .setVisible(false);

    // add score text to scene
    this.name = scene.add
      .text(0, 0, scene.profile.name.substring(0, 25), CARD_VALUE)
      .setVisible(false);

    //
    this.phraseLabel = scene.add
      .text(0, 0, "CATCH PHRASE:", CARD_LABEL)
      .setVisible(false);

    //
    this.phrase = scene.add
      .text(0, 0, scene.profile.phrase.substring(0, 50), CARD_VALUE)
      .setVisible(false);

    //
    this.scoreLabel = scene.add
      .text(0, 0, "HIGHEST SCORE:", CARD_LABEL)
      .setVisible(false);

    //
    this.score = scene.add
      .text(0, 0, scene.profile.score, CARD_VALUE)
      .setVisible(false);

    //
    this.shipLabel = scene.add
      .text(0, 0, "SHIP:", CARD_LABEL)
      .setVisible(false);

    this.player = new Player(scene, 0, 0, scene.profile.ship)
      .setVisible(false)
      .setActive(false);

      this.player.hp.hide();
  }

  show(scene) {
    this.isVisible = true;
    const width = window.innerWidth;

    this.container.setVisible(true).setPosition(width / 2 - 300 / 2, 100);

    this.nameLabel
      .setVisible(true)
      .setPosition(this.container.x + 16, this.container.y + 16);

    const nameY = this.container.y + this.nameLabel.height + 21;
    this.name.setVisible(true).setPosition(this.container.x + 16, nameY);

    // Phrase
    const phraseLabelY = nameY + this.name.height + 21;
    this.phraseLabel
      .setVisible(true)
      .setPosition(this.container.x + 16, phraseLabelY);

    const phraseY = phraseLabelY + this.phraseLabel.height + 3;
    this.phrase.setVisible(true).setPosition(this.container.x + 16, phraseY);

    // SCORE
    const scoreLabelY = phraseY + this.phrase.height + 21;
    this.scoreLabel
      .setVisible(true)
      .setPosition(this.container.x + 16, scoreLabelY);

    const scoreY = scoreLabelY + this.scoreLabel.height + 3;
    this.score.setVisible(true).setPosition(this.container.x + 16, scoreY);

    // SHIP
    const shipLabelY = scoreY + this.score.height + 21;
    this.shipLabel
      .setVisible(true)
      .setPosition(this.container.x + 16, shipLabelY);

    const shipY = shipLabelY + this.shipLabel.height + 70;

    this.player
      .setVisible(true)
      .setScale(0.65)
      .setPosition(width / 2, shipY);
  }

  hide() {
    this.isVisible = false;

    this.container.setVisible(false);

    this.nameLabel.setVisible(false);
    this.name.setVisible(false);

    // Phrase
    this.phraseLabel.setVisible(false);
    this.phrase.setVisible(false);

    // SCORE
    this.scoreLabel.setVisible(false);
    this.score.setVisible(false);

    // SHIP
    this.shipLabel.setVisible(false);
    this.player.setVisible(false);
  }

  resize(scene, width) {
    if (this.isVisible) {
      this.container.setPosition(width / 2 - 300 / 2, 100);

      this.nameLabel
        .setVisible(true)
        .setPosition(this.container.x + 16, this.container.y + 16);

      const nameY = this.container.y + this.nameLabel.height + 21;
      this.name.setVisible(true).setPosition(this.container.x + 16, nameY);

      // Phrase
      const phraseLabelY = nameY + this.name.height + 21;
      this.phraseLabel
        .setVisible(true)
        .setPosition(this.container.x + 16, phraseLabelY);

      const phraseY = phraseLabelY + this.phraseLabel.height + 3;
      this.phrase.setVisible(true).setPosition(this.container.x + 16, phraseY);

      // SCORE
      const scoreLabelY = phraseY + this.phrase.height + 21;
      this.scoreLabel
        .setVisible(true)
        .setPosition(this.container.x + 16, scoreLabelY);

      const scoreY = scoreLabelY + this.scoreLabel.height + 3;
      this.score.setVisible(true).setPosition(this.container.x + 16, scoreY);

      // SHIP
      const shipLabelY = scoreY + this.score.height + 21;
      this.shipLabel
        .setVisible(true)
        .setPosition(this.container.x + 16, shipLabelY);

      const shipY = shipLabelY + this.shipLabel.height + 70;
      this.player.setPosition(width / 2, shipY);
    }
  }
}
