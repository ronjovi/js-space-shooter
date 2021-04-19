// PLAYER HEALTH
const PLAYER_HEALTH = 200;
// Player fire rate
const PLAYER_FIRE_RATE_DEAFULT = 250;
const PLAYER_FIRE_RATE_X2 = 200;
const PLAYER_FIRE_RATE_X3 = 100;

// Player movement
const PLAYER_VELOCITY_DEFAULT = 200;
const PLAYER_VELOCITY_X2 = 250;
const PLAYER_VELOCITY_X3 = 300;
const PLAYER_PLACEHOLDER = {
  name: "Tommy Trojan",
  phrase: `Fight On!`,
  score: 0,
  ship: "player-ship-a",
};

// Num of max bullets
const PLAYER_MAX_BULLETS = 30;

const BULLET_SPEED_DEFAULT = 0.4;
const BULLET_SPEED_X2 = 0.6;
const BULLET_SPEED_x3 = 0.8;
const MAX_EXPLOSION = 30;
const LABEL_OFFSET = 100;
const COLOR_WHITE = "#F9F0D9";
const COLOR_RED = "#F94A41";
const HORIZONTAL_BOUNDARY_OFFSET = 290;
const VERTICAL_BOUNDARY_OFFSET = 260;

// ASTEROIDS
const SM_ASTEROID_SPEED = 3;
const SM_ASTEROID_MAX = 3; //7;
const SM_ASTEROID_W = 75;
const SM_ASTEROID_H = 69.23;
const SM_ASTEROID_SPAWN_DELAY = 2000;
const SM_ASTEROID_HEALTH = 3;
const SM_ASTEROID_SPRITE = "asteroid-sm-1";

// level one
const LEVEL_ONE_TIME = 240;
const LEVEL_START_MESSAGE = `1st Mission:\n\nGet past the asteroid field!`;
const LEVEL_WINNER_MESSAGE = `Well done cadet! Looks like the academy finally trained a worthy pilot.
\nThat's all the missions for now. Report back in a couple of days for a new mission.
\nDismissed.`;

// MENU STYLES
const MENU_LOGO_STYLES = {
  fontFamily: "Rationale",
  fontSize: 52,
  color: COLOR_RED,
};

const MENU_LINK_STYLES = {
  fontFamily: "Rationale",
  fontSize: 26,
  color: COLOR_WHITE,
};

const MENU_GAME_OVER_STYLES = {
  fontFamily: "Rationale",
  fontSize: 62,
  color: COLOR_RED,
};

// CARD STYLES

// styles for score text
const CARD_VALUE = {
  fontFamily: "Rationale",
  fontSize: 26,
  color: "#F9F0D9",
  wordWrap: { width: 250, useAdvancedWrap: true },
};

// styles for score label
const CARD_LABEL = {
  fontFamily: "Rationale",
  fontSize: 21,
  color: "#F94A41",
};
