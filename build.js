/* eslint-env node */
const minify = require('babel-minify');
const fs = require('fs-extra');
const walk = require('walk');
const path = require('path');

const inputPath = 'src';
const outputPath = 'dist';

fs.ensureDirSync(outputPath);
const walker = walk.walk(inputPath, { followLinks: false });

walker.on('file', (p_Root, p_Stat, p_Next) => {
	const info = minify(fs.readFileSync(path.resolve(p_Root, p_Stat.name)), { mangle: { keepClassName: true } }, { sourceType: 'module', sourceMaps: true });
	fs.writeFileSync(path.resolve(outputPath, p_Stat.name), info.code);
	fs.writeFileSync(path.resolve(outputPath, `${p_Stat.name}.map`), JSON.stringify(info.map));
	p_Next();
});
