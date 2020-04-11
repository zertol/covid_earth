// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/CST.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CST = {
  SCENES: {
    LOAD: "LOAD",
    MAIN: "MAIN",
    GAME: "GAME"
  },
  IMAGES: {
    LOGO: "LOGO",
    BACKGROUND: "BACKGROUND"
  },
  SPRITES: {
    GLOBE: "GLOBE",
    BEAM: "BEAM",
    BLUECOVID19: "BLUECOVID19",
    GREENCOVID19: "GREENCOVID19",
    REDCOVID19: "REDCOVID19",
    PLAYER: "PLAYER",
    COVID19_EXPLOSION: "COVID19_EXPLOSION"
  },
  ANIMATIONS: {
    EARTH_ANIM: "EARTH_ANIM",
    BEAM_ANIM: "BEAM_ANIM",
    BLUECOVID19_ANIM: "BLUECOVID19_ANIM",
    GREENCOVID19_ANIM: "GREENCOVID19_ANIM",
    REDCOVID19_ANIM: "REDCOVID19_ANIM",
    PLAYER_ANIM: "PLAYER_ANIM",
    COVID19_EXPLOSION_ANIM: "COVID19_EXPLOSION_ANIM"
  },
  WINDOW: {
    ISMOBILE: navigator.userAgent.indexOf("Mobile") != -1
  }
};
},{}],"sprites/spaceship.png":[function(require,module,exports) {
module.exports = "/spaceship.5f2ded83.png";
},{}],"images/zenvalogo.png":[function(require,module,exports) {
module.exports = "/zenvalogo.2dc1a0e3.png";
},{}],"images/background.jpg":[function(require,module,exports) {
module.exports = "/background.565aafb9.jpg";
},{}],"sprites/BreusingGeometric2H.png":[function(require,module,exports) {
module.exports = "/BreusingGeometric2H.6d7f647f.png";
},{}],"sprites/bluevirussprite.png":[function(require,module,exports) {
module.exports = "/bluevirussprite.0e57acd7.png";
},{}],"sprites/greenvirussprite.png":[function(require,module,exports) {
module.exports = "/greenvirussprite.ec3e8ed8.png";
},{}],"sprites/redvirussprite.png":[function(require,module,exports) {
module.exports = "/redvirussprite.ed04ed27.png";
},{}],"src/scripts/gameconfig.json":[function(require,module,exports) {
module.exports = {
  "scoreLevelModulo": 5000,
  "player": {
    "speed": 750
  },
  "enemies": {
    "positions": [{
      "enemy": "blue",
      "position": {
        "x": 0,
        "y": 0
      }
    }, {
      "enemy": "green",
      "position": {
        "x": 0,
        "y": 15
      }
    }, {
      "enemy": "red",
      "position": {
        "x": 0,
        "y": 30
      }
    }]
  },
  "levels": [{
    "levelNumber": 1,
    "virusDistribution": {
      "blue": 1,
      "green": 1,
      "red": 2
    },
    "speedDistribution": {
      "blue": 1.5,
      "green": 2,
      "red": 2.5
    }
  }, {
    "levelNumber": 2,
    "virusDistribution": {
      "blue": 2,
      "green": 2,
      "red": 3
    },
    "speedDistribution": {
      "blue": 1.5,
      "green": 2,
      "red": 2.5
    }
  }, {
    "levelNumber": 3,
    "virusDistribution": {
      "blue": 3,
      "green": 3,
      "red": 4
    },
    "speedDistribution": {
      "blue": 1.8,
      "green": 2.4,
      "red": 3
    }
  }]
};
},{}],"sprites/explosion.png":[function(require,module,exports) {
module.exports = "/explosion.b6bd83f2.png";
},{}],"sprites/bullet.png":[function(require,module,exports) {
module.exports = "/bullet.9bb2eab7.png";
},{}],"src/scenes/LoadingScene.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var CST_1 = require("../CST"); //@ts-ignore


var spaceship_png_1 = __importDefault(require("../../sprites/spaceship.png")); //@ts-ignore


var zenvalogo_png_1 = __importDefault(require("../../images/zenvalogo.png")); //@ts-ignore


var background_jpg_1 = __importDefault(require("../../images/background.jpg")); //@ts-ignore


var BreusingGeometric2H_png_1 = __importDefault(require("../../sprites/BreusingGeometric2H.png")); //@ts-ignore


