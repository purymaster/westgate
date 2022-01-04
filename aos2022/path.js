// Path
const SRC = 'src',
	DEST = 'dest',
	srcPath = {
		all: `${SRC}/`,
		html: `${SRC}/**/*.html`,
		css: `${SRC}/css/*.css`,
		font: `${SRC}/fonts/*`,
		js: `${SRC}/js/*.js`,
		img: `${SRC}/img/**/*.{png,jpg,jpeg,gif,svg}`,
		include: `${SRC}/inc/`
	},
	destPath = {
		html: `${DEST}/`,
		css: `${DEST}/css/`,
		font: `${DEST}/fonts/`,
		js: `${DEST}/js/`,
		img: `${DEST}/img/`,
		include: `${DEST}/inc/`
	}
	destAll = `${DEST}/**/*.*`

module.exports = {
	srcPath,
	destPath,
	destAll
}