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
      ANIM_PROPS_FADE_IN = { opacity: '1', ease: Power2.easeOut },
      ANIM_PROPS_FADE_OUT = { opacity: '0', ease: Power2.easeOut },

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
//var animTargetList = [];
//var animObjectList = [];

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
/*function createAnimationObjectsOLD(sourceList) {
  console.log('%c createAnimationObjects...', 'color: teal');
  var rtn = [];
  sourceList.forEach(function(item) {
    rtn.push({
      animTarget: item,
      animProps: DEFAULT_ANIM_PROPS,
      animTrigger: DEFAULT_ANIM_TRIGGER,
      animDuration: DEFAULT_ANIM_DURATION,
      animDelay: DEFAULT_ANIM_DELAY,
      animHasRun: false
      //animPlayback: DEFAULT_ANIM_PLAYBACK
    });
  });
  console.log('%c Done!', 'color: green');
  return rtn;
}*/

function createAnimationObjects(sourceList) {
  rtn = [];
  sourceList.forEach(function(item) {
    rtn.push(new AnimObj(
      item,
      DEFAULT_ANIM_PROPS,
      DEFAULT_ANIM_TRIGGER,
      DEFAULT_ANIM_DURATION,
      DEFAULT_ANIM_DELAY,
      false,
      false
    ));
  });
  console.log(rtn);
  return rtn;
}

function AnimObj(animTarget, animProps, animTrigger, animDuration, animDelay, animHasRun, animRunFlag) {
  this.animTarget = animTarget;
  this.animProps = animProps;
  this.animTrigger = animTrigger;
  this.animDuration = animDuration;
  this.animDelay = animDelay;
  this.animHasRun = animHasRun;
  this.animRunFlag = animRunFlag;
}

// Gives element relative positioning if not relative or absolute.
// Without either, element may not animate properly.
AnimObj.prototype.setElementPosition = function() {
  //console.log(this);
  if (this.animTarget.style.position !== 'relative' || 'absolute') this.animTarget.style.position = 'relative';
}

// Look through the classes in each object in the list,
// if any classes match a library preset, apply those animation properties,
// if no match is found, give it the default.
AnimObj.prototype.assignAnimTypes = function() {
  console.log('%c assignAnimTypes...', 'color: teal');

  for (var itemClass of this.animTarget.classList) {
    switch (itemClass) {
      case LIBRARY_BASE_PREFIX + 'fade-in':
        //this.animTarget[0].style.opacity = '0';
        //this.animProps = ANIM_PROPS_FADE_IN;
        $.extend(this.animProps, ANIM_PROPS_FADE_IN);
        break;
      case LIBRARY_BASE_PREFIX + 'fade-out':
        //this.animTarget[0].style.opacity = '1';
        //this.animProps = ANIM_PROPS_FADE_OUT;
        $.extend(this.animProps, ANIM_PROPS_FADE_OUT);
        break;
      case LIBRARY_BASE_PREFIX + 'slide-up':
        //this.animProps = ANIM_PROPS_SLIDE_UP;
        $.extend(this.animProps, ANIM_PROPS_SLIDE_UP);
        break;
      case LIBRARY_BASE_PREFIX + 'slide-down':
        //this.animProps = ANIM_PROPS_SLIDE_DOWN;
        $.extend(this.animProps, ANIM_PROPS_SLIDE_DOWN);
        break;
      default:
        break;
    }
  }
  console.log(this.animProps);
  console.log('%c Done!', 'color: green');
}

// Look through the classes in each object in the list,
// if any classes match a library preset, apply that animation trigger,
// if no match is found, give it the default.
AnimObj.prototype.assignAnimTrigger = function() {
  console.log('%c assignAnimTriggers...', 'color: teal');
  var animTriggerFound = false;

  for (var itemClass of this.animTarget.classList) {
    switch (itemClass) {
      case LIBRARY_BASE_PREFIX + 'autoplay':
        this.animTrigger = ANIM_TRIGGER_AUTOPLAY;
        animTriggerFound = !animTriggerFound;
        break;
      case LIBRARY_BASE_PREFIX + 'on-scroll-to':
        this.animTrigger = ANIM_TRIGGER_SCROLL_TO;
        animTriggerFound = !animTriggerFound;
        break;
      case LIBRARY_BASE_PREFIX + 'on-focus':
        this.animTrigger = ANIM_TRIGGER_FOCUS;
        animTriggerFound = !animTriggerFound;
        break;
      case LIBRARY_BASE_PREFIX + 'on-hover':
        this.animTrigger = ANIM_TRIGGER_HOVER;
        animTriggerFound = !animTriggerFound;
        break;
      case LIBRARY_BASE_PREFIX + 'on-click':
        this.animTrigger = ANIM_TRIGGER_CLICK;
        animTriggerFound = !animTriggerFound;
        break;
      default:
        break;
    }
    if (animTriggerFound) return;
  }
  console.log('%c Done!', 'color: green');
}

