(function(root, f) {
  // UMD
  // if AMD
  if(typeof define === 'function' && define.amd) {
    define([], f);
    return;
  }
  // if CommonJS
  if(typeof exports === 'object') {
    module.exports = f();
    return;
  }
  // if global
  if(typeof root === 'object' && typeof root.perfTrack === 'undefined') {
    root.perfTrack = f();
  }
})(this, function() {
  var g = window || global;
  // vendor prefixes for requestAnimationFrame / cancelAnimationFrame
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  var _raf = 'RequestAnimationFrame';
  var _caf = 'CancelAnimationFrame';
  var _altCaf = 'CancelRequestAnimationFrame';

  var cancelAnimationFrame = g.cancelAnimationFrame;
  var requestAnimationFrame = g.requestAnimationFrame;

  // try to find requestAnimationFrame / cancelAnimationFrame
  for(var x = 0; x < vendors.length && (!requestAnimationFrame || !cancelAnimationFrame); ++x) {
    requestAnimationFrame = g[vendors[x] + _raf];
    cancelAnimationFrame = g[vendors[x] + _caf] || g[vendors[x]+_altCaf];
  }

  // when the environment isn't appropriate, return a no-op function which returns a no-op function
  if(
    typeof g === 'undefined' ||
    typeof requestAnimationFrame !== 'function' ||
    typeof cancelAnimationFrame !== 'function' ||
    typeof g.document === 'undefined'
  ) {
    return function noopPerfTrack() {
      return function noopStopStracking() {};
    };
  }

  // bind globals once and for all
  var clearTimeout = g.clearTimeout;
  var document = g.document;
  var now = g.Date.now;
  var setTimeout = g.setTimeout;

  /**
  /* Initiate the tracking of slow frames.
  /* @param {Object} opts Tracking options
  /* @param {Number?} opts.frameDurationThreshold Report frames with duration above this number of ms (default 200).
  /* @param {Number?} opts.startAfter Report slow frames only after this number of ms (default 1000).
  /* @param {Boolean} opts.bailOut Automatically stop tracking after the first slow frame (default false).
  /* @param {Function}} onSlowFrame Callback to be invoked when a slow frame occurs.
  /*                                Will receive the duration of the slow frame as its sole parameter.
  /* @returns {Function} Function to manually stop tracking. Automatically called after the first slow frame if
  /*                     {opts.bailOut} is truthy.
  */
  function perfTrack(opts, onSlowFrame) {
    var frameDurationThreshold = opts.frameDurationThreshold || 200;
    var startAfter = opts.startAfter || 1000;
    var bailOut = opts.bailOut || false;

    // Reference to the currently bound requestAnimationFrame handle
    var callbackHandle = null;
    // Date in ms of the last measured frame
    var prevFrame = null;
    // Reference to the currenctly bound setTimeout handle
    var initialHandle = setTimeout(startMonitoring, startAfter);

    // Callback invoked by each requestAnimationFrame
    // Checks the duration of the currenct frame, reports it if its too long, and recursively monitor the next frame
    function monitorFrame() {
      var currFrame = now();
      var frameDuration = currFrame - prevFrame;
      // When a slow frame is reported, signal whether the document is hidden,
      // since browsers will not attempt to generate 60fps when hidden, even if they're not CPU-bound
      if(frameDuration > frameDurationThreshold) {
        onSlowFrame(frameDuration, document.hidden);
        if(bailOut) {
          return stopMonitoring();
        }
      }
      prevFrame = currFrame;
      callbackHandle = requestAnimationFrame(monitorFrame);
    }

    function startMonitoring() {
      initialHandle = null;
      prevFrame = now();
      callbackHandle = requestAnimationFrame(monitorFrame);
    }

    function stopMonitoring() {
      clearTimeout(initialHandle);
      cancelAnimationFrame(callbackHandle);
    }

    return stopMonitoring;
  }

  return perfTrack;
});
