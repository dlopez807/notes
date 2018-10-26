const noBounce = (function() {
  const module = {};

  const settings = {
    animate: true,
  };

  let track = [];

  let velocity = {
    x: 0,
    y: 0,
  };

  var vector = {
    subtraction(v1, v2) {
      return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
      };
    },
    length(v) {
      return Math.sqrt(v.x * v.x + v.y * v.y);
    },
    unit(v) {
      const length = vector.length(v);
      v.x /= length;
      v.y /= length;
    },
    skalarMult(v, s) {
      v.x *= s;
      v.y *= s;
    },
  };

  const requestAnimFrame = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  function handleTouchStart(evt) {
    let point, touch;

    touch = evt.changedTouches[0];
    point = {
      x: touch.clientX,
      y: touch.clientY,
      timeStamp: evt.timeStamp,
    };
    track = [point];
  }

  function handleTouchMove(evt) {
    let point, touch;

    evt.preventDefault();

    touch = evt.changedTouches[0];
    point = {
      x: touch.clientX,
      y: touch.clientY,
      timeStamp: evt.timeStamp,
    };
    track.push(point);
    doScroll();
  }

  function handleTouchEnd(evt) {
    if (track.length > 2 && settings.animate) {
      velocity = calcVelocity();
      requestAnimFrame(animate);
    }
  }

  function calcVelocity() {
    let p1, p2, v, timeDiff, length;

    p1 = track[0];
    p2 = track[track.length - 1];
    timeDiff = p2.timeStamp - p1.timeStamp;
    v = vector.subtraction(p2, p1);
    length = vector.length(v);
    vector.unit(v);
    vector.skalarMult(v, (length / timeDiff) * 20);
    return v;
  }

  function doScroll() {
    let p1, p2, x, y;

    if (track.length > 1) {
      p1 = track[track.length - 1];
      p2 = track[track.length - 2];
      x = p2.x - p1.x;
      y = p2.y - p1.y;
      requestAnimFrame(() => {
        window.scrollBy(x, y);
      });
    }
  }

  function animate() {
    scrollBy(-velocity.x, -velocity.y);
    vector.skalarMult(velocity, 0.95);
    if (vector.length(velocity) > 0.2) {
      requestAnimFrame(animate);
    }
  }

  // Returns true if it is a DOM element
  function isElement(o) {
    return typeof HTMLElement === 'object'
      ? o instanceof HTMLElement // DOM2
      : o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string';
  }

  module.init = function(options) {
    if (typeof options.animate === 'boolean') {
      settings.animate = options.animate;
    }
    if (isElement(options.element)) {
      settings.element = options.element;
    }

    const element = settings.element || document;

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchEnd);
    element.addEventListener('touchleave', handleTouchEnd);
  };

  return module;
})();
