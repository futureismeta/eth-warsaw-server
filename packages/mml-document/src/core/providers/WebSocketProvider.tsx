import React, { createContext, useEffect, useState } from "react";
import { WebSocketClient } from "../websocket";

interface WebSocketContextProps {
    clients: Record<string, WebSocketClient>;
    sendMessage: (userId: string, message: string) => void;
    connections: Set<string>;
}

const WebSocketContext = createContext<WebSocketContextProps>({
    clients: {},
    sendMessage: () => {
        console.error("WebSocket not connected");
    },
    connections: new Set(),
});

export const WebSocketProvider: React.FC<{ url: string }> = ({ url, children }) => {
    const [clients, setClients] = useState<Record<string, WebSocketClient>>({});
    const [connections, setConnections] = useState<Set<string>>(new Set());

    useEffect(() => {
        const handleConnected = (e: CustomEvent) => {
            const userId = e.detail.connectionId;
            if (clients[userId]) {
                return; // Client already exists
            }

            const wsClient = new WebSocketClient(url);
            setClients((prevClients) => ({
                ...prevClients,
                [userId]: wsClient,
            }));

            wsClient.on("connected", () => {
                setConnections((prevConnections) => {
                    const newConnections = new Set(prevConnections);
                    newConnections.add(userId); // Use userId as the connection ID
                    return newConnections;
                });
            });

            wsClient.sendMessage(JSON.stringify({ type: "connect", userId }));
        };

        window.addEventListener("connected", handleConnected as EventListener);

        return () => {
            window.removeEventListener("connected", handleConnected as EventListener);
            // Disconnect all clients on cleanup
            Object.values(clients).forEach(client => client.disconnect());
        };
    }, [url, clients]);

    const sendMessage = (userId: string, message: string) => {
        const client = clients[userId];
        if (client) {
            client.sendMessage(message);
        } else {
            console.error(`WebSocket client for user ${userId} is not connected.`);
        }
    };

    return (
        <WebSocketContext.Provider value={{ clients, sendMessage, connections }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export { WebSocketContext };
