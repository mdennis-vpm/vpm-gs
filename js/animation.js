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

// ======= Greensock Animations =======

// Animation objects require the following properties...
// element: html element to animate, e.g. $('#header-card')
// animTarget: is this a class or id? ("class" or "id")
// animOn: event to trigger animation ("focus", "scrollTo")
// animProps: animation properties, make an object or call a preset, e.g. standardCardTween
// animTime: length of the animation in seconds, can be a decimal value, e.g. 1.25
// animDelay: time in seconds to delay beginning play of animation, can be decimal

// Sample object array:
//  let animationElements = [
//    {
//      element: $('#sample1'),
//      animOn: "scrollTo",
//      animProps: standardCardTween,
//      animTime: 0.5,
//      animDelay: 1
//    },
//    {
//      element: $('#sample2'),
//      animOn: "focus",
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

var standardUpTween = {
  top: "75px",
  opacity: "0",
  ease: Power3.easeOut
};

var standardDownTween = {
  top: "-75px",
  opacity: "0",
  ease: Power3.easeOut
};

var flatFadeInOut = {
  opacity: "0",
  ease: Power2.easeOut
};

var slideInFromRight = {
  left: $(window).width() * -1,
  ease: Power3.easeOut
};

var slideInFromLeft = {
  right: $(window).width() * -1,
  ease: Power3.easeOut
};

var inputLabelSlide = {
  color: "#383838",
  backgroundColor: "rgba(255,255,255,0)",
  top: "1.5rem",
  cursor: "text",
  ease: Power2.easeInOut
};

// Initialize animationElements array with class-based defaults
var animationElements = [
  {
    element: 'gs-form-label-slide',
    animTarget: "class",
    animOn: "focus",
    animProps: inputLabelSlide,
    animTime: 0.25,
    animDelay: 0
  },
  {
    element: 'gs-fade-in-slide-up',
    animTarget: "class",
    animOn: "scrollTo",
    animProps: standardUpTween,
    animTime: 0.5,
    animDelay: 0.2
  },
  {
    element: 'gs-fade-in-slide-down',
    animTarget: "class",
    animOn: "scrollTo",
    animProps: standardDownTween,
    animTime: 0.5,
    animDelay: 0.2
  },
  {
    element: 'gs-slide-in-from-left',
    animTarget: "class",
    animOn: "scrollTo",
    animProps: slideInFromLeft,
    animTime: 0.5,
    animDelay: 0.2
  },
  {
    element: 'gs-slide-in-from-right',
    animTarget: "class",
    animOn: "scrollTo",
    animProps: slideInFromRight,
    animTime: 0.5,
    animDelay: 0.2
  },
  {
    element: 'gs-fade-in',
    animTarget: "class",
    animOn: "scrollTo",
    animProps: flatFadeInOut,
    animTime: 0.5,
    animDelay: 0.2
  }
];

var defaultAnimCount = animationElements.length;
var renderedAnimationSets;

// Create animation tweens
function createAnimations(animationSets) {
  var obj;
  renderedAnimationSets = [];
  animationSets.forEach(function(item, i) {
    //console.log(item.animProps.ease);
    //item.animProps.ease = Bounce.easeOut;
    //console.log(item.animProps.ease);

    // contextual events to trigger animations
    switch (item.animOn) {
      case "scrollTo":
        if (item.animTarget === "class") {
          $("." + item.element).each(function() {
            obj = getObj(item);
            obj.isHidden = true;
            obj.element = $(this).eq().prevObject;
            obj.animDelay = $(window).width() < 992 ? obj.animDelay : obj.animDelay + (obj.element.prevAll(".gs-chain").length * 0.1) + (i * 0.01);
            //animDelay: $(window).width() < 992 ? 0.2 : 0.4
            obj.animation = new TweenLite.from(obj.element, obj.animTime, obj.animProps);
            obj.animation.pause(0);
            renderedAnimationSets.push(obj);
          });
        } else if (item.animTarget === "id") {
          obj = getObj(item);
          obj.isHidden = true;
          obj.element = $("#" + obj.element);
          obj.animation = new TweenLite.from(obj.element, obj.animTime, obj.animProps);
          obj.animation.pause(0);
          renderedAnimationSets.push(obj);
        }
        break;
      case "focus":
        if (item.animTarget === "id") {
          item.label = $("#" + item.element + "-label");
          item.animation = new TweenLite.from(item.label, item.animTime, item.animProps);
          item.animation.pause(0);
          renderedAnimationSets.push(item);
        } else if (item.animTarget === "class") {
          $('.' + item.element).each(function() {
            obj = getObj(item);
            obj.label = $(this).find("label");
            obj.input = $(this).find("input, textarea");
            obj.animation = new TweenLite.from(obj.label, obj.animTime, obj.animProps);
            obj.animation.pause(0);
            renderedAnimationSets.push(obj);
          });
        }
        break;
      // placeholders, feel free to create and expand
      case "hover":
      case "click":
      case "scrollUpDown":
        console.log('%cGSAP Warning: Non-functional event trigger "' + item.animOn + '" used for element id "#' + item.element.attr('id') + '"', 'color: orange;');
        break;
      default:
        console.log('%cGSAP Error: Invalid animOn event trigger value "' + item.animOn + '" for element id "#' + item.element.attr('id') + '"', 'color: tomato;');
        break;
    }
  });
  if (renderedAnimationSets.length > 0) runAnimations(renderedAnimationSets);
}

// Fire all animations when element is visible,
// reverse if approaching viewport edge
function runAnimations(animationSets) {
  animationSets.forEach(function(item) {

    item.element.css("position", setElementPosition(item.element));

    // "onFocus" animation playback
    if (item.animOn === "focus" && item.animTarget === "id") {
      item.element.focus(function(){
        item.animation.play();
      });
      item.element.focusout(function(){
        if (item.element.val().length == 0) item.animation.reverse();
      });
    } else if (item.animOn === "focus" && item.animTarget === "class") {
      item.input.focus(function(){
        item.animation.play();
      });
      item.input.focusout(function(){
        if (item.input.val().length == 0) item.animation.reverse();
      });
    }

    // "scrollTo" animation playback
    if (item.animOn === "scrollTo") {
      $(window).on('load scroll', function() {
          if (item.element.isInViewport(item.animProps.top) && item.isHidden) {
            item.isHidden = false;
            TweenLite.delayedCall(item.animDelay, function(){item.animation.play(0)});
          }
      });
    }
    // UNCOMMENT TO ADD ABILITY TO REVERSE ANIMATION WHEN OFF SCREEN
      /*else if (!item.element.isInViewport() && !item.isHidden) {
      item.isHidden = true;
      item.animation.reverse();
    } else if (!item.element.isInViewport() && item.isHidden) {
      item.animation.reverse();
    }*/
  });
}

function setElementPosition(elem) {
  if (elem.css("position") !== "relative" || "absolute") {
    return "relative";
  }
  return;
}

function addAnimations(array) {
  array.forEach(function(obj){
    animationElements.push(obj);
  });
  createAnimations(animationElements);
}

if (animationElements.length === defaultAnimCount) createAnimations(animationElements);

$(window).bind('load', function() {
});
