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
      DEFAULT_ANIM_PROPS = { opacity: "1", ease: Power2.easeOut },
      DEFAULT_ANIM_EASING = { ease: Power2.easeOut },
      DEFAULT_ANIM_DURATION = 0.5,
      DEFAULT_ANIM_DELAY = 0.2,
      //DEFAULT_ANIM_PLAYBACK = 'forward',

// Non-default animation values.
      ANIM_PROPS_FADE = { opacity: '0', ease: Power2.easeOut },

      ANIM_PROPS_SLIDE_UP = { top: "-75px", ease: Power3.easeOut },
      ANIM_PROPS_SLIDE_DOWN = { top: "75px", ease: Power3.easeOut },

      ANIM_TRIGGER_AUTOPLAY = 'autoplay',
      ANIM_TRIGGER_SCROLL_TO = 'scroll-to',
      ANIM_TRIGGER_FOCUS = 'focus',
      ANIM_TRIGGER_CLICK = 'click',
      ANIM_TRIGGER_HOVER = 'hover',

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
var animTargetList;
var animObjectList;

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
    rtn.push(this);
  });
  console.log('%c Done!', 'color: green');
  return rtn;
}

// Create an object for each item in the given array,
// push each new object into return array.
function createAnimationObjects(sourceList) {
  rtn = [];
  sourceList.forEach(function(item) {
    rtn.push(new AnimObj(item));
  });
  console.log(rtn);
  return rtn;
}

// Initialize constructor function for a new Animation Object.
function AnimObj(animTarget) {
  this.animTarget = animTarget;
  this.animTo = assignAnimIn(this.animTarget);
  this.animProps = assignAnimProps(this.animTarget);
  this.animTrigger = assignAnimTrigger(this.animTarget);
  this.animDuration = assignAnimDuration(this.animTarget);
  this.animDelay = assignAnimDelay(this.animTarget);
  this.animHasRun = false;
  this.animation =
    this.animTo ?
    new TweenLite.from(this.animTarget, this.animDuration, this.animProps) :
    new TweenLite.to(this.animTarget, this.animDuration, this.animProps);
}

// Set and watch trigger being used by
// animation object's animTrigger properties.
// Fire animations when their trigger requirements are met.
AnimObj.prototype.watchAnimationTrigger = function() {
  console.log('%c Watching trigger: ' + this.animTrigger + '...', 'color: cyan');
  var obj = this;

  switch (this.animTrigger) {
    case ANIM_TRIGGER_AUTOPLAY:
      if (!this.animHasRun) runAnimation(obj);
      break;
    case ANIM_TRIGGER_SCROLL_TO:
      // TODO
      break;
    case ANIM_TRIGGER_FOCUS:
      $(this.animTarget).on('focus', function() {
        if (!obj.animHasRun) runAnimation(obj);
      });
      break;
    case ANIM_TRIGGER_HOVER:
      $(this.animTarget).on('mouseenter focusin', function() {
        if (!obj.animHasRun) runAnimation(obj);
      });
      break;
    case ANIM_TRIGGER_CLICK:
      $(this.animTarget).on('click', function() {
        if (!obj.animHasRun) runAnimation(obj);
      });
      break;
    default:
    console.log('%c GSAP ERROR: WATCHING UNKNOWN TRIGGER', 'color: red');
      break;
  }
}

// Reset and pause animation.
AnimObj.prototype.resetAnimation = function() {
  this.animation.restart();
  this.animation.pause();
  this.animHasRun = false;
}

// Gives element relative positioning if not relative or absolute.
// Without either, element may not animate properly.
// Not used? Remove?
AnimObj.prototype.setElementPosition = function() {
  if (this.animTarget.style.position !== 'relative' || 'absolute') this.animTarget.style.position = 'relative';
}

// Look through the classes in target object.
// If any classes match a library animation property preset,
// extend that value to the return object, and continue looping.
// If no matches are found, give the return object default properties.
function assignAnimProps(target) {
  console.log('%c assignAnimTypes...', 'color: teal');
  var rtn = {};

  for (var itemClass of target.classList) {
    switch (itemClass) {
      case LIBRARY_BASE_PREFIX + 'fade':
        $.extend(rtn, ANIM_PROPS_FADE);
        break;
      case LIBRARY_BASE_PREFIX + 'slide-up':
        $.extend(rtn, ANIM_PROPS_SLIDE_UP);
        break;
      case LIBRARY_BASE_PREFIX + 'slide-down':
        $.extend(rtn, ANIM_PROPS_SLIDE_DOWN);
        break;
      default:
        break;
    }
  }
  if ($.isEmptyObject(rtn)) $.extend(rtn, DEFAULT_ANIM_PROPS);
  console.log('%c Done! Using default.', 'color: green');
  return rtn;
}

