import { filterMessage } from "../processors/message-filter";
import { generateAnswer } from "../processors/answer-generator";
import { AppError } from "@/utils/app-error";

export class MessageAIService {
  /**
   * Processa uma mensagem recebida, aplicando filtro e gerando resposta
   */
  async processIncomingMessage(message: string, remoteJid: string): Promise<{
    shouldReply: boolean;
    replyText?: string;
    blocked?: boolean;
    blockReason?: string;
  }> {
    // 1. Aplicar filtro na mensagem
    const filterResult = await filterMessage(message);
    
    // 2. Se bloqueado, registrar e não responder
    if (!filterResult.allowed) {
      console.log(`Mensagem bloqueada: ${filterResult.reason}`);
      
      return {
        shouldReply: false,
        blocked: true,
        blockReason: filterResult.reason
      };
    }
    
    // 3. Gerar resposta para mensagem permitida
    try {
      const answer = await generateAnswer({ message });
      
      return {
        shouldReply: true,
        replyText: answer.text
      };
    } catch (error) {
      console.error("Erro ao gerar resposta:", error);
      throw new AppError("Não foi possível gerar uma resposta", 500);
    }
  }
}

export const messageAIService = new MessageAIService();