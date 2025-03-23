import { z } from "zod";

// Esquema base comum a todos os tipos de mensagens
const baseMessageSchema = z.object({
  event: z.string(),
  data: z.object({
    key: z.object({
      remoteJid: z.string(),
    }),
    pushName: z.string(),
    instanceId: z.string(),
    // Não incluímos messageType ou message aqui, pois variam
  }),
  date_time: z.string(),
});

// Esquema para mensagens com "conversation"
export const messageUpsertSchema = baseMessageSchema.extend({
  data: baseMessageSchema.shape.data.extend({
    messageType: z.literal("conversation"),
    message: z.object({
      conversation: z.string(),
    }),
  }),
});

// Esquema para mensagens com "stickerMessage"
export const messageStickerSchema = baseMessageSchema.extend({
  data: baseMessageSchema.shape.data.extend({
    messageType: z.literal("stickerMessage"),
    message: z.object({
      stickerMessage: z.object({
        url: z.string(),
      }),
    }),
  }),
});

// Inferir os tipos TypeScript
export type ConversationMessage = z.infer<typeof messageUpsertSchema>;
export type StickerMessage = z.infer<typeof messageStickerSchema>;

// União de todos os tipos de mensagens
export type WhatsAppMessage = ConversationMessage | StickerMessage;