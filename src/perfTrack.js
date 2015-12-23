
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // Register as an anonymous AMD module:
    define(factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS:
    module.exports = factory;
  } else {
    // Browser globals:
    window.perfTrack = factory;
  }
}(function(window) {
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  var _raf = 'RequestAnimationFrame';
  var _caf = 'CancelAnimationFrame';
  var _altCaf = 'CancelRequestAnimationFrame';

  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+_raf];
    window.cancelAnimationFrame = window[vendors[x]+_caf] || window[vendors[x]+_altCaf];
  }

  if(
    typeof window === 'undefined' ||
    typeof window.performance === 'undefined' ||
    typeof window.document === 'undefined' ||
    typeof window.requestAnimationFrame !== 'function' ||
    typeof window.cancelAnimationFrame !== 'function' ||
    typeof window.perfTrack !== 'undefined'
  ) {
    return;
  }

  return function(opts, onSlowFrame) {
    var frameDurationThreshold = opts.frameDurationThreshold || 200;
    var startAfter = opts.startAfter || 1000;
    var ignoreVisibilityChange = opts.ignoreVisibilityChange || false;
    var bailOut = opts.bailOut || false;

    var cancelAnimationFrame = window.cancelAnimationFrame;
    var clearTimeout = window.clearTimeout;
    var document = window.document;
    var performance = window.performance;
    var requestAnimationFrame = window.requestAnimationFrame;
    var setTimeout = window.setTimeout;

    var callbackHandler = null;
    var stopped = false;
    var startedOnce = false;

    var initialTime = performance.now();
    var prevFrame = initialTime;
    var initialHandle = setTimeout(startMonitoring, startAfter);

    function monitorFrame() {
      var currFrame = performance.now();
      var frameDuration = currFrame - prevFrame;
      if(frameDuration > frameDurationThreshold) {
        onSlowFrame(frameDuration);
        if(bailOut) {
          return stopTracking();
        }
      }
      prevFrame = currFrame;
      callbackHandler = requestAnimationFrame(monitorFrame);
    }

    function startMonitoring() {
      startedOnce = true;
      if(callbackHandler) {
        return;
      }
      prevFrame = performance.now();
      callbackHandler = requestAnimationFrame(monitorFrame);
    }

    function stopMonitoring() {
      if(!callbackHandler) {
        return;
      }
      cancelAnimationFrame(callbackHandler);
      callbackHandler = null;
    }

    function handleVisibilityChange() {
      if(ignoreVisibilityChange) {
        return;
      }
      if(document.hidden) {
        return stopMonitoring();
      }
      if(startedOnce) {
        return startMonitoring();
      }
      var now = performance.now();
      clearTimeout(initialHandle);
      initialHandle = setTimeout(startMonitoring, now - initialTime + startAfter);
    }

    function stopTracking() {
      if(stopped) {
        return;
      }
      stopped = true;
      stopMonitoring();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return stopTracking;
  }
}(window)))
