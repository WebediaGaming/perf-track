var gulp = require('gulp');
var karma = require('karma');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var rimraf = require('rimraf');

gulp.task('clean', function(done) {
  rimraf('dist', done);
});

gulp.task('build', ['clean'], function() {
  return gulp.src('src/perfTrack.js')
  .pipe(uglify())
  .pipe(rename({
    extname: '.min.js',
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('test-src', function(done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    port: 9876,
    files: [
      'src/perfTrack.js',
      'bower_components/bluebird/js/browser/bluebird.js',
      'tests/*.js',
    ],
    singleRun: true,
  }, function(err) {
    if(err) {
      process.exit(err);
    }
    done();
  }).start();
});

gulp.task('test-dist', ['build'], function(done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    port: 9877,
    files: [
      'dist/perfTrack.min.js',
      'bower_components/bluebird/js/browser/bluebird.js',
      'tests/*.js',
    ],
    singleRun: true,
  }, function(err) {
    if(err) {
      process.exit(err);
    }
    done();
  }).start();
});

gulp.task('test', function(cb) {
  runSequence('test-src', 'test-dist', cb);
});

gulp.task('default', ['test']);
