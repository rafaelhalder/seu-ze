import { generateText } from "ai";
import { openai } from "../clients";
import { SeuZePersonaPrompt } from "../prompts/assistant-prompts";

interface GenerateAnswerParams {
  message: string;
}

interface GenerateAnswerResult {
  text: string;
}

export async function generateAnswer({ message }: GenerateAnswerParams): Promise<GenerateAnswerResult> {
  const response = await generateText({
    model: openai,
    prompt: message,
    system: SeuZePersonaPrompt,
    maxSteps: 5,
  });

  return {
    text: response.text
  };
}