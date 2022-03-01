/**
 * Configuration for the game profile scene
 * Sets scaling properties and physics properties
 * Loads the ProfileScene which allows users to update their profile
 */
var config = {
  type: Phaser.WEBGL, // instructs pahser to use webGL  - defaults to canvas if it cant
  backgroundColor: "#2dab2d",
  scale: {
    mode: Phaser.Scale.RESIZE, // sets resize size which scales game based on viewport width
    parent: "scene-container", // id of the element that will render the game scene
    height: "100%", // scale to 100% height of viewport
    width: "100%", // scale to 100% width of viewport
  },
  physics: {
    debug: false,
    default: "arcade",
    arcade: {
      fps: 60,
    },
  },
  scene: [ProfileScene],
};

// create game instance
const game = new Phaser.Game(config);


