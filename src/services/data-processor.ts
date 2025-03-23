import { AppError } from "@/utils/app-error";
import { messageHandlers } from "./message-handlers";
import { messageSender } from "./send-text-message";
import { answerGenerator } from "./answer-generator";
import { z } from "zod";
import { ConversationMessage, StickerMessage } from "@/schemas/message-schemas";
// Esquema para validar apenas a estrutura básica
const baseMessageSchema = z.object({
  data: z.object({
    messageType: z.string(),
  }),
});

class DataProcessor {
  public async processData(data: unknown): Promise<void> {
    try {
      // Extrair o messageType de forma segura
      const baseResult = baseMessageSchema.safeParse(data);
      if (!baseResult.success) {
        throw new AppError("Formato de mensagem inválido ou incompleto", 400);
      }
      const messageType = baseResult.data.data.messageType;

      if (!(messageType in messageHandlers)) {
        throw new AppError(`Tipo de mensagem não suportado: ${messageType}`, 400);
      }

      // Processamento específico para cada tipo de mensagem
      if (messageType === "conversation") {
        // Lidando especificamente com mensagens de conversa
        const handler = messageHandlers.conversation;
        const parsedData = handler.schema.parse(data) as ConversationMessage;
        
        // Processa os dados usando o handler
        await handler.process(parsedData);
        
        // Gera e envia resposta
        const answer = await answerGenerator(parsedData.data.message.conversation);
        await messageSender.sendTextMessage(parsedData.data.key.remoteJid, answer);
      } 
      else if (messageType === "stickerMessage") {
        // Lidando especificamente com mensagens de sticker
        const handler = messageHandlers.stickerMessage;
        const parsedData = handler.schema.parse(data) as StickerMessage;
        
        // Processa os dados usando o handler
        await handler.process(parsedData);
        
        // Aqui você pode adicionar lógica específica para stickers, se necessário
      }

      console.log("Dados processados com sucesso");
    } catch (error) {
      console.error("Erro ao processar os dados:", error);
      throw new AppError("Erro ao processar os dados", 500);
    }
  }
}

export const dataProcessor = new DataProcessor();


