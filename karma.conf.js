/* eslint-env node */
// Karma configuration
// Generated on Wed Jun 27 2018 18:23:21 GMT-0400 (EDT)

module.exports = function(config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [
			'jasmine-es6',
			'jasmine',
		],


		// list of files / patterns to load in the browser
		files: [
			{ pattern: 'src/**/*.js', type: 'module', watched: true, served: true, included: false, nocache: true },
			{ pattern: 'test/**/*.html', type: 'module', watched: true, served: true, included: false, nocache: true },
			{ pattern: 'test/**/*.js', type: 'module', watched: true, served: true, included: true, nocache: true },
		],


		// list of files / patterns to exclude
		exclude: [
		],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
		},


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: [
			'progress',
			'kjhtml',
			'spec',
		],

		plugins: [
			'karma-jasmine-html-reporter',
			'karma-spec-reporter',
			'karma-jasmine-es6',
			'karma-jasmine',
			'karma-chrome-launcher',
			'karma-firefox-launcher',
		],

		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chromium', 'Firefox'],

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,
	});
};
