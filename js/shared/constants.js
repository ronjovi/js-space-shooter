// PLAYER HEALTH
const PLAYER_HEALTH = 200;
// Player fire rate
const PLAYER_FIRE_RATE_DEAFULT = 250;
const PLAYER_FIRE_RATE_X2 = 180;
const PLAYER_FIRE_RATE_X3 = 100;

// Player movement
const PLAYER_VELOCITY_DEFAULT = 200;
const PLAYER_VELOCITY_X2 = 290;
const PLAYER_VELOCITY_X3 = 340;
const PLAYER_PLACEHOLDER = {
  name: "Tommy Trojan",
  phrase: `Fight On!`,
  score: 0,
  ship: "player-ship-a",
};

// Num of max bullets
const PLAYER_MAX_BULLETS = 35;

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
const SM_ASTEROID_SPEED = 4;
const SM_ASTEROID_MAX = 20;
const SM_ASTEROID_W = 75;
const SM_ASTEROID_H = 69.23;
const SM_ASTEROID_SPAWN_DELAY = 700;
const SM_ASTEROID_HEALTH = 3;
const SM_ASTEROID_SPRITE = "asteroid-sm-1";

// ASTEROIDS
const LG_ASTEROID_SPEED = 3.2;
const LG_ASTEROID_MAX = 6;
const LG_ASTEROID_W = 67;
const LG_ASTEROID_H = 56.72;
const LG_ASTEROID_SPAWN_DELAY = 3500;
const LG_ASTEROID_HEALTH = 6;
const LG_ASTEROID_SPRITE = "asteroid-lg-1";


// level one
const LEVEL_ONE_TIME = 120;
const LEVEL_START_MESSAGE = `1st Mission:\n\nGet past the asteroid field!`;
const LEVEL_WINNER_MESSAGE = `Well done cadet! Looks like the academy finally trained a worthy pilot.
\nThat's all the missions for now. Report back in a couple of days for a new mission.`;
const LEVEL_GAME_OVER_MESSAGE = `Tough luck cadet. Better soldiers have failed.\n\nBetter luck next time!`;

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

// Profile Card value styles
const CARD_TEXT_STYLES = {
  fontFamily: "Rationale",
  fontSize: 26,
  color: "#F9F0D9",
  wordWrap: { width: 250, useAdvancedWrap: true },
};

// Profile Card label styles
const CARD_LABEL_STYLES = {
  fontFamily: "Rationale",
  fontSize: 21,
  color: "#F94A41",
};

// Profile Card value styles
const SUMMARY_CARD_VALUE = {
  fontFamily: "Rationale",
  fontSize: 22,
  color: "#F9F0D9",
  wordWrap: { width: 150, useAdvancedWrap: true },
};

// Profile Card label styles
const SUMMARY_CARD_LABEL = {
  fontFamily: "Rationale",
  fontSize: 18,
  color: "#F94A41",
};