var bluevirussprite_png_1 = __importDefault(require("../../sprites/bluevirussprite.png")); //@ts-ignore


var greenvirussprite_png_1 = __importDefault(require("../../sprites/greenvirussprite.png")); //@ts-ignore


var redvirussprite_png_1 = __importDefault(require("../../sprites/redvirussprite.png")); //@ts-ignore


var gameconfig_json_1 = __importDefault(require("../scripts/gameconfig.json")); //@ts-ignore


var explosion_png_1 = __importDefault(require("../../sprites/explosion.png")); //@ts-ignore


var bullet_png_1 = __importDefault(require("../../sprites/bullet.png"));

var LoadingScene =
/** @class */
function (_super) {
  __extends(LoadingScene, _super);

  function LoadingScene() {
    return _super.call(this, {
      key: CST_1.CST.SCENES.LOAD
    }) || this;
  }

  LoadingScene.prototype.preload = function () {
    var _this = this;

    var width = this.game.renderer.width;
    var height = this.game.renderer.height;
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 150, height / 2 - 25, 300, 50);
    this.load.json('levelsData', gameconfig_json_1.default);
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff"
      }
    });
    loadingText.setOrigin(0.5, 0.5);
    var percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: "0%",
      style: {
        font: "18px monospace",
        fill: "#ffffff"
      }
    });
    percentText.setOrigin(0.5, 0.5);
    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: "18px monospace",
        fill: "#ffffff"
      }
    });
    assetText.setOrigin(0.5, 0.5);
    this.load.on("progress", function (value) {
      //@ts-ignore
      percentText.setText(parseInt(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1); //@ts-ignore

      progressBar.fillRect(width / 2 - 140, height / 2 - 15, 280 * value, 30);
    }); //@ts-ignore

    var files = [];
    this.load.on("fileprogress", function (file) {
      //@ts-ignore
      assetText.setText("Loading asset: " + file.key);
      files.push(file);
    });
    this.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();

      for (var i = 0; i < 100; i++) {
        //@ts-ignore
        files[i].destroy();
      }

      setTimeout(function () {
        _this.scene.start(CST_1.CST.SCENES.MAIN);
      }, 1000);
    });
    this.load.image(CST_1.CST.IMAGES.LOGO, zenvalogo_png_1.default);

    for (var i = 0; i < 100; i++) {
      this.load.image(CST_1.CST.IMAGES.LOGO + i, zenvalogo_png_1.default);
    }

    this.load.image(CST_1.CST.IMAGES.BACKGROUND, background_jpg_1.default);
    this.load.spritesheet(CST_1.CST.SPRITES.BEAM, bullet_png_1.default, {
      frameWidth: 42,
      frameHeight: 72
    });
    this.load.spritesheet(CST_1.CST.SPRITES.GLOBE, BreusingGeometric2H_png_1.default, {
      frameWidth: 1000,
      frameHeight: 990
    });
    this.load.spritesheet(CST_1.CST.SPRITES.BLUECOVID19, bluevirussprite_png_1.default, {
      frameWidth: 266,
      frameHeight: 266
    });
    this.load.spritesheet(CST_1.CST.SPRITES.GREENCOVID19, greenvirussprite_png_1.default, {
      frameWidth: 266,
      frameHeight: 266
    });
    this.load.spritesheet(CST_1.CST.SPRITES.REDCOVID19, redvirussprite_png_1.default, {
      frameWidth: 266,
      frameHeight: 266
    });
    this.load.spritesheet(CST_1.CST.SPRITES.PLAYER, spaceship_png_1.default, {
      frameWidth: 512,
      frameHeight: 512
    });
    this.load.spritesheet(CST_1.CST.SPRITES.COVID19_EXPLOSION, explosion_png_1.default, {
      frameWidth: 128,
      frameHeight: 128
    });
  };

  LoadingScene.prototype.create = function () {
    var logo = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, CST_1.CST.IMAGES.LOGO);
    this.anims.create({
      key: CST_1.CST.ANIMATIONS.EARTH_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST_1.CST.SPRITES.GLOBE),
      frameRate: 0.7,
      repeat: -1
    });
    this.anims.create({
      key: CST_1.CST.ANIMATIONS.BLUECOVID19_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST_1.CST.SPRITES.BLUECOVID19, {
        start: 0,
        end: 2
      }),
      frameRate: 15,
      repeat: 0
    });
    this.anims.create({
      key: CST_1.CST.ANIMATIONS.GREENCOVID19_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST_1.CST.SPRITES.GREENCOVID19, {
        start: 0,
        end: 3
      }),
      frameRate: 15,
      repeat: 0
    });
    this.anims.create({
      key: CST_1.CST.ANIMATIONS.REDCOVID19_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST_1.CST.SPRITES.REDCOVID19, {
        start: 0,
        end: 4
      }),
      frameRate: 15,
      repeat: 0
    });
    this.anims.create({
      key: CST_1.CST.ANIMATIONS.PLAYER_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST_1.CST.SPRITES.PLAYER),
      frameRate: 25,
      repeat: -1
    });
    this.anims.create({
      key: CST_1.CST.ANIMATIONS.COVID19_EXPLOSION_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST_1.CST.SPRITES.COVID19_EXPLOSION),
      frameRate: 128,
      repeat: 0,
      hideOnComplete: true
    });
    this.anims.create({
      key: CST_1.CST.ANIMATIONS.BEAM_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST_1.CST.SPRITES.BEAM),
      frameRate: 20,
      repeat: -1
    });
  };

  return LoadingScene;
}(Phaser.Scene);

