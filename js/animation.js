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
      BASE_THROTTLE = 250;

// Default animation property values.
const DEFAULT_ANIM_TRIGGER = 'autoplay',
      DEFAULT_ANIM_EASING = { ease: Power3.easeOut },
      DEFAULT_ANIM_PROPS = DEFAULT_ANIM_EASING,
      DEFAULT_ANIM_DURATION = 0.5,
      DEFAULT_ANIM_DELAY = 0.2,
      BASE_CHAIN_DELAY = 0.1,

// Non-default animation values.
      ANIM_PROPS_FADE = { opacity: '0' },

      ANIM_EASE_ELASTIC = { ease: Elastic.easeOut.config(1, 0.3) },
      ANIM_EASE_BOUNCE = { ease: Bounce.easeOut },
      ANIM_EASE_BACK = { ease: Back.easeOut.config(1.7) },
      ANIM_EASE_OUT = { ease: Power3.easeOut },

      ANIM_PROPS_SLIDE_TOP = { top: "-75px" },
      ANIM_PROPS_SLIDE_BOTTOM = { top: "75px" },
      ANIM_PROPS_SLIDE_LEFT = { left: "-75px" },
      ANIM_PROPS_SLIDE_RIGHT = { left: "75px" },

      ANIM_ROTATE_CLOCKWISE_FULL = { rotation: -360 },
      ANIM_ROTATE_CLOCKWISE_HALF = { rotation: -180 },
      ANIM_ROTATE_CLOCKWISE_QUARTER = { rotation: -90 },
      ANIM_ROTATE_COUNTER_CLOCKWISE_FULL = { rotation: 360 },
      ANIM_ROTATE_COUNTER_CLOCKWISE_HALF = { rotation: 180 },
      ANIM_ROTATE_COUNTER_CLOCKWISE_QUARTER = { rotation: 90 },

      ANIM_COINSPIN_X = { rotationX: "360" },
      ANIM_COINSPIN_X2 = { rotationX: "720" },
      ANIM_COINSPIN_X3 = { rotationX: "1080" },

      ANIM_COINSPIN_Y = { rotationY: "360" },
      ANIM_COINSPIN_Y2 = { rotationY: "720" },
      ANIM_COINSPIN_Y3 = { rotationY: "1080" },

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

// Find and return the distance from element
// to the specified edge of the viewport
function distanceToViewportEdge(edge, element) {
  switch (edge) {
    case "top":
      return ($(element).offset().top + $(element).height());
    case "bottom":
      return WINDOW_HEIGHT - ($(element).offset().top);
    case "left":
      return ($(element).offset().left - $(element).width() * -1);
    case "right":
      return WINDOW_WIDTH - $(element).offset().left;
    default:
      return 0;
  }
}

// Find and return the distance from element
// to the specified edge of its container
function distanceToContainerEdge(edge, element) {
  switch (edge) {
    case "top":
      return $(element).parent().offset().top - $(element).offset().top;
    case "bottom":
      return $(element).parent().innerHeight() - $(element).offset().top + $(element).parent().offset().top - $(element).height();
    case "left":
      return $(element).parent().offset().left - $(element).offset().left;
    case "right":
      return $(element).parent().innerWidth() - $(element).offset().left + $(element).parent().offset().left - $(element).width();
    default:
      return 0;
  }
}

// Use to throttle firing of a function, prevents functions from potentially
// firing hundreds or thousands of times in rapid succession
var _ = {};

