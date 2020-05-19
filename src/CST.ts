export const CST = {
  TITLE: "COVID WAR",
  SCENES: {
    LOAD: "LOAD",
    MAIN: "MAIN",
    GAME: "GAME",
    CONTROLS: "CONTROLS",
    GAMEPLAY: "GAMEPLAY",
    OPENING: "OPENING",
    LEADERBOARD: "LEADERBOARD"
  },
  IMAGES: {
    LOGO: "LOGO",
    DEV_LOGO: "DEV_LOGO",
    BACKGROUND: "BACKGROUND",
    HEARTMETER: "HEARTMETER",
    UP_ARROW: "UP_ARROW",
    DOWN_ARROW: "DOWN_ARROW",
    LEFT_ARROW: "LEFT_ARROW",
    RIGHT_ARROW: "RIGHT_ARROW",
    SPACEBAR: "SPACEBAR",
    TOUCH_FINGER: "TOUCH_FINGER",
    SWIPE_FINGER: "SWIPE_FINGER",
    BACK_BUTTON: "BACK_BUTTON",
    EXIT_BUTTON: "EXIT_BUTTON",
    OK_BUTTON: "OK_BUTTON",
    CANCEL_BUTTON: "CANCEL_BUTTON",
    MUTE_BUTTON: "MUTE_BUTTON",
    UNMUTE_BUTTON: "UNMUTE_BUTTON"
  },
  SPRITES: {
    GLOBE: "GLOBE",
    BEAM: "BEAM",
    BLUECOVID19: "BLUECOVID19",
    GREENCOVID19: "GREENCOVID19",
    REDCOVID19: "REDCOVID19",
    PLAYER: "PLAYER",
    COVID19_EXPLOSION: "COVID19_EXPLOSION",
    POWERUPS: "POWERUPS",
    SHIELDS: "SHIELDS",
    BACERIA_BOMB: "BACTERIA_BOMB",
    BOLT: "BOLT",
    BLUECOVID19_GAMEPLAY: "BLUECOVID19_GAMEPLAY",
    GREENCOVID19_GAMEPLAY: "GREENCOVID19_GAMEPLAY",
    REDCOVID19_GAMEPLAY: "REDCOVID19_GAMEPLAY",
  },
  SOUNDS: {
    GAME_SOUND: "GAME_SOUND",
    FX_SOUNDS: "FX_SOUNDS",
    FX_BEAM: "FX_BEAM",
    FX_EXPLOSION: "FX_EXPLOSION",
    FX_BOMB_FALLING: "FX_BOMB_FALLING",
    INTRO: "INTRO",
    MARKERS: {
      GAME_SOUND: "GAME_SOUND",
      FX_BEAM: "FX_BEAM",
      FX_EXPLOSION: "FX_EXPLOSION",
      FX_BOMB_FALLING: "FX_BOMB_FALLING",
      INTRO: "INTRO"
    }
  },
  ANIMATIONS: {
    EARTH_ANIM: "EARTH_ANIM",
    BEAM_ANIM: "BEAM_ANIM",
    BEAMRED_ANIM: "BEAMRED_ANIM",
    BLUECOVID19_ANIM: "BLUECOVID19_ANIM",
    GREENCOVID19_ANIM: "GREENCOVID19_ANIM",
    REDCOVID19_ANIM: "REDCOVID19_ANIM",
    PLAYER_ANIM: "PLAYER_ANIM",
    COVID19_EXPLOSION_ANIM: "COVID19_EXPLOSION_ANIM",
    LIFEPOWERUP_ANIM: "LIFEPOWERUP_ANIM",
    BEAMPOWERUP_ANIM: "BEAMPOWERUP_ANIM",
    DESTROYALLCURRENTPOWERUP_ANIM: "DESTROYALLCURRENTPOWERUP_ANIM",
    FINISHLVLPOWERUP_ANIM: "FINISHLVLPOWERUP_ANIM",
    SHIELDPOWERUP_ANIM: "SHIELDPOWERUP_ANIM",
    SCOREPOWERUP_ANIM: "SCOREPOWERUP_ANIM",
    REPLICAPOWERUP_ANIM: "REPLICAPOWERUP_ANIM",
    GALACTICLASERPOWERUP_ANIM: "GALACTICLASERPOWERUP_ANIM",
    SHIELD_ANIM: "SHIELD_ANIM",
    BACTERIA_BOMB_ANIM: "BACTERIA_BOMB_ANIM",
    BOLT_ANIM: "BOLT_ANIM",
    BLUECOVID19_GAMEPLAY_ANIM: "BLUECOVID19_GAMEPLAY_ANIM",
    GREENCOVID19_GAMEPLAY_ANIM: "GREENCOVID19_GAMEPLAY_ANIM",
    REDCOVID19_GAMEPLAY_ANIM: "REDCOVID19_GAMEPLAY_ANIM",
  },
  WINDOW: {
    ISMOBILE: navigator.userAgent.indexOf("Mobile") != -1
  },
  MOD: (NUM1: number, NUM2: number) => {
    return NUM1 - (NUM2 * Math.floor(NUM1 / NUM2));
  }
};
