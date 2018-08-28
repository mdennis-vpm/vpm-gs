function gseReset(id) {
  renderedAnimationSets.forEach(function(item) {
    item.animation.pause(0);
  });
}

function gsePlay(id) {
  renderedAnimationSets.forEach(function(item) {
    item.animation.play();
  });
}

function gseReplay(id) {
  renderedAnimationSets.forEach(function(item) {
    item.animation.delay(0.25);
    item.animation.restart(true, false);
  });
}
