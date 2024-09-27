import React from "react";
import {createRoot} from "react-dom/client";
import {WebSocketProvider} from "./core/providers/WebSocketProvider";
import App from "./App";
import {UserProvider} from "./core/providers/UserProvider";

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
// const host = "127.0.0.1:8080";
const host = window.location.host;
const url = `${protocol}//${host}/messages`;

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <UserProvider>
        <WebSocketProvider url={url}>
            <App/>
        </WebSocketProvider>
    </UserProvider>
);