exports.LoadingScene = LoadingScene;
},{"../CST":"src/CST.ts","../../sprites/spaceship.png":"sprites/spaceship.png","../../images/zenvalogo.png":"images/zenvalogo.png","../../images/background.jpg":"images/background.jpg","../../sprites/BreusingGeometric2H.png":"sprites/BreusingGeometric2H.png","../../sprites/bluevirussprite.png":"sprites/bluevirussprite.png","../../sprites/greenvirussprite.png":"sprites/greenvirussprite.png","../../sprites/redvirussprite.png":"sprites/redvirussprite.png","../scripts/gameconfig.json":"src/scripts/gameconfig.json","../../sprites/explosion.png":"sprites/explosion.png","../../sprites/bullet.png":"sprites/bullet.png"}],"src/scenes/MainScene.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var CST_1 = require("../CST");

var MainScene =
/** @class */
function (_super) {
  __extends(MainScene, _super);

  function MainScene() {
    return _super.call(this, {
      key: CST_1.CST.SCENES.MAIN
    }) || this;
  }

  MainScene.prototype.preload = function () {};

  MainScene.prototype.create = function () {
    var _this = this;

    this.add.tileSprite(0, 0, this.game.renderer.width, this.game.renderer.height, CST_1.CST.IMAGES.BACKGROUND).setOrigin(0, 0).setDepth(0);
    var playButton = this.make.text({
      x: this.game.renderer.width / 2,
      y: this.game.renderer.height / 2 - 25,
      origin: {
        x: 0.5,
        y: 0.5
      },
      text: "Start Game",
      padding: 10,
      style: {
        font: "40px monospace",
        fill: "#ffffff",
        backgroundColor: "rgba(255,255,255,0.2)"
      }
    }).setDepth(1);

    if (CST_1.CST.WINDOW.ISMOBILE) {
      playButton.setFontSize(30);
    }

    playButton.setInteractive({
      useHandCursor: true
    });
    playButton.on("pointerup", function () {
      _this.scene.start(CST_1.CST.SCENES.GAME);
    });
  };

  return MainScene;
}(Phaser.Scene);

exports.MainScene = MainScene;
},{"../CST":"src/CST.ts"}],"src/sprites/Explosion.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Explosion =
/** @class */
function (_super) {
  __extends(Explosion, _super);

  function Explosion(scene, x, y, name, animation) {
    var _this = _super.call(this, scene, x, y, name) || this;

    _this.animation = animation;
    scene.add.existing(_this);

    _this.play(_this.animation);

    scene.physics.world.enableBody(_this);
    return _this;
  }

  Explosion.prototype.update = function () {};

  return Explosion;
}(Phaser.GameObjects.Sprite);

exports.default = Explosion;
},{}],"src/sprites/Virus.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Explosion_1 = __importDefault(require("./Explosion"));

