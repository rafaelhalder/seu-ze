import { Request, Response, NextFunction } from "express";
import { messageSender } from "@/services/send-text-message";
import { AppError } from "@/utils/app-error";
import { z } from "zod";

// Schema de validação para o body da requisição
const sendMessageSchema = z.object({
  number: z.string().min(1, "Número é obrigatório"),
  text: z.string().min(1, "Texto da mensagem é obrigatório")
});

class MessageSenderController {
  async send(request: Request, response: Response, next: NextFunction) {
    try {
      // Validar o body da requisição
      const { number, text } = sendMessageSchema.parse(request.body);
      
      await messageSender.sendTextMessage(number, text);
      
      response.status(200).json({ 
        success: true,
        message: "Mensagem enviada com sucesso!" 
      });
    } catch (error) {
      next(error);
    }
  }
}

export { MessageSenderController }