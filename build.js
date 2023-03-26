/* eslint-env node */
/* eslint { no-console: off } */
import fs from 'fs-extra';
import { minify } from 'terser';
import path from 'path';

const buildSrcPath = path.resolve('./');
const targetPath = path.resolve('./dist');

console.log(`Cleaning target path at ${targetPath}`);
if (fs.existsSync(targetPath)) {
	fs.removeSync(targetPath);
}
fs.ensureDirSync(targetPath);

// minification function
const doMinify = async(src, dst) => {
	// test if the file is a js or jsm file
	const result = /\.jsm?$/.test(src);
	// if it is such a file, try to minify it
	if (result) {
		const fileName = path.basename(dst);

		// minify javascript files, assume modules and create a source map
		const minResult = await minify(fs.readFileSync(src, 'utf8'), {
			mangle: true,
			module: true,
			sourceMap: {
				filename: fileName,
				url: `${fileName}.map`,
				includeSources: true,
			},
			keep_classnames: true,
		});

		fs.outputFileSync(dst, minResult.code);
		const map = JSON.parse(minResult.map);
		map.sources[0] = `../src/${fileName}`;
		fs.outputFileSync(`${dst}.map`, JSON.stringify(map));
	}

	// return false if we minified the file (and thus it was already copied to the proper location) or true when the file still needs to be copied
	return !result;
};

// use copy with a filter that calls minify to do minification at the same time
console.log(`Copy and minify files from src (${buildSrcPath}/src) to target (${targetPath})`);
fs.copy(`${buildSrcPath}/src`, targetPath, { filter: doMinify, preserveTimestamps: true });
