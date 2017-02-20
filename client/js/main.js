var init = require('./init');
var game = require('./game');

var state = {};

var main = function() {
  init(state, mainLoop).then(function() {
    game.setup();
    state.update = game.play;
  }).then(null, function(err) {
    console.log(err);
  });
}

var mainLoop = function(renderer, stage) {
  var timeDelta;
  var timestamp = Date.now();

  var loop = function(ts) {
    timeDelta = ts - timestamp;
    timestamp = ts;

    requestAnimationFrame(loop);
    state.update(timeDelta);
    renderer.render(stage);
  }

  loop();
}

main();
