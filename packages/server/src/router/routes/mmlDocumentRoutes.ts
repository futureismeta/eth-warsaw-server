import { Application } from 'express';
import { ReactMMLDocumentServer } from '../ReactMMLDocumentServer';

export const setupMMLDocumentRoutes = (app: Application, MML_DOCUMENT_PATH: string) => {
    const mmlDocumentServer = new ReactMMLDocumentServer(MML_DOCUMENT_PATH);
    app.ws('/mml-document', (ws) => {
        mmlDocumentServer.handle(ws);
    });
};