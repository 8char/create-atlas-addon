import fs from 'node:fs';
import path from 'node:path';
import { mkdirp, copy } from './utils.js';

export async function create(cwd, options) {
	mkdirp(cwd);

	writeTemplateFiles(options, cwd);
}

function replaceInFiles(dirPath, searchValue, replaceValue) {
    const files = fs.readdirSync(dirPath);
  
    files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
    
        if (stat.isDirectory()) {
            replaceInFiles(filePath, searchValue, replaceValue);
        } else {
            let content = fs.readFileSync(filePath, 'utf8');
            content = content.replace(searchValue, replaceValue);
            fs.writeFileSync(filePath, content);
        }
    });
}

function writeTemplateFiles(options, cwd) {
	const dir = `templates/${options.template}`
	copy(dir, cwd, (name) => name.replace('$addon-name-underscore$', options.underscore_name));
    console.log(options)

    replaceInFiles(cwd, /\$addon-name-underscore\$/g,   options.underscore_name)
    replaceInFiles(cwd, /\$addon-acronym\$/g,           options.acronym)
    replaceInFiles(cwd, /\$addon-global\$/g,            options.global)
    replaceInFiles(cwd, /\$addon-name\$/g,              options.fancy_name)
}