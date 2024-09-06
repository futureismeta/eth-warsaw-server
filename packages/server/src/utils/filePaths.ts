import path from 'path';
import url from 'url';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));

// export const webClientBuildDir = path.join(dirname, '../../web-client/build/');
// export const indexContent = fs.readFileSync(
//     path.join(webClientBuildDir, 'index.html'),
//     'utf8',
// );
export const MML_DOCUMENT_PATH = path.join(
    dirname,
    '../../mml-document/build/index.js',
);