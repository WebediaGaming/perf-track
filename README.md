perf-track
==========

Tiny dependency-free JS perf tracker.

### Usage

```html
<script src='perfTrack.min.js'></script>
<script>
  perfTrack({
    frameDurationThreshold: 200,
    startAfter: 1000,
    bailOut: false,
  }, function(frameDuration, hidden) {
    if(!hidden) {
      ga('send', 'perfTrack', 'slowFrame', window.location.href, frameDuration);
    }
  });
</script>
```

### Options

- `frameDurationThreshold`: the duration threshold, in ms, above which a frame will be reported as slow.
- `startAfter`: don't report slow frames before this timeout.
- `bailOut`: don't report slow frames more than once.

### Running the tests

The tests use `karma` which can be painful to install if you haven't installed native modules before.
You will require:
- a recent-ish version of `node` (4.x+) and `npm` (3.x=)
- an environment capable of running `node-gyp` (see (their tutorial)[https://github.com/nodejs/node-gyp#installation])
- `gulp` globally installed
- `bower` globally installed

Once you're set up,
- run `npm install`
- run `bower install`
- run `gulp test`
