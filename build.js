/* eslint-env node */
/* eslint { no-console: off } */
const fs = require('fs-extra');
// const minifier = require('babel-minify');
const minifier = require('terser').minify;
const path = require('path');

const buildSrcPath = path.resolve('./');
const targetPath = path.resolve('./dist');

console.log(`Cleaning target path at ${targetPath}`);
if (fs.existsSync(targetPath)) {
	fs.removeSync(targetPath);
}
fs.ensureDirSync(targetPath);

// minification function
const minify = (p_Src, p_Dst) => {
	// test if the file is a js or jsm file
	const result = /\.jsm?$/.test(p_Src);
	// if it is such a file, try to minify it
	if (result) {
		const fileName = path.basename(p_Dst);

		// minify javascript files, assume modules and create a source map
		const minResult = minifier(fs.readFileSync(p_Src, 'utf8'), {
			mangle: true,
			module: true,
			sourceMap: {
				filename: fileName,
				url: `${fileName}.map`,
				includeSources: true,
			},
			keep_classnames: true,
		});

		fs.outputFileSync(p_Dst, minResult.code);
		const map = JSON.parse(minResult.map);
		map.sources[0] = `../src/${fileName}`;
		fs.outputFileSync(`${p_Dst}.map`, JSON.stringify(map));
	}

	// return false if we minified the file (and thus it was already copied to the proper location) or true when the file still needs to be copied
	return !result;
};

// use copy sync with a filter that calls minify to do minification at the same time
console.log(`Copy and minify files from src (${buildSrcPath}/src) to target (${targetPath})`);
fs.copySync(`${buildSrcPath}/src`, targetPath, { filter: minify, preserveTimestamps: true });
