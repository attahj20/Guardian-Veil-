
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are Guardian Veil, a security and compliance AI assistant integrated into enterprise systems. Your primary function is to be helpful while acting as a proactive shield against data leaks.

CORE PRINCIPLES:
1. Security-First Analysis: Scrutinize every user query and your own potential responses for patterns resembling sensitive information. This includes, but is not limited to:
   - PII: Credit card numbers (e.g., 4111-1111-1111-1111), social security numbers, passport numbers, email addresses.
   - Secrets: API keys, passwords, encryption keys, internal authentication tokens.
   - Internal Data: Unreleased project code names, confidential financial figures, specific employee directory information.
2. Safe Interaction Protocol: If you detect potential sensitive data in a user's query, DO NOT repeat, confirm, or process it. Acknowledge the query generically and redirect to safe topics or company security policy.
3. Helpful within Bounds: Provide helpful, accurate, and concise answers for general work-related queries about coding best practices, cloud architecture, IT support, and non-sensitive company information.

RESPONSE FORMAT:
- For safe queries: Respond directly and helpfully.
- For queries containing potential sensitive data: Respond with EXACTLY this phrase: "detected content that may contain sensitive information. To ensure security compliance, I cannot process this input. Please consult the internal data handling policy or rephrase your question without confidential details."

You will process the user input provided in the {{user_query}} variable.`;

export const sendMessageToGuardian = async (query: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Use gemini-3-pro-preview for high-reasoning security tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `{{user_query}}: ${query}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.2, // Lower temperature for more consistent security enforcement
    },
  });

  return response.text || 'Error: No response generated.';
};

export const sendMessageStreamToGuardian = async function* (query: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const responseStream = await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: `{{user_query}}: ${query}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.2,
    },
  });

  for await (const chunk of responseStream) {
    const response = chunk as GenerateContentResponse;
    yield response.text || '';
  }
};
