import Anthropic from "@anthropic-ai/sdk";

export const EXTRACTION_MODEL = "claude-sonnet-4-6";
export const GENERATION_MODEL = "claude-sonnet-4-6";

let _client: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set — see .env.example");
  }
  if (!_client) {
    _client = new Anthropic({ maxRetries: 3 });
  }
  return _client;
}
