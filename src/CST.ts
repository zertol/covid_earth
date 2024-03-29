export const CST = {
  SCENES: {
    LOAD: "LOAD",
    MAIN: "MAIN",
    GAME: "GAME",
    GAMEPLAY : "GAMEPLAY"
  },
  IMAGES: {
    LOGO: "LOGO",
    BACKGROUND: "BACKGROUND",
    HEARTMETER: "HEARTMETER"
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
    BOLT: "BOLT"
  },
  SOUNDS: {
    GAME_SOUND: "GAME_SOUND",
    FX_SOUNDS: "FX_SOUNDS",
    FX_BEAM: "FX_BEAM",
    FX_EXPLOSION: "FX_EXPLOSION",
    FX_BOMB_FALLING: "FX_BOMB_FALLING",
    MARKERS: {
      GAME_SOUND: "GAME_SOUND",
      FX_BEAM: "FX_BEAM",
      FX_EXPLOSION: "FX_EXPLOSION",
      FX_BOMB_FALLING: "FX_BOMB_FALLING"
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
    BOLT_ANIM: "BOLT_ANIM"
  },
  WINDOW: {
    ISMOBILE: navigator.userAgent.indexOf("Mobile") != -1
  },
  MOD: (NUM1: number, NUM2: number) => {
    return NUM1 - (NUM2 * Math.floor(NUM1 / NUM2));
  }
};
