/*

npm install gulp --save-dev
npm install gulp -g
npm install gulp-cli -g

npm install del --save-dev
npm install gulp-file-include --save-dev
npm install gulp-wait --save-dev
npm install gulp-pretty-html --save-dev
npm install gulp-remove-empty-lines --save-dev
npm install browser-sync --save-dev
npm install gulp-autoprefixer --save-dev
npm install gulp-beautify --save-dev
npm install gulp-imagemin --save-dev

*/

"use strict";

const { watch, src, dest, series, parallel, lastRun } = require('gulp'),
	del = require('del'),
	include = require('gulp-file-include'),
	pretty = require('gulp-pretty-html'),
	removeline = require('gulp-remove-empty-lines'),
	sync = require('browser-sync').create(),
	prefix = require('gulp-autoprefixer'),
	beautify = require('gulp-beautify'),
	imagemin = require('gulp-imagemin'),
	{ srcPath, destPath } = require('./path.js'),
	{ alertType, alertColor, alertMsg } = require('./msg.js');

// Error
function handleError(err) {
	console.log(`
${alertType.error}
${err.message}
	`);
	this.emit('end');
};

// Clean
function clean(done) {
	del(destAll);
	console.log(alertColor.red, `${alertType.system} ${alertMsg.clean}`);
	done();
};

// HTML
function htmlBuild(done) {
	return src(srcPath.html)
		.pipe(include({
			prefix: '@@',
			basepath: srcPath.include
		}).on('error', handleError))
		.pipe(pretty({
			indent_with_tabs: true,
			unformatted: []
		}))
		// .pipe(removeline())
		.pipe(dest(destPath.html))
	done();
};

// CSS
function cssBuild(done) {
	return src(srcPath.css, { since: lastRun(cssBuild) })
		.pipe(prefix({
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		}).on('error', handleError))
		.pipe(dest(destPath.css))
	done();
};

// JS
function jsBuild(done) {
	return src(srcPath.js, { since: lastRun(jsBuild) })
		.pipe(beautify())
		.pipe(dest(destPath.js))
	done();
};

// Fonts
function fontBuild(done) {
	return src(srcPath.font, { since: lastRun(fontBuild) })
		.pipe(dest(destPath.font))
	done();
};

// Image
function imageBuild(done) {
	return src(srcPath.img, { since: lastRun(imageBuild) })
		.pipe(imagemin({
			progressive: true,
			interlaced: true,
			optimizationLevel: 7,
			svgoPlugins: [{ removeViewBox: false }],
			verbose: true,
			use: []
		}))
		.pipe(dest(destPath.img))
	done();
};

// BrowserSync
function browserSync(done) {
	sync.init({
		port: 8080,
		server: {
			baseDir: './',
			index: 'index.html'
		},
		browser: ['google chrome', 'chrome']
		// browser: ['google chrome', 'chrome', 'firefox', 'iexplore', 'opera', 'safari']
	});
	done();
};

// Reload
function reload(done) {
	sync.reload();
	done();
};

// Watch
function watchFile(done) {
	const watcher = watch(srcPath.html);

	watcher.on('change', function (path) {
		console.log(alertColor.green, `${alertType.system} [${path}] ${alertMsg.change}`);
	}).on('add', function (path) {
		console.log(alertColor.yellow, `${alertType.system} [${path}] ${alertMsg.add}`);
	}).on('unlink', function (path) {
		console.log(alertColor.yellow, `${alertType.system} [${path}] ${alertMsg.remove}`);
	});

	watch(srcPath.html, series(htmlBuild, parallel(reload)));
	watch(srcPath.css, series(cssBuild, parallel(reload)));
	watch(srcPath.js, series(jsBuild, parallel(reload)));
	watch(srcPath.font, series(fontBuild, parallel(reload)));
	watch(srcPath.img, series(imageBuild, parallel(reload)));
	done();
};

exports.default = series(clean, parallel(htmlBuild, cssBuild, jsBuild, fontBuild, imageBuild), browserSync, watchFile);