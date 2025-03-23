import { webSocketManager } from "@/services/websocket-manager";
import { dataProcessor } from "@/services/data-processor";
import { env } from "@/env";

export function setupWhatsAppSocket() {
  const socketName = "whatsapp";
  const socketUrl = `wss://hsapi.studio/${env.INSTANCE}`;
  
  webSocketManager.addSocket(socketName, {
    url: socketUrl,
    options: {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    },
    alwaysOn: true
  });

  const whatsAppSocket = webSocketManager.getSocket(socketName);
  
  if(whatsAppSocket) {
    // Registrar handlers para eventos
    whatsAppSocket.on('messages.upsert', async (data) => {
      await dataProcessor.processData(data);
    });
    
    console.log(`WhatsApp WebSocket (${socketName}) configurado com sucesso`);
  } else {
    console.error(`Falha ao configurar socket ${socketName}`);
  }
}