import fs from 'node:fs';
import path from 'node:path';

/** @param {string} dir */
export function mkdirp(dir) {
	try {
		fs.mkdirSync(dir, { recursive: true });
	} catch (e) {
		if (e.code === 'EEXIST') return;
		throw e;
	}
}

/** @param {string} path */
export function rimraf(path) {
	(fs.rmSync || fs.rmdirSync)(path, { recursive: true, force: true });
}

/**
 * @template T
 * @param {T} x
 */
function identity(x) {
	return x;
}

export function copy(from, to, rename = identity) {
    if (!fs.existsSync(from)) return;
  
    const stack = [{ from, to }];
  
    while (stack.length > 0) {
      const { from, to } = stack.pop();
      const stats = fs.statSync(from);
  
      if (stats.isDirectory()) {
        mkdirp(to);
        fs.readdirSync(from).forEach((name) => {
          stack.push({
            from: path.join(from, name),
            to: path.join(to, rename(name)),
          });
        });
      } else {
        mkdirp(path.dirname(to));
        fs.copyFileSync(from, to);
      }
    }
  }
  