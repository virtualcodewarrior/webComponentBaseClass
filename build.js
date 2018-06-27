/* eslint-env node */
const minify = require('babel-minify');
const fs = require('fs-extra');
const walk = require('walk');
const path = require('path');

const inputPath = 'src';
const outputPath = 'dist';

fs.ensureDirSync(outputPath);
const walker = walk.walk(inputPath, { followLinks: false });
fs.emptyDirSync(outputPath);

walker.on('file', (p_Root, p_Stat, p_Next) => {
	const fileContent = fs.readFileSync(path.resolve(p_Root, p_Stat.name));
	const info = minify(fileContent, { mangle: { keepClassName: true } }, { sourceType: 'module', sourceMaps: true });
	// for some reason babel doesn't add the source map line, so do it here manually
	fs.writeFileSync(path.resolve(outputPath, p_Stat.name), `${info.code}\n//@ sourceMappingURL=${p_Stat.name}.map`);
	// for some reason babel doesn't do this, even if I set the appropriate options
	// so set the source here manually
	info.map.sources[0] = p_Stat.name;
	fs.writeFileSync(path.resolve(outputPath, `${p_Stat.name}.map`), JSON.stringify(info.map));
	p_Next();
});
