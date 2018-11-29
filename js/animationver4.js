/*

- [x] Get all elements containing class name with "gs-"
- [x] Create new animation object for each element
- [x] Check element for animType class
- [x] Update object's animProps
- [x] Check element for animTrigger class
- [x] Update object's animTrigger
- [x] Check element for enhancement classes
- [x] Update object parameters for enhancements
- [x] Generate new GSAP animations using assembled animation objects
- [x] Set and watch each animation's triggers
- [ ] Technically, it's done! Expand with additional functional features

*/

// ========================================================================= //
// ===== Globals ===== //

// Generic constants.
const WINDOW_WIDTH = $(window).width(),
      WINDOW_HEIGHT = $(window).height(),
      LIBRARY_BASE_PREFIX = 'vpa-',
      LIBRARY_BASE_CLASS = '[class*="' + LIBRARY_BASE_PREFIX + '"]';

// Default animation property values.
const DEFAULT_ANIM_TRIGGER = 'autoplay',
      DEFAULT_ANIM_PROPS = { opacity: "0", ease: Power2.easeOut },
      DEFAULT_ANIM_EASING = { ease: Power2.easeOut },
      DEFAULT_ANIM_DURATION = 0.5,
      DEFAULT_ANIM_DELAY = 0.2,
      //DEFAULT_ANIM_PLAYBACK = 'forward',

// Non-default animation values.
      ANIM_PROPS_FADE_IN = { opacity: '1', ease: Power2.easeOut },
      ANIM_PROPS_FADE_OUT = { opacity: '0', ease: Power2.easeOut},

      ANIM_PROPS_SLIDE_UP = { top: "-75px", ease: Power3.easeOut },
      ANIM_PROPS_SLIDE_DOWN = { top: "75px", ease: Power3.easeOut };

      ANIM_TRIGGER_AUTOPLAY = 'autoplay',
      ANIM_TRIGGER_SCROLL_TO = 'scroll-to',
      ANIM_TRIGGER_FOCUS = 'focus',
      ANIM_TRIGGER_CLICK = 'click',
      ANIM_TRIGGER_HOVER = 'hover';

      ANIM_DELAY_NONE = 0,
      ANIM_DELAY_SHORT = 0.1,
      ANIM_DELAY_LONG = 0.5,
      ANIM_DELAY_XLONG = 1,

      ANIM_DURATION_XSHORT = 0.1,
      ANIM_DURATION_SHORT = 0.25,
      ANIM_DURATION_LONG = 1,
      ANIM_DURATION_XLONG = 2,
      ANIM_DURATION_XXLONG = 3,
      ANIM_DURATION_XXXLONG = 5;

      //ANIM_PLAY_FORWARD = 'forward',
      //ANIM_PLAY_REVERSE = 'reverse';

// Variables
var animTargetList = [];
var animObjectList = [];

// ========================================================================= //
// ===== Support Functions ===== //

// Check if an element with the specified class name exists.
function elementExists(element) {
  return ($('.' + element).length > 0);
}

// ========================================================================= //
// =====  ===== //

// Populate vpaList with every element that has
// at least one class containing the string "vpa-".
function getElementList(searchClass) {
  console.log('%c getElementsList...', 'color: teal');
  var rtn = [];
  $(searchClass).each(function() {
    rtn.push($(this));
  });
  console.log('%c Done!', 'color: green');
  return rtn;
}

// Create an object for each item in the given array,
// push each new object into return array.
function createAnimationObjects(sourceList) {
  console.log('%c createAnimationObjects...', 'color: teal');
  var rtn = [];
  sourceList.forEach(function(item) {
    rtn.push({
      animTarget: item,
      animProps: DEFAULT_ANIM_PROPS,
      animDuration: DEFAULT_ANIM_DURATION,
      animDelay: DEFAULT_ANIM_DELAY,
      animHasRun: false,
      //animPlayback: DEFAULT_ANIM_PLAYBACK
    });
  });
  console.log('%c Done!', 'color: green');
  return rtn;
}

