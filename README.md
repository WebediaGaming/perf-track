perf-track
==========

Tiny dependency-free JS perf tracker.

### Usage

```html
<script src='perfTrack.min.js'></script>
<script>
  perfTrack({
    ignoreVisibilityChange: false,
    frameDurationThreshold: 200,
    startAfter: 1000,
    bailOut: false,
  }, function(frameDuration) {
    ga('send', 'perfTrack', 'slowFrame', window.location.href, frameDuration);
  });
</script>
```

### Options

- `ignoreVisibilityChange`: unless set to false, will ignore slow frames when the document is not visible; browsers
can and will reduce framerate to preserve resources when the document is not visible, leading to false positives.
- `frameDurationThreshold`: the duration threshold, in ms, above which a frame will be reported as slow.
- `startAfter`: don't report slow frames before this timeout.
- `bailOut`: don't report slow frames more than once.
