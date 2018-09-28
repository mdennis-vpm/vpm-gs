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
  //elem = elem.replace(/<br>/g, "&#10;");
  //console.log(elem);
  //var str = escapeHtml(elem.innerHTML);
  $('#gse-strip').html(escapeHtml(elem));
}