// Look through the classes in each object in the list,
// if any classes match a library preset, apply that animation enhancement.
// Function only stops after all classes are checked.
AnimObj.prototype.assignAnimEnhancements = function() {
  console.log('%c assignAnimEnhancements...', 'color: teal');

  for (var itemClass of this.animTarget.classList) {
    switch (itemClass) {
      case LIBRARY_BASE_PREFIX + 'delay-none':
        this.animDelay = ANIM_DELAY_NONE;
        break;
      case LIBRARY_BASE_PREFIX + 'delay-short':
        this.animDelay = ANIM_DELAY_SHORT;
        break;
      case LIBRARY_BASE_PREFIX + 'delay-long':
        this.animDelay = ANIM_DELAY_LONG;
        break;
      case LIBRARY_BASE_PREFIX + 'delay-xlong':
        this.animDelay = ANIM_DELAY_XLONG;
        break;
      case LIBRARY_BASE_PREFIX + 'xfast':
        this.animDuration = ANIM_DURATION_XSHORT;
        break;
      case LIBRARY_BASE_PREFIX + 'fast':
        this.animDuration = ANIM_DURATION_SHORT;
        break;
      case LIBRARY_BASE_PREFIX + 'slow':
        this.animDuration = ANIM_DURATION_LONG;
        break;
      case LIBRARY_BASE_PREFIX + 'xslow':
        this.animDuration = ANIM_DURATION_XLONG;
        break;
      case LIBRARY_BASE_PREFIX + 'xxslow':
        this.animDuration = ANIM_DURATION_XXLONG;
        break;
      case LIBRARY_BASE_PREFIX + 'xxxslow':
        this.animDuration = ANIM_DURATION_XXXLONG;
        break;
      case LIBRARY_BASE_PREFIX + 'reverse':
        this.animPlayback = ANIM_PLAY_REVERSE;
        break;
      default:
        break;
    }
  }
  console.log('%c Done!', 'color: green');
}

// Look at each object's properties and assemble a new GSAP animation.
AnimObj.prototype.createAnimation = function() {
  this.animation = new TweenLite.to(this.animTarget, this.animDuration, this.animProps);
}

AnimObj.prototype.animation = function() {
  //return new TweenLite.to(this.animTarget, this.animDuration, this.animProps);
}

AnimObj.prototype.resetAnimation = function() {
  this.animation.restart();
  this.animation.pause();
}

// Set and watch all triggers being used by
// animation objects' animTrigger properties.
// Fire animations when their trigger requirements are met.
AnimObj.prototype.watchAnimationTrigger = function() {
  console.log('%c Watching trigger: ' + this.animTrigger + '...', 'color: cyan');
  var obj = this;

  switch (this.animTrigger) {
    case ANIM_TRIGGER_AUTOPLAY:
      if (!this.animHasRun) {
        //this.hasRun = true;
        this.animRunFlag = true;
        //runAnimation(this);
        TweenLite.delayedCall(this.animDelay, function(){ this.animation.play() });
      }
      break;
    case ANIM_TRIGGER_SCROLL_TO:
      // TODO
      break;
    case ANIM_TRIGGER_FOCUS:
      $(this.animTarget).focus(function() {
        if (!this.animHasRun) {
          //this.hasRun = true;
          this.animRunFlag = true;
          //runAnimation(this);
          TweenLite.delayedCall(this.animDelay, function(){ this.animation.play() });
        }
      });
      break;
    case ANIM_TRIGGER_HOVER:
      $(this.animTarget).hover(function() {
        if (!this.animHasRun) {
          //this.hasRun = true;
          this.animRunFlag = true;
          //runAnimation(this);
          TweenLite.delayedCall(this.animDelay, function(){ this.animation.play() });
        }
      });
      $(this.animTarget).focus(function() {
        if (!this.animHasRun) {
          //this.hasRun = true;
          this.animRunFlag = true;
          //runAnimation(this);
          TweenLite.delayedCall(this.animDelay, function(){ this.animation.play() });
        }
      });
      break;
    case ANIM_TRIGGER_CLICK:
      $(this.animTarget).click(function() {
        if (!this.animHasRun) {
          //this.hasRun = true;
          this.animRunFlag = true;
          //runAnimation(this);
          TweenLite.delayedCall(this.animDelay, function(){ this.animation.play() });
        }
      });
      break;
    default:
    console.log('%c GSAP ERROR: WATCHING UNKNOWN TRIGGER', 'color: red');
      break;
  }
}

function runAnimation(obj) {
  console.log("animating...");
  console.log(obj);
  TweenLite.delayedCall(obj.animDelay, function(){ obj.animation.play() });
  obj.animHasRun = true;
  obj.animRunFlag = false;
}

AnimObj.prototype.setStartupClassStyles = function() {
  //TweenLite.set(this.animTarget, {opacity: 0});
  //$('.' + LIBRARY_BASE_PREFIX + 'fade-in').css('opacity', '0');
}

// ========================================================================= //
// ===== On Load ===== //

//setStartupClassStyles();

$(window).on('load', function(){
  var animTargetList = getElementList(LIBRARY_BASE_CLASS);
  var animObjectList = createAnimationObjects(animTargetList);

  for (var obj of animObjectList) {
    console.log("asdf...");
    console.log(obj);
    //obj.setElementPosition();
    obj.assignAnimTypes();
    obj.assignAnimTrigger();
    obj.assignAnimEnhancements();
    obj.createAnimation();
    obj.resetAnimation();
    obj.setStartupClassStyles();
    obj.watchAnimationTrigger();
    //obj.runAnimation();
  }

  console.log('%c Animation Objects Below:', 'color: orange');
  console.log(animObjectList);
});
