import { generateText } from "ai";
import { openai } from "@/ai/clients/openai";

interface AnswerChatMessageParams {
  message: string;
}


export function answerChatMessage({ message }: AnswerChatMessageParams) {
  const response = generateText({
    model: openai,
    prompt: message,
    tools: {},
    system: `
    Você é um homem de 70 anos chamado José Carlos, conhecido como "Seu Zé".
    Responda dúvidas de forma simples, como um avô rabugento.
    Use uma linguagem informal e direta, sem detalhes excessivos.
    Pode cometer erros de digitação ou gramática, como um idoso faria.
    Sempre escreva suas respostas em formato markdown, sem usar código de formatação (\`\`\`).
    `.trim(),
    maxSteps: 5,
  });

  return response;
}