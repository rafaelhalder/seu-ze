import { z } from "zod";
import { prisma } from "@/database/prisma"; // Use a instância centralizada
import { 
  messageUpsertSchema, 
  messageStickerSchema,
  ConversationMessage,
  StickerMessage
} from "@/schemas/message-schemas";

// Interface para os handlers mais específica
interface MessageHandler<T, S extends z.ZodType<T>> {
  schema: S;
  process: (data: T) => Promise<void>;
}

// Tipo que mapeia messageType para handler
type MessageHandlers = {
  conversation: MessageHandler<ConversationMessage, typeof messageUpsertSchema>;
  stickerMessage: MessageHandler<StickerMessage, typeof messageStickerSchema>;
};

// Implementação dos handlers
export const messageHandlers: MessageHandlers = {
  conversation: {
    schema: messageUpsertSchema,
    async process(data: ConversationMessage) {
      console.log("Processando mensagem do tipo conversation:", data);
      // Salvar no banco de dados
      await prisma.message.create({
        data: {
          eventType: data.event,
          remoteJid: data.data.key.remoteJid,
          pushName: data.data.pushName,
          conversation: data.data.message.conversation,
          dateTime: data.date_time,
          messageType: data.data.messageType,
        },
      });
    },
  },
  stickerMessage: {
    schema: messageStickerSchema,
    async process(data: StickerMessage) {
      console.log("Processando mensagem do tipo stickerMessage:", data);
      // Salvar no banco de dados
      await prisma.message.create({
        data: {
          eventType: data.event,
          remoteJid: data.data.key.remoteJid,
          pushName: data.data.pushName,
          conversation: data.data.message.stickerMessage.url,
          dateTime: data.date_time,
          messageType: data.data.messageType,
        },
      });
    },
  },
};