/*

- [x] Get all elements containing class name with "gs-"
- [x] Create new animation object for each element
- [x] Check element for animType class
- [x] Update object's animProps
- [x] Check element for animTrigger class
- [x] Update object's animTrigger
- [ ] Check element for enhancement classes?
- [ ] Update object parameters for enhancements?

*/

// ========================================================================= //
// ===== Globals ===== //

// Generic constants
const WINDOW_WIDTH = $(window).width(),
      WINDOW_HEIGHT = $(window).height(),
      LIBRARY_BASE_PREFIX = 'vpa-',
      LIBRARY_BASE_CLASS = '[class*="' + LIBRARY_BASE_PREFIX + '"]';

// Default animation property values
const DEFAULT_ANIM_TRIGGER = "autoplay",
      DEFAULT_ANIM_PROPS = { opacity: "0", ease: Power2.easeOut },
      DEFAULT_ANIM_DURATION = 0.5,
      DEFAULT_ANIM_DELAY = 0.2,

// Non-default animation values
      ANIM_PROPS_FADE_IN = { opacity: "0", ease: Power2.easeOut },
      ANIM_PROPS_FADE_IN_SLIDE_UP = { top: "75px", opacity: "0", ease: Power3.easeOut },
      ANIM_PROPS_FADE_IN_SLIDE_DOWN = { top: "-75px", opacity: "0", ease: Power3.easeOut };

      ANIM_TRIGGER_AUTOPLAY = "autoplay",
      ANIM_TRIGGER_SCROLL_TO = "scroll-to",
      ANIM_TRIGGER_FOCUS = "focus",
      ANIM_TRIGGER_CLICK = "click",
      ANIM_TRIGGER_HOVER = "hover";

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

// Variables
var animTargetList = [];
var animObjectList = [];

// ========================================================================= //
// ===== Support Functions ===== //

// Check if an element with the specified class name exists
function elementExists(element) {
  return ($('.' + element).length > 0);
}

// ========================================================================= //
// =====  ===== //

// Populate vpaList with every element that has
// at least one class containing the string "vpa-"
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
      animDuration: DEFAULT_ANIM_DURATION,
      animDelay: DEFAULT_ANIM_DELAY
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
      switch(itemClass) {
        case LIBRARY_BASE_PREFIX + 'fade-in':
          obj.animProps = ANIM_PROPS_FADE_IN;
          animTypeFound = !animTypeFound;
          break;
        case LIBRARY_BASE_PREFIX + 'fade-in-slide-up':
          obj.animProps = ANIM_PROPS_FADE_IN_SLIDE_UP;
          animTypeFound = !animTypeFound;
          break;
        case LIBRARY_BASE_PREFIX + 'fade-in-slide-down':
          obj.animProps = ANIM_PROPS_FADE_IN_SLIDE_DOWN;
          animTypeFound = !animTypeFound;
          break;
        default:
          break;
      }

      if (animTypeFound) return;
    }
    if (!animTypeFound) obj.animProps = DEFAULT_ANIM_PROPS;
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
      switch(itemClass) {
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

      //if (animTriggerFound) return;
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
      switch(itemClass) {
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
        default:
          break;
      }
    }
  });
  console.log('%c Done!', 'color: green');
}

// ========================================================================= //
// ===== On Load ===== //

$(window).on('load', function(){
  animTargetList = getElementList(LIBRARY_BASE_CLASS);
  animObjectList = createAnimationObjects(animTargetList);
  assignAnimTypes(animObjectList);
  assignAnimTriggers(animObjectList);
  assignAnimEnhancements(animObjectList);

  console.log('%c Animation Objects Below:', 'color: orange');
  console.log(animObjectList);
});