_.throttle = function(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
_.debounce = function(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

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
  this.yMin = $(this.animTarget).offset().top;
  this.yMax = $(this.animTarget).offset().top + $(this.animTarget).innerHeight();
  console.log("yMin = " + this.yMin);
  console.log("yMax = " + this.yMax);
  this.animTo = assignAnimIn(this.animTarget);
  this.animDuration = assignAnimDuration(this.animTarget);
  this.animDelay = assignAnimDelay(this.animTarget);
  this.animDelay += addChainDelay(this.animTarget);
  this.animProps = assignAnimProps(this.animTarget);
  this.animTrigger = assignAnimTrigger(this.animTarget);
  this.animHasRun = false;
  this.animIsIdle = true;
  this.animIsSelfReversing = assignAnimSelfReverse(this.animTarget);
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
      if (!obj.animHasRun) runAnimation(obj);
      break;
    case ANIM_TRIGGER_SCROLL_TO:
      if (!obj.animHasRun) {
        if (obj.isInViewport()) runAnimation(obj);
      }
      $(window).on('scroll', _.throttle(function(){
          if (!obj.animHasRun) {
            if (obj.isInViewport()) runAnimation(obj);
          }
        }, BASE_THROTTLE));
      break;
    case ANIM_TRIGGER_FOCUS:
      $(this.animTarget).on('focusin', function() {
        if (!obj.animHasRun) runAnimation(obj);
      });
      $(this.animTarget).on('focusout', function() {
        if (obj.animHasRun && obj.animIsSelfReversing) reverseAnimation(obj);
      });
      break;
    case ANIM_TRIGGER_HOVER:
      $(this.animTarget).on('mouseover focusin', _.throttle(function() {
        //console.log("asd: " + (obj.animDuration + obj.animDelay) * 1000);
        if (!obj.animHasRun) runAnimation(obj);
      }, (obj.animDuration + obj.animDelay) * 1000));
      $(this.animTarget).on('mouseleave focusout', _.throttle(function() {
        //console.log("asd: " + (obj.animDuration + obj.animDelay) * 1000);
        //if (obj.animHasRun && obj.animIsSelfReversing && obj.animation.progress() === 1) reverseAnimation(obj);
      }, (obj.animDuration + obj.animDelay) * 0));
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

  if (this.animIsSelfReversing) {

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

// Use to check if any part of an item is currently visible in the viewport
AnimObj.prototype.isInViewport = function() {
  console.log("checking if in viewport...");
  var bMod = $(window).height() / 3;
  var viewportTop = $(window).scrollTop() + bMod;
  var viewportBottom = $(window).scrollTop() + $(window).height() - bMod;
  return this.yMax > viewportTop && this.yMin < viewportBottom;
};

// Look through the classes in target object.
// If any classes match a library animation property preset,
// extend that value to the return object, and continue looping.
// If no matches are found, give the return object default properties.
function assignAnimProps(target) {
  console.log('%c assignAnimTypes...', 'color: teal');
  var rtn = {};

  for (var itemClass of target.classList) {
    //$.extend(rtn, DEFAULT_ANIM_PROPS);

    switch (itemClass) {
      case LIBRARY_BASE_PREFIX + 'fade':
        $.extend(rtn, ANIM_PROPS_FADE);
        break;
      case LIBRARY_BASE_PREFIX + 'slide-top':
        $.extend(rtn, ANIM_PROPS_SLIDE_TOP);
        break;
      case LIBRARY_BASE_PREFIX + 'slide-bottom':
        $.extend(rtn, ANIM_PROPS_SLIDE_BOTTOM);
        break;
      case LIBRARY_BASE_PREFIX + 'slide-left':
        $.extend(rtn, ANIM_PROPS_SLIDE_LEFT);
        break;
      case LIBRARY_BASE_PREFIX + 'slide-right':
        $.extend(rtn, ANIM_PROPS_SLIDE_RIGHT);
        break;
      case LIBRARY_BASE_PREFIX + 'slide-edge-top':
        $.extend(rtn, { bottom: String(distanceToViewportEdge("top", target)) + 'px' });
        break;
      case LIBRARY_BASE_PREFIX + 'slide-edge-bottom':
        //$.extend(rtn, { top: String(distanceToViewportEdge("bottom", target)) + 'px' });
        break;
      case LIBRARY_BASE_PREFIX + 'slide-edge-left':
        $.extend(rtn, { right: String(distanceToViewportEdge("left", target)) + 'px' });
        break;
      case LIBRARY_BASE_PREFIX + 'slide-edge-right':
        $.extend(rtn, { left: String(distanceToViewportEdge("right", target)) + 'px' });
        break;
      case LIBRARY_BASE_PREFIX + 'slide-container-top':
        $.extend(rtn, { top: String(distanceToContainerEdge("top", target)) + 'px' });
        break;
      case LIBRARY_BASE_PREFIX + 'slide-container-bottom':
        $.extend(rtn, { top: String(distanceToContainerEdge("bottom", target)) + 'px' });
        break;
      case LIBRARY_BASE_PREFIX + 'slide-container-left':
        $.extend(rtn, { left: String(distanceToContainerEdge("left", target)) + 'px' });
        break;
      case LIBRARY_BASE_PREFIX + 'slide-container-right':
        $.extend(rtn, { left: String(distanceToContainerEdge("right", target)) + 'px' });
        break;
      case LIBRARY_BASE_PREFIX + 'bounce':
        $.extend(rtn, ANIM_EASE_BOUNCE);
        break;
      case LIBRARY_BASE_PREFIX + 'elastic':
        $.extend(rtn, ANIM_EASE_ELASTIC);
        break;
      case LIBRARY_BASE_PREFIX + 'overshoot':
        $.extend(rtn, ANIM_EASE_BACK);
        break;
      case LIBRARY_BASE_PREFIX + 'rotate-cw-360':
        $.extend(rtn, ANIM_ROTATE_CLOCKWISE_FULL);
        break;
      case LIBRARY_BASE_PREFIX + 'rotate-cw-180':
        $.extend(rtn, ANIM_ROTATE_CLOCKWISE_HALF);
        break;
      case LIBRARY_BASE_PREFIX + 'rotate-cw-90':
        $.extend(rtn, ANIM_ROTATE_CLOCKWISE_QUARTER);
        break;
      case LIBRARY_BASE_PREFIX + 'rotate-ccw-360':
        $.extend(rtn, ANIM_ROTATE_COUNTER_CLOCKWISE_FULL);
        break;
      case LIBRARY_BASE_PREFIX + 'rotate-ccw-180':
        $.extend(rtn, ANIM_ROTATE_COUNTER_CLOCKWISE_HALF);
        break;
      case LIBRARY_BASE_PREFIX + 'rotate-ccw-90':
        $.extend(rtn, ANIM_ROTATE_COUNTER_CLOCKWISE_QUARTER);
        break;
      case LIBRARY_BASE_PREFIX + 'coinspin-x':
        $.extend(rtn, ANIM_COINSPIN_X);
        break;
      case LIBRARY_BASE_PREFIX + 'coinspin-y':
        $.extend(rtn, ANIM_COINSPIN_Y);
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

// TODO WRITE DESCRIPTION
function assignAnimSelfReverse(target) {
  for (var itemClass of target.classList) {
    if (itemClass === LIBRARY_BASE_PREFIX + 'self-reset') return true;
  }
  return false;
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
// If any classes match the chain animation class,
// stop and return a delay modifier that grows larger based on how many
// previous siblings are also using the chain class
function addChainDelay(target) {
  for (var itemClass of target.classList) {
    if (itemClass === LIBRARY_BASE_PREFIX + 'chain') {
      return $(target).prevAll('[class*="' + LIBRARY_BASE_PREFIX + 'chain"]').length * BASE_CHAIN_DELAY;
    }
  }
  return 0;
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

function reverseAnimation(obj) {
  TweenLite.delayedCall(obj.animDelay, function(){ obj.animation.reverse() });
  obj.animHasRun = false;
}

function setStartupClassStyles() {
  //$('.' + LIBRARY_BASE_PREFIX + 'fade-out').css('opacity', '1');
  //$('.' + LIBRARY_BASE_PREFIX + 'fade-in.'
  //      + LIBRARY_BASE_PREFIX + 'slide-up').css('top', '75px');
  //$('body').css('overflow', 'hidden');
}

function initializeAnimationLibrary() {
  animTargetList = getElementList(LIBRARY_BASE_CLASS);
  animObjectList = createAnimationObjects(animTargetList);

  for (var obj of animObjectList) {
    console.log(obj.animation);
    obj.resetAnimation();
    obj.watchAnimationTrigger();
  }
}

// ========================================================================= //
// ===== On Load ===== //

//setStartupClassStyles();

$(window).on('load', function(){

  initializeAnimationLibrary();

  //console.log('%c Animation Objects Below:', 'color: orange');
  //console.log(animObjectList);
});
