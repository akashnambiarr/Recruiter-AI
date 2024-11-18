import type { Message } from "../types";

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

// Using a proxy server to handle CORS
const PROXY_URL =
  "https://cors-anywhere.herokuapp.com/https://api.anthropic.com/v1/messages";

export async function getChatResponse(messages: Message[]): Promise<string> {
  if (!API_KEY) {
    throw new Error("Anthropic API key is not configured");
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

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
        system:
          "ou are an AI recruiter conducting interviews to assess candidates for a specific role. Evaluate each response carefully against the job requirements. If a candidate’s profile does not align with the role, professionally and decisively reject their application. Ask follow-up questions only if the candidate's responses are relevant to the job description. Keep your questioning concise by asking one focused question at a time. Maintain professionalism and avoid discussing budget or compensation details at any point.",
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
