// game config
var config = {
  type: Phaser.WEBGL, // instructs pahser to use webGL  - defaults to canvas if it cant
  backgroundColor: "#2dab2d",
  scale: {
    mode: Phaser.Scale.RESIZE, // sets resize size which scales game based on viewport width
    parent: "game-container", // id of the element containg the game
    height: "100%", // scale to 100% height
    width: "100%", // scale to 100% width
  },
  physics: {
    debug: true,
    default: "arcade",
    arcade: {
      fps: 60,
      debug: true,
      debugShowBody: true,
      debugShowStaticBody: true,
      debugShowVelocity: true,
      debugVelocityColor: 0xffff00,
      debugBodyColor: 0x0000ff,
      debugStaticBodyColor: 0xffffff,
    },
  },
  scene: [LevelOneScene, StartScene],
};

// create game instance
const game = new Phaser.Game(config);
