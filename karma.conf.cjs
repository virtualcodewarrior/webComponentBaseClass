/* eslint-env node */
// Karma configuration
// Generated on Wed Jun 27 2018 18:23:21 GMT-0400 (EDT)

const runSettings = process.argv.reduce((previous, arg, index) => {
	if (index > 3) {
		const parts = arg.split('=');
		if (parts.length === 1) {
			previous[parts[0]] = true;
		} else {
			const subParts = parts[1].split(',').map((subPart) => subPart.trim());
			previous[parts[0]] = (subParts.length > 1) ? subParts : subParts[0];
			if (/^false$|^true$/i.test(previous[parts[0]])) {
				previous[parts[0]] = previous[parts[0]] !== 'false';
			}
		}
	}

	return previous;
}, {});

const preprocessors = {};
const plugins = [
	'karma-jasmine-html-reporter',
	'karma-spec-reporter',
	'karma-jasmine',
	'karma-chrome-launcher',
	'karma-firefox-launcher',
];
const reporters = [
	'progress',
	'kjhtml',
	'spec',
];
let coverageReporter;

// note coverage doesn't work since it doesn't support es6 without a transpiler, will need to wait for a truly es6 compatible coverage tool
if (runSettings.coverage) {
	preprocessors['src/!third_party/**/*.js'] = ['coverage'];
	plugins.push('karma-coverage');
	reporters.push('coverage');
	coverageReporter = {
		type: 'html',
		dir: 'coverage/',
	};
}

module.exports = function(config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [
			'jasmine',
		],


		// list of files / patterns to load in the browser
		files: [
			'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
			'node_modules/@webcomponents/html-imports/html-imports.min.js',
			{ pattern: 'node_modules/@webcomponents/**/*.*', watched: false, served: true, included: false, nocache: true },
			{ pattern: 'src/**/*.js', type: 'module', watched: true, served: true, included: false, nocache: true },
			{ pattern: 'test/**/*.html', type: 'module', watched: true, served: true, included: false, nocache: true },
			{ pattern: 'test/**/*.js', type: 'module', watched: true, served: true, included: true, nocache: true },
		],


		// list of files / patterns to exclude
		exclude: [
		],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors,
		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters,
		coverageReporter,
		plugins,

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
