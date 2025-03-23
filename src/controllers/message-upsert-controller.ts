import { Request,Response,NextFunction } from "express";
import { messageSender } from "@/services/send-text-message";

class MessageUpsertController{
  async send(request: Request, response: Response, next: NextFunction){
      try {
        const { number, text } = request.body;
        await messageSender.sendTextMessage(number, text);
        response.status(200).json({ message: "Mensagem enviada com sucesso!" });
      } catch (error) {
        response.status(500).json({ error: "Erro ao enviar mensagem." });
      }
  }
}

export {MessageUpsertController}