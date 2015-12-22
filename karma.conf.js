// Karma configuration
// Generated on Tue Dec 22 2015 22:16:50 GMT+0100 (Romance Standard Time)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon-chai'],
    files: [],
    reporters: ['progress'],
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: false,
    browsers: ['Chrome', 'Firefox', 'IE'],
    client: {
      mocha: {
        reporter: 'html',
        ui: 'bdd',
      },
    },
    singleRun: true,
    concurrency: Infinity,
  });
}