// Look through the classes in each object in the list,
// if any classes match a library preset, apply those animation properties,
// if no match is found, give it the default.
function assignAnimTypes(objList) {
  console.log('%c assignAnimTypes...', 'color: teal');

  objList.forEach(function(obj) {
    var animTypeFound = false;

    for (var itemClass of obj.animTarget[0].classList) {
      switch (itemClass) {
        case LIBRARY_BASE_PREFIX + 'fade-in':
          //obj.animTarget[0].style.opacity = '0';
          //obj.animProps = Object.assign({}, ANIM_PROPS_FADE_IN);
          $.extend(true, obj.animProps, ANIM_PROPS_FADE_IN);
          //animTypeFound = true;
          //console.log("1");
          break;
        case LIBRARY_BASE_PREFIX + 'fade-out':
          //obj.animTarget[0].style.opacity = '1';
          //obj.animProps = Object.assign({}, ANIM_PROPS_FADE_OUT);
          $.extend(true, obj.animProps, ANIM_PROPS_FADE_OUT);
          //animTypeFound = true;
          //console.log("2");
          break;
        case LIBRARY_BASE_PREFIX + 'slide-up':
          //obj.animProps = Object.assign({}, ANIM_PROPS_SLIDE_UP);
          $.extend(true, obj.animProps, ANIM_PROPS_SLIDE_UP);
          //animTypeFound = true;
          //console.log("3");
          break;
        case LIBRARY_BASE_PREFIX + 'slide-down':
          ///obj.animProps = Object.assign({}, ANIM_PROPS_SLIDE_DOWN);
          $.extend(true, obj.animProps, ANIM_PROPS_SLIDE_DOWN);
          //animTypeFound = true;
          //console.log("4");
          break;
        default:
          break;
      }
      //if (animTypeFound) return;
    }
    //if (!animTypeFound) obj.animProps = DEFAULT_ANIM_PROPS;
  });
  console.log('%c Done!', 'color: green');
}

// Look through the classes in each object in the list,
// if any classes match a library preset, apply that animation trigger,
// if no match is found, give it the default.
function assignAnimTriggers(objList) {
  console.log('%c assignAnimTriggers...', 'color: teal');

  objList.forEach(function(obj) {
    var animTriggerFound = false;

    for (var itemClass of obj.animTarget[0].classList) {
      switch (itemClass) {
        case LIBRARY_BASE_PREFIX + 'autoplay':
          obj.animTrigger = ANIM_TRIGGER_AUTOPLAY;
          animTriggerFound = !animTriggerFound;
          break;
        case LIBRARY_BASE_PREFIX + 'on-scroll-to':
          obj.animTrigger = ANIM_TRIGGER_SCROLL_TO;
          animTriggerFound = !animTriggerFound;
          break;
        case LIBRARY_BASE_PREFIX + 'on-focus':
          obj.animTrigger = ANIM_TRIGGER_FOCUS;
          animTriggerFound = !animTriggerFound;
          break;
        case LIBRARY_BASE_PREFIX + 'on-hover':
          obj.animTrigger = ANIM_TRIGGER_HOVER;
          animTriggerFound = !animTriggerFound;
          break;
        case LIBRARY_BASE_PREFIX + 'on-click':
          obj.animTrigger = ANIM_TRIGGER_CLICK;
          animTriggerFound = !animTriggerFound;
          break;
        default:
          break;
      }
      if (animTriggerFound) return;
    }
    if (!animTriggerFound) obj.animTrigger = DEFAULT_ANIM_TRIGGER;
  });
  console.log('%c Done!', 'color: green');
}

// Look through the classes in each object in the list,
// if any classes match a library preset, apply that animation enhancement.
// Function only stops after all classes are checked.
function assignAnimEnhancements(objList) {
  console.log('%c assignAnimEnhancements...', 'color: teal');

  objList.forEach(function(obj) {
    for (var itemClass of obj.animTarget[0].classList) {
      switch (itemClass) {
        case LIBRARY_BASE_PREFIX + 'delay-none':
          obj.animDelay = ANIM_DELAY_NONE;
          break;
        case LIBRARY_BASE_PREFIX + 'delay-short':
          obj.animDelay = ANIM_DELAY_SHORT;
          break;
        case LIBRARY_BASE_PREFIX + 'delay-long':
          obj.animDelay = ANIM_DELAY_LONG;
          break;
        case LIBRARY_BASE_PREFIX + 'delay-xlong':
          obj.animDelay = ANIM_DELAY_XLONG;
          break;
        case LIBRARY_BASE_PREFIX + 'xfast':
          obj.animDuration = ANIM_DURATION_XSHORT;
          break;
        case LIBRARY_BASE_PREFIX + 'fast':
          obj.animDuration = ANIM_DURATION_SHORT;
          break;
        case LIBRARY_BASE_PREFIX + 'slow':
          obj.animDuration = ANIM_DURATION_LONG;
          break;
        case LIBRARY_BASE_PREFIX + 'xslow':
          obj.animDuration = ANIM_DURATION_XLONG;
          break;
        case LIBRARY_BASE_PREFIX + 'xxslow':
          obj.animDuration = ANIM_DURATION_XXLONG;
          break;
        case LIBRARY_BASE_PREFIX + 'xxxslow':
          obj.animDuration = ANIM_DURATION_XXXLONG;
          break;
        case LIBRARY_BASE_PREFIX + 'reverse':
          obj.animPlayback = ANIM_PLAY_REVERSE;
          break;
        default:
          break;
      }
    }
  });
  console.log('%c Done!', 'color: green');
}

