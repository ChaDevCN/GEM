import { parse } from 'yaml';
import * as path from 'path';
import * as fs from 'fs';

export const getEnv = () => {
	return process.env.RUNNING_ENV || 'dev';
};

export const getConfig = () => {
	const environment = getEnv();
	const yamlPath = path.join(process.cwd(), `./.config/.${environment}.yaml`);
	const file = fs.readFileSync(yamlPath, 'utf8');
	const config = parse(file);
	return config;
};
export const isFileExisted = (path_way) =>
	new Promise((resolve, reject) => {
		fs.access(path_way, (err) => {
			if (err) {
				reject(false);
			} else {
				resolve(true);
			}
		});
	});
