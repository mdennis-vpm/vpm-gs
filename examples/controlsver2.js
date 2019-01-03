function gseReset() {
  for (var obj of animObjectList) {
    //obj.animation.kill();
    //obj.animation.pause(0);
    //obj.animation.delay(obj.animDelay);
    //obj.hasRun = false;
    //obj.animRunFlag = false;
    obj.resetAnimation();
    obj.watchAnimationTrigger();
  }
}

function gsePlay() {
  for (var obj of animObjectList) {
    runAnimation(obj);
  }
}

function gseReplay() {
  for (var obj of animObjectList) {
    console.log("replaying " + obj.element);
    obj.animation.kill();
    obj.animation.delay(obj.animDelay);
    obj.animation.restart(true, false);
    console.log("done " + obj.animTarget);
  }
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