var Virus =
/** @class */
function (_super) {
  __extends(Virus, _super);

  function Virus(scene, x, y, name, animation, depth, speed) {
    var _this = _super.call(this, scene, x, y, name) || this; //If we ever needed to differentiate between enemy textures


    _this.getName = function () {
      return _this.name;
    }; //Set speed for viruses. Can be used to increase speed for each level


    _this.setSpeed = function (speed) {
      _this.speed = speed;
    };

    _this.hitEarth = function (explosionName, explosionAnimation) {
      var explosion = new Explosion_1.default(_this.scene, _this.x, _this.y, explosionName, explosionAnimation);

      _this.resetVirusPos();
    };

    _this.moveVirus = function () {
      _this.y += _this.speed;
      _this.rotation += 0.08;

      if (_this.y > _this.scene.game.renderer.height) {
        _this.resetVirusPos();
      }
    };

    _this.resetVirusPos = function () {
      _this.y = 0;
      var randomX = Math.floor(Math.random() * _this.scene.game.renderer.width) + 10;
      _this.x = randomX;
    };

    _this.animation = animation;
    _this.depth = depth;
    _this.name = name;
    _this.speed = speed;
    scene.add.existing(_this);

    _this.setInteractive();

    _this.play(_this.animation);

    scene.physics.world.enableBody(_this);
    return _this;
  }

  Virus.prototype.update = function () {};

  return Virus;
}(Phaser.GameObjects.Sprite);

exports.default = Virus;
},{"./Explosion":"src/sprites/Explosion.ts"}],"src/sprites/Beam.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Beam =
/** @class */
function (_super) {
  __extends(Beam, _super);

  function Beam(scene, x, y, name, animation, depth) {
    var _this = _super.call(this, scene, x, y, name) || this;

    _this.animation = animation;
    _this.depth = depth;
    scene.add.existing(_this);

    _this.play(_this.animation);

    scene.physics.world.enableBody(_this); //@ts-ignore

    _this.body.velocity.y = -250;
    return _this;
  }

  Beam.prototype.update = function () {
    if (this.y < 8) {
      this.destroy();
    }
  };

  return Beam;
}(Phaser.GameObjects.Sprite);

exports.default = Beam;
},{}],"src/scenes/GameScene.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var CST_1 = require("../CST");

var Virus_1 = __importDefault(require("../sprites/Virus"));

var Beam_1 = __importDefault(require("../sprites/Beam"));

var Explosion_1 = __importDefault(require("../sprites/Explosion"));

