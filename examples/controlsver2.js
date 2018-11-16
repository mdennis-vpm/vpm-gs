function gseReset() {
  renderedAnimationSets.forEach(function(item) {
    item.gs.kill();
    item.gs.pause(0);
    item.gs.delay(item.animDelay);
  });
}

function gsePlay() {
  renderedAnimationSets.forEach(function(item) {
    TweenLite.delayedCall(item.animDelay, function(){item.gs.play()});
  });
}

function gseReplay() {
  renderedAnimationSets.forEach(function(item) {
    console.log("replaying " + item.element);
    item.gs.kill();
    item.gs.delay(item.animDelay);
    item.gs.restart(true, false);
    console.log("done " + item.element);
  });
}

var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
  '+': '<br>',
  '_': '&nbsp;&nbsp;'
};

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/+_]/g, function (s) {
    return entityMap[s];
  });
}

if ($('#gse-example').length !== 0) {
  var elem = $('#gse-strip')[0].innerHTML;
  elem = elem.replace(/ style="[^"]*"/g, "");
  $('#gse-strip').html(escapeHtml(elem));
}
