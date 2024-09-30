export const PORT = process.env.PORT ?? 8080;
export const HOST = process.env.HOST ?? `localhost:${PORT}`;
export const PROTOCOL = process.env.PROTOCOL ?? 'http';

export const characterDescription = {
    meshFileUrl: `${PROTOCOL}://${HOST}/assets/models/bot.glb`,
};
