/**
 * @desc 自动加载/config目录下的文件
 */
const fs = require('fs');

module.exports = function(fileContent) {
	const configPath = this.resourcePath.replace('src/pro-cfg.js', 'config');
	const configFiles = fs.readdirSync(configPath);
	if(configFiles.length === 0) return fileContent;
	let importCodes = '', exportCodes = '';
    configFiles.forEach(filename => {
		const name = filename.replace('.js', '');
		importCodes += `import ${ name } from '../config/${ filename }';\n`;
		exportCodes += `${ name },\n`;
	});
	
	const content = `${ importCodes }
		export default [
			${ exportCodes }
		];
	`;
    return content;
}