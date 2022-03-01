/**
 * The ProfileCard is a container that shows the user
 * Their current profile details
 */
class ProfileCard {
  constructor(scene, width) {
    this.addContainer(scene, width);
    this.addName(scene);
    this.addPhrase(scene);
    this.addScore(scene);
    this.addShip(scene, width);
  }

  hide(){
    this.container.setVisible(false);
    this.nameLabel.setVisible(false);
    this.name.setVisible(false);
    this.phraseLabel.setVisible(false);
    this.phrase.setVisible(false);
    this.scoreLabel.setVisible(false);
    this.score.setVisible(false);
    this.shipLabel.setVisible(false);
    this.player.setVisible(false);
  }

  show(){
    this.container.setVisible(true);
    this.nameLabel.setVisible(true);
    this.name.setVisible(true);
    this.phraseLabel.setVisible(true);
    this.phrase.setVisible(true);
    this.scoreLabel.setVisible(true);
    this.score.setVisible(true);
    this.shipLabel.setVisible(true);
    this.player.setVisible(true);
  }

  /**
   * Creates a container for the profile details
   * Container has a white 2px border that is centered
   * @param {object} scene phaser scene object
   * @param {number} width viewport width
   */
  addContainer(scene, width) {
    // border stroke
    scene.gameSceneGraphics.lineStyle(2, 0xf9f0d9, 1);

    // rectangle container
    this.container = scene.gameSceneGraphics
      .strokeRoundedRect(0, 0, 300, 430, 10)
      .setVisible(true)
      .setPosition(width / 2 - 300 / 2, 100);
  }

  /**
   * Adds profile name label and text to the container
   * Only the first 25 characters of name are shown
   * @param {object} scene phaser scene object
   */
  addName(scene) {
    // label
    this.nameLabel = scene.add
      .text(0, 0, "NAME:", CARD_LABEL_STYLES)
      .setVisible(true)
      .setPosition(this.container.x + 16, this.container.y + 16);

    // y coord for name text
    const nameY = this.container.y + this.nameLabel.height + 21;

    // profile name -> only show first 25 char
    this.name = scene.add
      .text(0, 0, scene.profile.name.substring(0, 25), CARD_TEXT_STYLES)
      .setVisible(true)
      .setPosition(this.container.x + 16, nameY);
  }

  /**
   * Adds profile catch phrase to the container
   * Only the first 50 chracters of the catch phrasea are shown
   * @param {object} scene phaser scene object
   */
  addPhrase(scene) {
    // y coord for label
    const phraseLabelY = this.name.y + this.name.height + 21;

    // phrase label
    this.phraseLabel = scene.add
      .text(0, 0, "CATCH PHRASE:", CARD_LABEL_STYLES)
      .setVisible(true)
      .setPosition(this.container.x + 16, phraseLabelY);

    // y coord for text
    const phraseY = phraseLabelY + this.phraseLabel.height + 3;

    // phrase text
    this.phrase = scene.add
      .text(0, 0, scene.profile.phrase.substring(0, 50), CARD_TEXT_STYLES)
      .setVisible(true)
      .setPosition(this.container.x + 16, phraseY);
  }

  /**
   * Adds profile score to the container
   * @param {object} scene phaser scene object
   */
  addScore(scene) {
    // score label y coord
    const scoreLabelY = this.phrase.y + this.phrase.height + 21;

    // add score label to scene
    this.scoreLabel = scene.add
      .text(0, 0, "HIGHEST SCORE:", CARD_LABEL_STYLES)
      .setVisible(true)
      .setPosition(this.container.x + 16, scoreLabelY);

    // score value y coord
    const scoreY = scoreLabelY + this.scoreLabel.height + 3;

    // add score text value to scene
    this.score = scene.add
      .text(0, 0, scene.profile.score, CARD_TEXT_STYLES)
      .setVisible(true)
      .setPosition(this.container.x + 16, scoreY);
  }

  /**
   * Adds player ship label and sprite to the container
   * Also creates ship animation which is played be default
   * @param {object} scene phaser game object
   * @param {number} width  viewport width
   */
  addShip(scene, width) {
    const shipLabelY = this.score.y + this.score.height + 21;

    // add ship label to scene
    this.shipLabel = scene.add
      .text(0, 0, "SHIP:", CARD_LABEL_STYLES)
      .setVisible(true)
      .setPosition(this.container.x + 16, shipLabelY);

    const shipY = shipLabelY + this.shipLabel.height + 70;

    // create ship object and add it to the scene
    this.player = scene.add
      .sprite(0, 0, scene.profile.ship)
      .setVisible(true)
      .setActive(true)
      .setPosition(width / 2, shipY)
      .setScale(0.7);

    // create ship idle animation
    scene.anims.create({
      key: "player-ship-idle",
      frames: scene.anims.generateFrameNumbers(scene.profile.ship),
      frameRate: 20,
      repeat: -1,
    });

    // play animation
    this.player.play("player-ship-idle");
  }

  /**
   * resize will fire everytime the window is resized. It will
   * update the position of the game objects and ensure that
   * they remain centered on the screen
   * @param {number} width viewport width
   */
  resize(width) {
    // center container
    this.container.setPosition(width / 2 - 300 / 2, 100);

    // Center name label and text
    this.nameLabel.x = this.container.x + 16;
    this.name.x = this.container.x + 16;

    // Center phrase label and text
    this.phraseLabel.x = this.container.x + 16;
    this.phrase.x = this.container.x + 16;

    // Center score label and text
    this.scoreLabel.x = this.container.x + 16;
    this.score.x = this.container.x + 16;

    // center ship label and text 
    this.shipLabel.x = this.container.x + 16;
    this.player.x = width / 2;
  }

  /**
   * Updates the values of the catch phrase and name inside
   * of the container
   * @param {*} phrase 
   * @param {*} name 
   */
  updateText(phrase, name) {
    this.phrase.setText(phrase);
    this.name.setText(name);
  }

  reloadShip(scene) {
    const y = this.shipLabel.y + this.shipLabel.height;
    const width = window.innerWidth;
    this.player.destroy();

    this.player = scene.add.sprite(0, 0, scene.profile.ship);
    const shipY = this.shipLabel.y + this.shipLabel.height + 70;

    this.player
      .setVisible(true)
      .setScale(0.65)
      .setActive(true)
      .setPosition(width / 2, shipY);

    scene.anims.create({
      key: `player-ship-idle-${scene.profile.ship}`,
      frames: scene.anims.generateFrameNumbers(scene.profile.ship),
      frameRate: 20,
      repeat: -1,
    });

    this.player.play(`player-ship-idle-${scene.profile.ship}`);
  }
}