// Return whether this object is to be animated
// IN or OUT (TweenLite.to or TweenLite.from)
// when creating the animation object.
function assignAnimIn(target) {
  for (var itemClass of target.classList) {
    if (itemClass === LIBRARY_BASE_PREFIX + 'out') return false;
  }
  return true;
}

// Look through the classes in target object.
// If any classes match a library trigger preset, stop and return that value.
// If no trigger class is found, return the default value.
function assignAnimTrigger(target) {
  console.log('%c assignAnimTriggers...', 'color: teal');
  for (var itemClass of target.classList) {
    switch (itemClass) {
      case LIBRARY_BASE_PREFIX + 'autoplay':
        return ANIM_TRIGGER_AUTOPLAY;
      case LIBRARY_BASE_PREFIX + 'on-scroll-to':
        return ANIM_TRIGGER_SCROLL_TO;
      case LIBRARY_BASE_PREFIX + 'on-focus':
        return ANIM_TRIGGER_FOCUS;
      case LIBRARY_BASE_PREFIX + 'on-hover':
        return ANIM_TRIGGER_HOVER;
      case LIBRARY_BASE_PREFIX + 'on-click':
        return ANIM_TRIGGER_CLICK;
      default:
        break;
    }
  }
  console.log('%c Done! (Using default trigger)', 'color: green');
  return DEFAULT_ANIM_TRIGGER;
}

// Look through the classes in target object.
// If any classes match a library delay preset, stop and return that value.
// If no delay class is found, return the default value.
function assignAnimDelay(target) {
  console.log('%c Assigning animation delay...', 'color: teal');
  for (var itemClass of target.classList) {
    switch (itemClass) {
      case LIBRARY_BASE_PREFIX + 'delay-none':
        return ANIM_DELAY_NONE;
      case LIBRARY_BASE_PREFIX + 'delay-short':
        return ANIM_DELAY_SHORT;
      case LIBRARY_BASE_PREFIX + 'delay-long':
        return ANIM_DELAY_LONG;
      case LIBRARY_BASE_PREFIX + 'delay-xlong':
        return ANIM_DELAY_XLONG;
      default:
        break;
    }
  }
  console.log('%c Done! (Using default delay)', 'color: green');
  return DEFAULT_ANIM_DELAY;
}

// Look through the classes in target object.
// If a class matches a library duration preset, stop and returns that value.
// If no delay class is found, return the default value.
function assignAnimDuration(target) {
  console.log('%c Assigning animation duration...', 'color: teal');
  for (var itemClass of target.classList) {
    switch (itemClass) {
      case LIBRARY_BASE_PREFIX + 'xfast':
        return ANIM_DURATION_XSHORT;
      case LIBRARY_BASE_PREFIX + 'fast':
        return ANIM_DURATION_SHORT;
      case LIBRARY_BASE_PREFIX + 'slow':
        return ANIM_DURATION_LONG;
      case LIBRARY_BASE_PREFIX + 'xslow':
        return ANIM_DURATION_XLONG;
      case LIBRARY_BASE_PREFIX + 'xxslow':
        return ANIM_DURATION_XXLONG;
      case LIBRARY_BASE_PREFIX + 'xxxslow':
        return ANIM_DURATION_XXXLONG;
      default:
        break;
    }
  }
  console.log('%c Done! (Using default duration)', 'color: green');
  return DEFAULT_ANIM_DURATION;
}

// Run the animation after any included delay, then flip animHasRun to true
function runAnimation(obj) {
  TweenLite.delayedCall(obj.animDelay, function(){ obj.animation.play() });
  obj.animHasRun = true;
}

function setStartupClassStyles() {
  //$('.' + LIBRARY_BASE_PREFIX + 'fade-out').css('opacity', '1');
  //$('.' + LIBRARY_BASE_PREFIX + 'fade-in.'
  //      + LIBRARY_BASE_PREFIX + 'slide-up').css('top', '75px');
}

// ========================================================================= //
// ===== On Load ===== //

//setStartupClassStyles();

$(window).on('load', function(){
  animTargetList = getElementList(LIBRARY_BASE_CLASS);
  animObjectList = createAnimationObjects(animTargetList);

  for (var obj of animObjectList) {
    console.log(obj.animation);
    obj.resetAnimation();
    obj.watchAnimationTrigger();
  }

  //setStartupClassStyles();

  //console.log('%c Animation Objects Below:', 'color: orange');
  //console.log(animObjectList);
});
