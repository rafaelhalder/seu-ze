export async function answerGenerator(question: string): Promise<string> {
  // Simulando uma chamada para um serviço de IA
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Resposta gerada para a pergunta: ${question}`);
    }, 2000); // Simula um atraso de 2 segundos
  });
}