var GameScene =
/** @class */
function (_super) {
  __extends(GameScene, _super);

  function GameScene() {
    var _this = _super.call(this, {
      key: CST_1.CST.SCENES.GAME
    }) || this;
    /******************************************* End Creation Part *************************************************/


    _this.returnToEarth = function (player, globe) {};

    _this.hurtPlayer = function (player, enemy) {
      enemy.resetVirusPos();

      if (player.alpha < 1) {
        return;
      }

      var explosion = new Explosion_1.default(_this, player.x, player.y, CST_1.CST.SPRITES.COVID19_EXPLOSION, CST_1.CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);
      player.disableBody(true, true);

      _this.time.addEvent({
        delay: 1000,
        callback: _this.resetPlayer,
        callbackScope: _this,
        loop: false
      });
    };

    _this.zeroPad = function (number, size) {
      var stringNumber = String(number);

      while (stringNumber.length < (size || 2)) {
        stringNumber = "0" + stringNumber;
      }

      return stringNumber;
    };

    _this.resetPlayer = function () {
      //@ts-ignore
      _this.player.enableBody(true, _this.player.initialX, _this.game.renderer.height, true, true);

      _this.player.alpha = 0.5;

      var tween = _this.tweens.add({
        targets: _this.player,
        //@ts-ignore
        y: _this.player.initialY,
        duration: 1500,
        repeat: 0,
        onComplete: function onComplete() {
          //@ts-ignore
          _this.player.alpha = 1;
        },
        callbackScope: _this
      });
    };

    _this.hitEarth = function (globe, enemy) {
      globe.setAlpha(globe.alpha - 0.1);

      if (globe.alpha <= 0) {
        _this.add.text(_this.game.renderer.width / 2 - _this.player.body.width / 2, _this.game.renderer.height / 2, "You just lost :(");

        _this.enemies.clear(true);

        return;
      } //@ts-ignore


      enemy.hitEarth(CST_1.CST.SPRITES.COVID19_EXPLOSION, CST_1.CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);
    };

    _this.adjustGlobeBarrier = function () {
      var widthToAjdust = _this.game.renderer.width - _this.globe.width; //@ts-ignore

      _this.globe.body.offset.x = -widthToAjdust / 2; //@ts-ignore

      _this.globe.body.width += widthToAjdust;
    };

    _this.loadEnemiesByLevel = function (levelNumber) {
      //@ts-ignore
      var levels = _this.levelsData.levels.filter(function (x) {
        return x.levelNumber == levelNumber;
      });

      if (levels.length > 0) {
        var level = levels[0]; //@ts-ignore

        var virusDistribution = level.virusDistribution;
        var speedDistribution = level.speedDistribution;

        for (var virusKey in level.virusDistribution) {
          var key = virusKey.toUpperCase();

          _this.addVirusCollection( //@ts-ignore
          CST_1.CST.ANIMATIONS[key + "COVID19_ANIM"], //@ts-ignore
          CST_1.CST.SPRITES[key + "COVID19"], virusDistribution[virusKey], speedDistribution[virusKey]);
        }
      }
    };

    _this.addVirusCollection = function (animationKey, virusType, numberOfVirusToAdd, speed) {
      for (var k = 0; k < numberOfVirusToAdd; k++) {
        var virusToAdd = new Virus_1.default(_this, Math.floor(Math.random() * _this.game.renderer.width) + 10, //@ts-ignore
        Math.floor(Math.random() * 50) + 1, virusType, animationKey, 1, speed); //@ts-ignore

        virusToAdd.body.setSize(75, 75, true);

        _this.enemies.add(virusToAdd);
      }
    };

    _this.shootBeam = function () {
      var beam1 = new Beam_1.default(_this, _this.player.x + 20, _this.player.y - 30, CST_1.CST.SPRITES.BEAM, CST_1.CST.ANIMATIONS.BEAM_ANIM, 1).setScale(0.5);

      _this.projectiles.add(beam1);

      var beam2 = new Beam_1.default(_this, _this.player.x - 20, _this.player.y - 30, CST_1.CST.SPRITES.BEAM, CST_1.CST.ANIMATIONS.BEAM_ANIM, 1).setScale(0.5);

      _this.projectiles.add(beam2);
    };

    _this.hitVirus = function (projectile, virus) {
      var explosion = new Explosion_1.default(_this, virus.x, virus.y, CST_1.CST.SPRITES.COVID19_EXPLOSION, CST_1.CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);
      projectile.destroy();
      virus.resetVirusPos(); //Update score

      _this.score += 10;
      _this.scoreLabel.text = "Score: " + _this.zeroPad(_this.score, 6); //@ts-ignore

      if (_this.score % _this.levelsData.scoreLevelModulo == 0) {
        _this.levelReach += 1; //@ts-ignore

        var levels = _this.levelsData.levels.filter(function (x) {
          return x.levelNumber == _this.levelReach;
        });

        if (levels.length > 0) {
          _this.levelLabel.text = "Level: " + _this.levelReach;

          _this.enemies.clear(true);

          _this.loadEnemiesByLevel(_this.levelReach);
        }
      }
    };

    _this.movePlayerManager = function () {
      //@ts-ignore
      var playerSpeed = _this.levelsData.player.speed; //@ts-ignore

      if (_this.cursorKeys.right.isDown) {
        _this.player.setVelocityX(playerSpeed);
      } //@ts-ignore
      else if (_this.cursorKeys.left.isDown) {
          _this.player.setVelocityX(-playerSpeed);
        } else {
          _this.player.setVelocityX(0);
        } //@ts-ignore


      if (_this.cursorKeys.up.isDown) {
        _this.player.setVelocityY(-playerSpeed);
      } //@ts-ignore
      else if (_this.cursorKeys.down.isDown) {
          _this.player.setVelocityY(playerSpeed);
        } else {
          _this.player.setVelocityY(0);
        }
    };

    return _this;
  }

  GameScene.prototype.preload = function () {
    this.levelsData = this.cache.json.get("levelsData");
    this.lastFired = 0;
  };

  GameScene.prototype.create = function () {
    this.background = this.add.tileSprite(0, 0, this.game.renderer.width, this.game.renderer.height, CST_1.CST.IMAGES.BACKGROUND).setOrigin(0, 0).setDepth(0);
    this.globe = this.physics.add.sprite(this.game.renderer.width / 2, this.game.renderer.height + 450, CST_1.CST.SPRITES.GLOBE).setDepth(1).setImmovable(true); //@ts-ignore

    this.globe.play(CST_1.CST.ANIMATIONS.EARTH_ANIM);
    this.projectiles = this.add.group();
    this.player = this.physics.add.sprite(this.game.renderer.width / 2 - 8, this.game.renderer.height - 130, CST_1.CST.SPRITES.PLAYER).setScale(0.2, 0.2).setDepth(1); //@ts-ignore

    this.player.initialX = this.player.x; //@ts-ignore

    this.player.initialY = this.player.y;
    this.player.play(CST_1.CST.ANIMATIONS.PLAYER_ANIM);
    this.player.setCollideWorldBounds(true);
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enemies = this.physics.add.group(); //Load level 1 of the game ---- mode EASY ----

    this.loadEnemiesByLevel(1);
    this.adjustGlobeBarrier(); //The single Sprite comes before a group so the order is single,group in the callback function
    //this.physics.add.overlap(this.enemies, this.globe, this.hitEarth, undefined, this);

    this.physics.add.collider(this.enemies, this.globe, this.hitEarth, undefined, this);
    this.physics.add.collider(this.player, this.globe, this.returnToEarth, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, //@ts-ignore
    this.hurtPlayer, null, this);
    this.physics.add.overlap(this.projectiles, this.enemies, //@ts-ignore
    this.hitVirus, null, this);
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    if (CST_1.CST.WINDOW.ISMOBILE) {
      this.globe.y += 60;
    }

    this.score = 0;
    this.scoreLabel = this.make.text({
      x: 10,
      y: 5,
      origin: {
        x: 0,
        y: 0
      },
      text: "Score: " + this.zeroPad(this.score, 6),
      padding: 0,
      style: {
        font: "16px monospace",
        fill: "#ffffff"
      }
    });
    this.levelReach = 1;
    this.levelLabel = this.make.text({
      x: 10,
      y: this.scoreLabel.height + 5,
      origin: {
        x: 0,
        y: 0
      },
      text: "Level: " + this.levelReach,
      padding: 0,
      style: {
        font: "16px monospace",
        fill: "#ffffff"
      }
    });
  };

  GameScene.prototype.update = function (time) {
    this.background.tilePositionY -= 1;
    this.globe.rotation += 0.009;
    var children = this.enemies.getChildren();

    for (var index = 0; index < children.length; index++) {
      var enemy = children[index]; //@ts-ignore

      enemy.moveVirus(enemy.speed);
    }

    this.movePlayerManager(); //Continuous Spacebar Fire

    if (this.spacebar.isDown && time > this.lastFired) {
      if (this.player.active) {
        this.shootBeam();
        this.lastFired = time + 150;
      }

      ;
    }

    children = this.projectiles.getChildren();

    for (var i = 0; i < children.length; i++) {
      var beam = children[i];
      beam.update();
    }
  };

  return GameScene;
}(Phaser.Scene);

exports.GameScene = GameScene;
},{"../CST":"src/CST.ts","../sprites/Virus":"src/sprites/Virus.ts","../sprites/Beam":"src/sprites/Beam.ts","../sprites/Explosion":"src/sprites/Explosion.ts"}],"src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var LoadingScene_1 = require("./scenes/LoadingScene");

var MainScene_1 = require("./scenes/MainScene");

var GameScene_1 = require("./scenes/GameScene");

var CST_1 = require("./CST"); //Scaling manually the canvas for a better display on different devices.


var w = window.innerWidth;
var h = window.innerHeight;

if (!CST_1.CST.WINDOW.ISMOBILE) {
  w = 768;
} //Start the game object


var game = new Phaser.Game({
  parent: 'game-container',
  height: h,
  width: w,
  scene: [LoadingScene_1.LoadingScene, MainScene_1.MainScene, GameScene_1.GameScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  }
});
},{"./scenes/LoadingScene":"src/scenes/LoadingScene.ts","./scenes/MainScene":"src/scenes/MainScene.ts","./scenes/GameScene":"src/scenes/GameScene.ts","./CST":"src/CST.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "1110" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map