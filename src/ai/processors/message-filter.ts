import { generateText } from "ai";
import { openai } from "../clients";
import { ContentFilterPrompt } from "../prompts/filter-prompts";

interface FilterResult {
  allowed: boolean;
  reason?: string;
}

export async function filterMessage(message: string): Promise<FilterResult> {
  try {
    const response = await generateText({
      model: openai,
      prompt: message,
      system: ContentFilterPrompt,
      maxSteps: 2,
    });

    // Tentar fazer parse do JSON de resposta
    const result = JSON.parse(response.text);
    return {
      allowed: result.allowed,
      reason: result.reason
    };
  } catch (error) {
    console.error("Erro ao filtrar mensagem:", error);
    // Por padrão, permita a mensagem em caso de erro no filtro
    return { allowed: true };
  }
}