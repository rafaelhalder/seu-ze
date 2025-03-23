import { AppError } from "@/utils/app-error";
import { messageHandlers } from "./message-handlers";
import { messageSender } from "./send-text-message";
import { answerGenerator } from "./answer-generator";
import { z } from "zod";
import { ConversationMessage, StickerMessage } from "@/schemas/message-schemas";

// Definição de tipo de mensagem suportada para uso seguro como chave
type SupportedMessageType = keyof typeof messageHandlers;

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
      
      // Verificar se o tipo de mensagem é suportado
      if (!this.isValidMessageType(messageType)) {
        throw new AppError(`Tipo de mensagem não suportado: ${messageType}`, 400);
      }

      // Processamento específico para cada tipo de mensagem
      if (messageType === "conversation") {
        await this.handleConversationMessage(data);
      } 
      else if (messageType === "stickerMessage") {
        await this.handleStickerMessage(data);
      }

      console.log("Dados processados com sucesso");
    } catch (error) {
      console.error("Erro ao processar os dados:", error);
      throw error instanceof AppError ? error : new AppError("Erro ao processar os dados", 500);
    }
  }

  private isValidMessageType(messageType: string): messageType is SupportedMessageType {
    return messageType in messageHandlers;
  }

  private async handleConversationMessage(data: unknown): Promise<void> {
    const handler = messageHandlers.conversation;
    const parsedData = handler.schema.parse(data) as ConversationMessage;
    
    // Processa os dados usando o handler
    await handler.process(parsedData);
    
    // Gera e envia resposta
    const answer = await answerGenerator(parsedData.data.message.conversation);
    await messageSender.sendTextMessage(parsedData.data.key.remoteJid, answer);
  }

  private async handleStickerMessage(data: unknown): Promise<void> {
    const handler = messageHandlers.stickerMessage;
    const parsedData = handler.schema.parse(data) as StickerMessage;
    
    // Processa os dados usando o handler
    await handler.process(parsedData);
  }
}

export const dataProcessor = new DataProcessor();