// Reset given animation to its appropriate starting point and pause it.
/*function resetAnimation(animation, playback, duration) {
  if (playback === ANIM_PLAY_FORWARD) {
      animation.pause(0);
  } else if (playback === ANIM_PLAY_REVERSE) {
      animation.pause(duration);
  }
}*/
function resetAnimation(animation) {
  animation.restart();
  animation.pause();
}

// Look at each object's properties and assemble a new GSAP animation.
/*function createAnimations(objList) {
  for (var obj of objList) {
    obj.animation = new TweenLite.from(obj.animTarget, obj.animDuration, obj.animProps);
    resetAnimation(obj.animation, obj.animPlayback, obj.animDuration);
  }
}*/
function createAnimations(objList) {
  for (var obj of objList) {
    obj.animation = new TweenLite.to(obj.animTarget, obj.animDuration, obj.animProps);
    resetAnimation(obj.animation);
  }
}

// Run the requested animation after any additional delay.
/*function runAnimation(anim, delay, playback) {
    if (playback === ANIM_PLAY_FORWARD) {
      TweenLite.delayedCall(delay, function(){anim.play()});
    } else if (playback === ANIM_PLAY_REVERSE) {
      TweenLite.delayedCall(delay, function(){anim.reverse()});
    }
}*/
function runAnimation(anim, delay) {
    TweenLite.delayedCall(delay, function(){anim.play()});
}

// Set and watch all triggers being used by
// animation objects' animTrigger properties.
// Fire animations when their trigger requirements are met.
function watchAnimationTriggers(objList) {
  objList.forEach(function(obj) {
    console.log('%c Watching trigger: ' + obj.animTrigger + '...', 'color: cyan');
    switch (obj.animTrigger) {
      case ANIM_TRIGGER_AUTOPLAY:
        if (!obj.hasRun) {
          obj.hasRun = true;
          runAnimation(obj.animation, obj.animDelay);
        }
        break;
      case ANIM_TRIGGER_SCROLL_TO:
        // TODO
        break;
      case ANIM_TRIGGER_FOCUS:
        obj.animTarget.focus(function() {
          if (!obj.hasRun) {
            obj.hasRun = true;
            runAnimation(obj.animation, obj.animDelay);
          }
        });
        break;
      case ANIM_TRIGGER_HOVER:
        obj.animTarget.hover(function() {
          if (!obj.hasRun) {
            obj.hasRun = true;
            runAnimation(obj.animation, obj.animDelay);
          }
        });
        obj.animTarget.focus(function() {
          if (!obj.hasRun) {
            obj.hasRun = true;
            runAnimation(obj.animation, obj.animDelay);
          }
        });
        break;
      case ANIM_TRIGGER_CLICK:
        obj.animTarget.click(function() {
          if (!obj.hasRun) {
            obj.hasRun = true;
            runAnimation(obj.animation, obj.animDelay);
          }
        });
        break;
      default:
      console.log('%c GSAP ERROR: WATCHING UNKNOWN TRIGGER', 'color: red');
        break;
    }
  });
}

// Gives element relative positioning if not relative or absolute.
// Without either, element may not animate properly.
function setElementPositions(objList) {
  objList.forEach(function(obj) {
    if (obj.animTarget[0].style.position !== 'relative' || 'absolute') obj.animTarget[0].style.position = 'relative';
  });
}

// ========================================================================= //
// ===== On Load ===== //

$(window).on('load', function(){
  animTargetList = getElementList(LIBRARY_BASE_CLASS);
  animObjectList = createAnimationObjects(animTargetList);

  for (var obj in animObjectList) {
    setElementPosition(animObjectList);
    assignAnimType(animObjectList);
    assignAnimTrigger(animObjectList);
    assignAnimEnhancements(animObjectList);
    createAnimation(animObjectList);
    watchAnimationTrigger(animObjectList);
  }

  setElementPositions(animObjectList);
  assignAnimTypes(animObjectList);
  assignAnimTriggers(animObjectList);
  assignAnimEnhancements(animObjectList);
  createAnimations(animObjectList);
  watchAnimationTriggers(animObjectList);

  console.log('%c Animation Objects Below:', 'color: orange');
  console.log(animObjectList);
});
