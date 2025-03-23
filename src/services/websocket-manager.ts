import {io, Socket} from "socket.io-client";

interface WebSocketConfig{
  url: string
  options?: object
  alwaysOn: boolean
}

class WebSocketManager {
  private sockets: Map<string,Socket> = new Map();

  public addSocket(name: string, config: WebSocketConfig): void {
    if(this.sockets.has(name)) {
      console.warn(`Socket with name ${name} already exists. Replacing it.`);
      const existingSocket = this.sockets.get(name);
      if (existingSocket && existingSocket.connected) {
        existingSocket.disconnect();
      }
      this.sockets.delete(name);
    }
    
    const socket = io(config.url, config.options || {});

    socket.on("connect", () => {
      console.log(`Socket ${name} connected`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket ${name} disconnected`);
      
      if(config.alwaysOn) {
        socket.connect();
        console.log(`Attempting to reconnect socket ${name}`);
      }
    });

    socket.on("connect_error", (error) => {
      console.error(`Socket ${name} connection error:`, error);
    });

    this.sockets.set(name, socket);
  }

  public getSocket(name:string): Socket | undefined {
    return this.sockets.get(name)
  }

  public removeSocket(name:string): void{
    const socket = this.sockets.get(name)
    if(socket){
      socket.disconnect();
      this.sockets.delete(name);
      console.log(`Socket ${name} removed`);
    }else{
      console.warn(`Socket with name ${name} does not exist.`);
    }
  }
}

export const webSocketManager = new WebSocketManager();