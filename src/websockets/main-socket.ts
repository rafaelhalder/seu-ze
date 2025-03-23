import { webSocketManager } from "@/services/websocket-manager";
import { dataProcessor } from "@/services/data-processor";

export function setupMainSocket(){
  webSocketManager.addSocket("whatsapp",{
    url: "wss://hsapi.studio/seuze",
    options:{
      transports: ["websocket"],
      reconnectionAttempts: 5,
    },
    alwaysOn: true
  });

  const mainSocket = webSocketManager.getSocket('whatsapp');
  if(mainSocket){
    mainSocket.on('messages.upsert', async (data) => {
      // console.log('Mensagem recebida no WebSocket principal:', data);
      await dataProcessor.processData(data);
    });
    // mainSocket.onAny((event, ...args) => {
    //   console.log(`Evento recebido: ${event}`, args);
    // });
  }else{
    console.error(`Socket "whatsapp" não encontrado.`);
  }

}