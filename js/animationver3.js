/*

- Get all elements containing class name with "gs-"
- Create new animation object for each element
- Check element for animType class
- Update object's animProps
- Check element for animTrigger class
- Update object's animTrigger
- Check element for enhancement classes?
- Update object parameters for enhancements?


*/

// Constants
const WINDOW_WIDTH = $(window).width();

function elementExists(element) {
  return ($('.' + element).length > 0);
}

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

// ======= Greensock Animations =======

// Animation objects require the following properties...
// animTarget: html element to animate, e.g. $('#header-card')
// animClassOrId: is this a class or id? ("class" or "id")
// animTrigger: event to trigger animation ("focus", "scrollTo")
// animProps: animation properties, make an object or call a preset, e.g. standardCardTween
// animTime: length of the animation in seconds, can be a decimal value, e.g. 1.25
// animDelay: time in seconds to delay beginning play of animation, can be decimal

// Sample object array:
//  let animationElements = [
//    {
//      animTarget: $('#sample1'),
//      animTrigger: "scrollTo",
//      animProps: standardCardTween,
//      animTime: 0.5,
//      animDelay: 1
//    },
//    {
//      animTarget: $('#sample2'),
//      animTrigger: "focus",
//      animProps: {
//        top: "50px",
//        opacity: "0",
//        color: "#B4D455"
//      },
//      animTime: 0.25,
//      animDelay: 0
//    }
//  ]

// Default animation property values
const ANIM_TRIGGER = "autoplay",
      ANIM_TIME = 0.5,
      ANIM_DELAY = 0.2;

// Common/Reusable animation property sets
var fadeInSlideUp = {
  top: "75px",
  opacity: "0",
  ease: Power3.easeOut
};

var fadeInSlideDown = {
  top: "-75px",
  opacity: "0",
  ease: Power3.easeOut
};

var fadeIn = {
  opacity: "0",
  ease: Power2.easeOut
};

var slideInFromRight = {
  left: WINDOW_WIDTH,
  ease: Power3.easeOut
};

var slideInFromLeft = {
  right: WINDOW_WIDTH,
  ease: Power3.easeOut
};

// Initialize animationElements array with class-based defaults
var animationElements = [
  {
    animTarget: 'gs-fade-in-slide-up',
    animTrigger: "autoplay",
    animProps: fadeInSlideUp,
    animTime: ANIM_TIME,
    animDelay: ANIM_DELAY
  },
  {
    animTarget: 'gs-fade-in-slide-down',
    animTrigger: "autoplay",
    animProps: fadeInSlideDown,
    animTime: ANIM_TIME,
    animDelay: ANIM_DELAY
  },
  {
    animTarget: 'gs-slide-in-from-left',
    animTrigger: "autoplay",
    animProps: slideInFromLeft,
    animTime: ANIM_TIME,
    animDelay: ANIM_DELAY
  },
  {
    animTarget: 'gs-slide-in-from-right',
    animTrigger: "autoplay",
    animProps: slideInFromRight,
    animTime: ANIM_TIME,
    animDelay: ANIM_DELAY
  },
  {
    animTarget: 'gs-fade-in',
    animProps: fadeIn,
    animTime: ANIM_TIME,
    animDelay: ANIM_DELAY
  }
];

// Animation prototype
function Animation(animTarget, animTrigger, animProps, animTime, animDelay) {
  this.animTarget = animTarget;
  this.animTrigger = animTrigger;
  this.animProps = animProps;
  this.animTime = animTime;
  this.animDelay = animDelay;
  this.hasRun = false;
  //console.log("start create.");
  //this.animation.createAnimation();
  this.gs = new TweenLite.from(this.animTarget, this.animTime, this.animProps);
  //this.gs;
  //console.log("end create.");
}

// Creates an animation out of a constructor
Animation.prototype.createAnimation = function() {
  this.gs = new TweenLite.from(this.animTarget, this.animTime, this.animProps);
  this.gs.pause(0);
}

// Gets an animation's play trigger
Animation.prototype.getTrigger = function() {
  //item.animTrigger = item
  console.log(this);
  switch (this) {
  }
}

// Sets an animation's play trigger
Animation.prototype.setTrigger = function() {
  switch (this.animTrigger) {
    case "scrollTo":
      break;
    case "focus":
      break;
    case "hover":
      break;
    case "click":
      break;
    case "autoplay":
      if(!this.hasRun) {
        this.hasRun = true;
        //TweenLite.delayedCall(this.animDelay, function(){this.play(0)});
        //this.gs.play(0);
        //console.log(this.gs);
        runAnimation(this.animDelay, this.gs);
      }
      break;
    case "d":
      break;
    case "e":
      break;
    case "f":
      break;
    default:
      console.log('%cGSAP Error: Invalid animTrigger event trigger value "' + this.animTrigger + '" for element "' + this.animTarget + '", defaulting to autoplay', 'color: tomato;');
        if(!this.hasRun) {
          this.hasRun = true;
          runAnimation(this.animDelay, this.gs);
        }
      break;
    }
}

var defaultAnimCount = animationElements.length;
var renderedAnimationSets = [];

// Animation objects
function renderAnimations() {
  console.log("rendering animation sets...");

  animationElements.forEach(function(item, i) {
    if(elementExists(item.animTarget)) {
      var animation = new Animation(
        item.animTarget,
        item.animClassOrId,
        item.animTrigger,
        item.animProps,
        item.animTime,
        item.animDelay
      );
      //animation.createAnimation();
      animation.gs.pause(0);
      //setTrigger(this.animation);
      renderedAnimationSets.push(animation);
      console.log(animation.gs.target.prevObject);
      console.log("rendered: " + ".") + animation.animTarget);
      animation.getTrigger();
      animation.setTrigger();
    }
  });
  console.log("finished rendering animation sets.");
}

function runAnimation(delay, anim) {
  //item.play(0);
  console.log("running...");
  TweenLite.delayedCall(delay, function(){anim.play(0)});
}

// Gives element relative positioning if not relative or absolute.
// Without either, element may not animate properly.
function setElementPosition(elem) {
  if (elem.css("position") !== "relative" || "absolute") {
    return "relative";
  }
  return;
}

function setAnimationTriggers() {
  return;
}

renderAnimations();
setAnimationTriggers();

$(window).on('load', function(){
  //renderAnimations();
});
