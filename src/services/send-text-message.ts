import axios from 'axios';
import { env } from '@/env';
class MessageSender{
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = env.APIKEY;
    this.apiUrl = env.URL_SEND_MESSAGE_WHATSAPP;
  }

  public async sendTextMessage(number: string, text: string): Promise<void> {
    if (!number || !text) {
      console.error('Os parâmetros "number" e "text" são obrigatórios.');
      throw new Error('Os parâmetros "number" e "text" são obrigatórios.');
    }

    try {
      const response = await axios.post(this.apiUrl, {
        number,
        text,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.apiKey,
        },
      });
      console.log('Mensagem enviada com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }
}

export const messageSender = new MessageSender();