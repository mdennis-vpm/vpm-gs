function gseReset() {
  renderedAnimationSets.forEach(function(item) {
    item.animation.kill();
    item.animation.pause(0);
    item.animation.delay(item.animDelay);
  });
}

function gsePlay() {
  renderedAnimationSets.forEach(function(item) {
    TweenLite.delayedCall(item.animDelay, function(){item.animation.play()});
  });
}

function gseReplay() {
  renderedAnimationSets.forEach(function(item) {
    item.animation.kill();
    item.animation.delay(item.animDelay);
    item.animation.restart(true, false);
  });
}
