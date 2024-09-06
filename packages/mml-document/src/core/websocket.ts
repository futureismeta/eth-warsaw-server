class WebSocketClient {
  private ws: WebSocket;
  private eventListeners: { [event: string]: ((data: any) => void)[] } = {};

  constructor(url: string = "ws://default.url") {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("WebSocket connection opened:", url);
      this.dispatchEvent("connected");
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed:", url);
    };

    this.ws.onmessage = (event) => {
      this.dispatchEvent("message", event.data);
    };
  }

  sendMessage(message: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      console.log("Sending message:", message);
      this.ws.send(message);
    } else {
      console.error("WebSocket is not open. Ready state is:", this.ws.readyState);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  private dispatchEvent(event: string, data?: any) {
    const listeners = this.eventListeners[event];
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  disconnect() {
    if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
      this.ws.close();
    }
  }
}

export { WebSocketClient };
