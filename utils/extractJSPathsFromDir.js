import { readdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export default /** @returns {Promise<string[]>}*/
async (dir) => {
  let jsPaths = [];

  const files = await readdir(dir);

  for (const file of files) {
    const absolutePath = path.resolve(path.join(dir, file));
    const isDirectory = fs.statSync(absolutePath).isDirectory();

    if (!isDirectory && !file.endsWith('.js')) return;

    jsPaths.push(
      isDirectory ? await extractJSPathsFromDir(absolutePath) : absolutePath,
    );
  }

  return jsPaths.map((jsPath) =>
    jsPath.startsWith('file://') ? jsPath : `file://${jsPath}`,
  );
};
