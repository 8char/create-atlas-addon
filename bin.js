#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import * as p from '@clack/prompts';
import { bold, cyan, grey } from 'kleur/colors';
import { create } from './index.js';
import { dist } from './utils.js';

const { version } = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'));
let cwd = process.argv[2] || '.';

console.log(`
${grey(`create-atlas-addon version ${version}`)}
`);

p.intro('Welcome to AtlasFramework!');

if (cwd === '.') {
	const dir = await p.text({
		message: 'Where should we create your project?',
		placeholder: '  (hit Enter to use current directory)'
	});

	if (p.isCancel(dir)) process.exit(1);

	if (dir) {
		cwd = /** @type {string} */ (dir);
	}
}

if (fs.existsSync(cwd)) {
	if (fs.readdirSync(cwd).length > 0) {
		const force = await p.confirm({
			message: 'Directory not empty. Continue?',
			initialValue: false
		});

		// bail if `force` is `false` or the user cancelled with Ctrl-C
		if (force !== true) {
			process.exit(1);
		}
	}
}

const options = await p.group(
	{
		template: () =>
			p.select({
				message: 'Which AtlasFramework app template?',
				// @ts-expect-error i have no idea what is going on here
				options: fs.readdirSync(dist('templates')).map((dir) => {
					const meta_file = dist(`templates/${dir}/meta.json`);
					const { title, description } = JSON.parse(fs.readFileSync(meta_file, 'utf8'));

					return {
						label: title,
						hint: description,
						value: dir
					};
				})
			}),

        fancy_name: () =>
            p.text({
                message: 'What should the "Fancy Name" name be?',
                placeholder: 'My Addon'
            }),

		underscore_name: () =>
			p.text({
				message: 'What should the underscore name be?',
				placeholder: 'my_addon'
			}),

		global: () =>
			p.text({
				message: 'What should the global variable be?',
				placeholder: 'PersonAddon'
			}),

        acronym: () =>
			p.text({
				message: 'What should the acronym be?',
				placeholder: 'MyAddon'
			}),

		// features: () =>
		// 	p.multiselect({
		// 		message: 'Select additional options (use arrow keys/space bar)',
		// 		required: false,
		// 		options: [
		// 			{
		// 				value: 'eslint',
		// 				label: 'Add ESLint for code linting'
		// 			},
		// 			{
		// 				value: 'prettier',
		// 				label: 'Add Prettier for code formatting'
		// 			},
		// 			{
		// 				value: 'playwright',
		// 				label: 'Add Playwright for browser testing'
		// 			},
		// 			{
		// 				value: 'vitest',
		// 				label: 'Add Vitest for unit testing'
		// 			}
		// 		]
		// 	})
	},
	{ onCancel: () => process.exit(1) }
);


const s = p.spinner();
s.start("Copying over template files...");

await create(cwd, {
	name: path.basename(path.resolve(cwd)),
	template: /** @type {'skeleton'} */ (options.template),
	types: options.types,
	fancy_name: options.fancy_name,
	underscore_name: options.underscore_name,
	global: options.global,
	acronym: options.acronym
});

s.stop("Copied over template files!")

p.outro(`Your project is ready!`);


console.log(bold('✔ Fancy Name'));
console.log(cyan(`  ${options.fancy_name}\n`));

console.log(bold('✔ Underscore Name'));
console.log(cyan(`  ${options.underscore_name}\n`));

console.log(bold('✔ Global Variable Name'));
console.log(cyan(`  ${options.global}\n`));

console.log(bold('✔ Acronym Name'));
console.log(cyan(`  ${options.acronym}\n`));


console.log('\nNext steps:');
let i = 1;

const relative = path.relative(process.cwd(), cwd);
if (relative !== '') {
	console.log(`  ${i++}: ${bold(cyan(`cd ${relative}`))}`);
}

console.log(`  ${i++}: ${bold(cyan('git init && git add -A && git commit -m "Initial commit"'))} (optional)`);
console.log(`  ${i++}: ${bold(cyan('laux workspace'))}`);
console.log(`  ${i++}: ${bold(cyan('Run your server!'))}`);

console.log(`\nTo close the dev server, hit ${bold(cyan('Ctrl-C'))}`);
console.log(`\nStuck? Visit us at ${cyan('https://discord.gg/glua')}`);
