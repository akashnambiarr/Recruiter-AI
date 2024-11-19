import type { Message, JobDescription } from "../types";

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

// Using a proxy server to handle CORS
const PROXY_URL =
  "https://cors-anywhere.herokuapp.com/https://api.anthropic.com/v1/messages";

export async function getChatResponse(
  messages: Message[],
  jobDescription: JobDescription,
): Promise<string> {
  if (!API_KEY) {
    throw new Error("Anthropic API key is not configured");
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const systemPrompt = `You are an HR professional conducting initial screening interviews for a ${jobDescription.title} position. Your goal is to evaluate candidate fit before recommending them for technical interviews with the hiring manager.

Job Requirements:
${jobDescription.requirements.map((req) => `- ${req}`).join("\n")}

Required Technical Skills:
${jobDescription.skills.map((skill) => `- ${skill}`).join("\n")}

Your role is to:
1. Focus on asking questions about experience fit and role alignment
2. Verify years of experience and basic qualifications
3. Ask only ONE focused question at a time and wait for complete responses
4. Keep questions at a high level - no technical deep dives
5. If candidates ask technical questions, respond with "Those details would be best discussed with the hiring manager during the technical interview phase. For now, let's focus on your overall experience and background."
6. Maintain professionalism throughout the screening
7. If candidates meet basic qualifications, indicate they will be recommended for next round
8. If candidates don't meet minimum requirements, professionally close the conversation

Remember to stay focused on screening for basic fit and qualifications. This is an initial HR round to determine if the candidate should proceed to technical interviews with the hiring manager.`;

    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": API_KEY,
        "anthropic-dangerous-direct-browser-access": "true",
        Origin: window.location.origin,
        "X-Requested-With": "XMLHttpRequest",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: messages.map((msg) => ({
          role: msg.sender === "ai" ? "assistant" : "user",
          content: msg.content,
        })),
        system: systemPrompt,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", errorData);
      throw new Error(
        errorData.error?.message ||
          `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    if (!data.content?.[0]?.text) {
      console.error("Invalid API Response:", data);
      throw new Error("Invalid response format from API");
    }

    return data.content[0].text;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out - Please try again");
      }
      throw new Error(`API Error: ${error.message}`);
    }
    throw new Error(
      "An unexpected error occurred while contacting the AI service",
    );
  }
}
