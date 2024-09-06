import { Application } from 'express';
import WebSocket from 'ws';
export const setupMessageRoutes = (app: Application) => {
    const clients = new Set<WebSocket>();

    app.ws('/messages', (ws) => {
        ws.on('message', (msg) => {
            console.log('Received message:', msg);
            clients.forEach((client) => {
                if (client.readyState === ws.OPEN) {
                    client.send( msg);
                }
            });
        });

        ws.on('close', () => {
            clients.delete(ws);
            console.log('WebSocket connection closed');
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        clients.add(ws);
        console.log('New WebSocket connection established');
    });
};