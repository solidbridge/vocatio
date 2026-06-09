import type Anthropic from "@anthropic-ai/sdk";
import { extractionSchema, type Extraction } from "../extraction-schema";
import { anthropic, EXTRACTION_MODEL } from "./client";
import { extractionSystemPrompt } from "./prompts/extraction";

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

function fieldProp(type: object) {
  return {
    type: "object",
    properties: {
      value: { anyOf: [type, { type: "null" }] },
      confidence: { type: "string", enum: ["high", "medium", "low"] },
    },
    required: ["value", "confidence"],
  };
}

/** JSON schema for the forced tool call, mirroring extractionSchema. */
const recordExtractionTool: Anthropic.Tool = {
  name: "record_extraction",
  description: "Record the structured data extracted from the denial notice.",
  input_schema: {
    type: "object" as const,
    properties: {
      payer_name: fieldProp({ type: "string" }),
      plan_name: fieldProp({ type: "string" }),
      member_id_last4: fieldProp({ type: "string" }),
      patient_name: fieldProp({ type: "string" }),
      denial_date: fieldProp({ type: "string", description: "YYYY-MM-DD" }),
      notice_date: fieldProp({ type: "string", description: "YYYY-MM-DD" }),
      service_denied: fieldProp({ type: "string" }),
      denial_reason_verbatim: fieldProp({ type: "string" }),
      clinical_criteria_cited: fieldProp({ type: "array", items: { type: "string" } }),
      is_pre_service: fieldProp({ type: "boolean" }),
      appeal_instructions_in_letter: fieldProp({ type: "string" }),
      is_mental_health: fieldProp({ type: "boolean" }),
    },
    required: [
      "payer_name",
      "plan_name",
      "member_id_last4",
      "patient_name",
      "denial_date",
      "notice_date",
      "service_denied",
      "denial_reason_verbatim",
      "clinical_criteria_cited",
      "is_pre_service",
      "appeal_instructions_in_letter",
      "is_mental_health",
    ],
  },
};

/**
 * Extract structured denial details from an uploaded document.
 * Accepts PDFs and photos; the document is sent directly to Claude
 * (no separate OCR step).
 */
export async function extractDenial(
  fileBytes: Buffer,
  mime: string,
): Promise<Extraction> {
  const data = fileBytes.toString("base64");

  let documentBlock: Anthropic.ContentBlockParam;
  if (mime === "application/pdf") {
    documentBlock = {
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data },
    };
  } else if (SUPPORTED_IMAGE_TYPES.has(mime)) {
    documentBlock = {
      type: "image",
      source: {
        type: "base64",
        media_type: mime as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        data,
      },
    };
  } else {
    throw new Error(`Unsupported file type: ${mime}. Upload a PDF or photo.`);
  }

  const response = await anthropic().messages.create({
    model: EXTRACTION_MODEL,
    max_tokens: 4000,
    system: extractionSystemPrompt,
    tools: [recordExtractionTool],
    tool_choice: { type: "tool", name: "record_extraction" },
    messages: [
      {
        role: "user",
        content: [
          documentBlock,
          {
            type: "text",
            text: "Extract the denial details from this document using record_extraction.",
          },
        ],
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Extraction failed: model did not return structured data.");
  }

  return extractionSchema.parse(toolUse.input);
}
