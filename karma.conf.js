module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon-chai'],
    files: [],
    reporters: ['mocha'],
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: false,
    browsers: ['Chrome', 'Firefox', 'IE'],
    client: {
      mocha: {
        ui: 'bdd',
      },
    },
    singleRun: true,
    concurrency: Infinity,
  });
};
