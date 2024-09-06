import path from 'path';
import url from 'url';
import express from 'express';
import enableWs from 'express-ws';
import { Networked3dWebExperienceServer, UserAuthenticator } from '@mml-io/3d-web-experience-server';
import corsSetup from './middleware/corsSetup';
import { setupMMLDocumentRoutes } from './router/routes/mmlDocumentRoutes';
import { setupMessageRoutes } from './router/routes/messageRoutes';
import { MML_DOCUMENT_PATH } from './utils/filePaths';
import { BasicUserAuthenticator } from './auth/BasicUserAuthenticator';
import { characterDescription } from './config/config';
import { readFileSync } from 'fs';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));
const { app } = enableWs(express());
app.enable('trust proxy');

// Apply middleware
app.use('/assets/', corsSetup(), express.static(path.resolve(dirname, '../assets/')));

const webClientBuildDir = path.join(dirname, "../../../../web-client/build");

const indexContent = readFileSync(
    path.join(webClientBuildDir, "index.html"),
    "utf8",
);

setupMessageRoutes(app);

// Networked 3D Web Experience Server setup
const userAuthenticator: UserAuthenticator = new BasicUserAuthenticator(characterDescription, {
    devAllowUnrecognizedSessions: true,
});

const networked3dWebExperienceServer = new Networked3dWebExperienceServer({
    networkPath: '/network',
    userAuthenticator,
    webClientServing: {
        indexUrl: "/",
        indexContent,
        clientBuildDir: webClientBuildDir,
        clientUrl: '/web-client/',
        sessionTokenPlaceholder: 'SESSION.TOKEN.PLACEHOLDER',
        clientWatchWebsocketPath: process.env.NODE_ENV !== 'production' ? '/web-client-build' : undefined,
    },
    assetServing: {
        assetsDir: path.resolve(dirname, '../assets/'),
        assetsUrl: '/assets/',
    },
});

networked3dWebExperienceServer.registerExpressRoutes(app);

// Setup routes
setupMMLDocumentRoutes(app, MML_DOCUMENT_PATH);

export { app };