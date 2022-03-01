// game config
var config = {
  type: Phaser.WEBGL, // instructs pahser to use webGL  - defaults to canvas if it cant
  backgroundColor: "#2dab2d",
  scale: {
    mode: Phaser.Scale.RESIZE, // sets resize size which scales game based on viewport width
    parent: "game-container", // id of the element game container
    height: "100%", // scale to 100% height
    width: "100%", // scale to 100% width
  },
  physics: {
    default: "arcade",
    arcade: {
      fps: 60,
    },
  },
  scene: [StartScene, LevelOneScene],
};

// create game instance
const game = new Phaser.Game(config);
