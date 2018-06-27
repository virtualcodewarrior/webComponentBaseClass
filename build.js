/* eslint-env node */
const babel = require('babel-core');
const fs = require('fs-extra');
const walk = require('walk');
const path = require('path');

const inputPath = 'src';
const outputPath = 'dist';

fs.ensureDirSync(outputPath);
const walker = walk.walk(inputPath, { followLinks: false });

walker.on('file', (p_Root, p_Stat, p_Next) => {
	fs.writeFileSync(path.resolve(outputPath, p_Stat.name), babel.transform(fs.readFileSync(path.resolve(p_Root, p_Stat.name))));
	p_Next();
});
