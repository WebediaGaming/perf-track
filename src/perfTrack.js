(function(root, f) {
  if(typeof define === 'function' && define.amd) {
    define([], f);
    return;
  }
  if(typeof exports === 'object') {
    module.exports = f();
    return;
  }
  if(typeof root === 'object' && typeof root.perfTrack === 'undefined') {
    root.perfTrack = f();
  }
})(this, function() {
  var g = window || global;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  var _raf = 'RequestAnimationFrame';
  var _caf = 'CancelAnimationFrame';
  var _altCaf = 'CancelRequestAnimationFrame';

  var cancelAnimationFrame = g.cancelAnimationFrame;
  var requestAnimationFrame = g.requestAnimationFrame;

  for(var x = 0; x < vendors.length && (!requestAnimationFrame || !cancelAnimationFrame); ++x) {
    g.requestAnimationFrame = g[vendors[x]+_raf];
    g.cancelAnimationFrame = g[vendors[x]+_caf] || g[vendors[x]+_altCaf];
  }

  if(
    typeof g === 'undefined' ||
    typeof g.performance === 'undefined' ||
    typeof g.document === 'undefined' ||
    typeof g.requestAnimationFrame !== 'function' ||
    typeof g.cancelAnimationFrame !== 'function'
  ) {
    return;
  }

  var clearTimeout = g.clearTimeout;
  var document = g.document;
  var performance = g.performance;
  var setTimeout = g.setTimeout;

  function perfTrack(opts, onSlowFrame) {
    var frameDurationThreshold = opts.frameDurationThreshold || 200;
    var startAfter = opts.startAfter || 1000;
    var bailOut = opts.bailOut || false;

    var callbackHandle;
    var initialHandle = setTimeout(startMonitoring, startAfter);
    var prevFrame;

    function monitorFrame(currFrame) {
      var frameDuration = currFrame - prevFrame;
      if(frameDuration > frameDurationThreshold && !document.hidden) {
        onSlowFrame(frameDuration);
        if(bailOut) {
          return stopMonitoring();
        }
      }
      prevFrame = currFrame;
      callbackHandle = requestAnimationFrame(monitorFrame);
    }

    function startMonitoring() {
      prevFrame = performance.now();
      initialHandle = null;
      callbackHandle = requestAnimationFrame(monitorFrame);
    }

    function stopMonitoring() {
      if(initialHandle) {
        clearTimeout(initialHandle);
        initialHandle = null;
      }
      if(callbackHandle) {
        cancelAnimationFrame(callbackHandle);
        callbackHandle = null;
      }
    }

    return stopMonitoring;
  }

  return perfTrack;
});
