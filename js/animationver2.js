// Use to check if any part of an item is currently visible in the viewport
$.fn.isInViewport = function(propTop) {
  var elementTop = this.offset().top;
  //var elementTop = propTop ? this.offset().top - parseInt(propTop.slice(0,-2)) : this.offset().top;
  var elementBottom = elementTop + (this.outerHeight() * 1.15);

  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + ($(window).height() * 0.95);

  return elementBottom > viewportTop && elementTop < viewportBottom;
};

// Alternative function to set animation obj (to support IE)
function getObj(item) {
  return JSON.parse(JSON.stringify(item));
}

function elementExists(element) {
  return ($('.' + element).length > 0 || $('#' + element).length > 0);
}

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time.
/*var throttle = function(func, wait) {
  var context,
      args,
      timeout,
      throttling,
      more,
      result;

  var whenDone = _.debounce(function(){ more = throttling = false; }, wait);

  return function() {
    context = this; args = arguments;
    var later = function() {
      timeout = null;
      if (more) func.apply(context, args);
      whenDone();
    };

    if (!timeout) timeout = setTimeout(later, wait);

    if (throttling) {
      more = true;
    } else {
      result = func.apply(context, args);
    }

    whenDone();
    throttling = true;
    return result;
  };
};*/

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
  left: $(window).width(),
  ease: Power3.easeOut
};

var slideInFromLeft = {
  right: $(window).width(),
  ease: Power3.easeOut
};

// Initialize animationElements array with class-based defaults
var animationElements = [
  {
    animTarget: 'gs-fade-in-slide-up',
    animClassOrId: "class",
    animTrigger: "autoplay",
    animProps: fadeInSlideUp,
    animTime: 0.5,
    animDelay: 0.2
  },
  {
    animTarget: 'gs-fade-in-slide-down',
    animClassOrId: "class",
    animTrigger: "autoplay",
    animProps: fadeInSlideDown,
    animTime: 0.5,
    animDelay: 0.2
  },
  {
    animTarget: 'gs-slide-in-from-left',
    animClassOrId: "class",
    animTrigger: "autoplay",
    animProps: slideInFromLeft,
    animTime: 0.5,
    animDelay: 0.2
  },
  {
    animTarget: 'gs-slide-in-from-right',
    animClassOrId: "class",
    animTrigger: "autoplay",
    animProps: slideInFromRight,
    animTime: 0.5,
    animDelay: 0.2
  },
  {
    animTarget: 'gs-fade-in',
    animClassOrId: "class",
    animProps: fadeIn,
    animTime: 0.5,
    animDelay: 0.2
  }
];

// Animation prototype
function Animation(animTarget, animClassOrId, animTrigger, animProps, animTime, animDelay) {
  this.animTarget = animTarget;
  this.animClassOrId = animClassOrId;
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

/*function setTrigger(item) {
  switch (item.animTrigger) {
    case "scrollTo":
      break;
    case "focus":
      break;
    case "hover":
      break;
    case "click":
      break;
    case "autoplay":
      if(!item.hasRun) {
        item.hasRun = true;
        TweenLite.delayedCall(item.animDelay, function(){item.gs.play(0)});
        //this.gs.play(0);
        console.log(item.gs);
      }
      break;
    case "d":
      break;
    case "e":
      break;
    case "f":
      break;
    default:
      console.log('%cGSAP Error: Invalid animTrigger event trigger value "' + item.animTrigger + '" for element "' + item.element + '"', 'color: tomato;');
      break;
    }
}*/

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
      console.log("rendered: " + (animation.animClassOrId === "id" ? "#" : ".") + animation.animTarget);
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
