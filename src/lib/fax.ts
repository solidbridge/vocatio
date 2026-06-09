/**
 * Phaxio fax delivery (pay-as-you-go, ~$0.07/page). Used for the paid tier's
 * "we fax it for you" option. With PHAXIO_TEST_MODE=true, sends are simulated
 * by Phaxio and nothing is transmitted.
 */

const PHAXIO_API = "https://api.phaxio.com/v2.1/faxes";

export interface FaxResult {
  phaxioId: string;
  status: string;
}

export async function sendFax(params: {
  toNumber: string;
  pdfBytes: Buffer;
  filename: string;
}): Promise<FaxResult> {
  const key = process.env.PHAXIO_API_KEY;
  const secret = process.env.PHAXIO_API_SECRET;
  if (!key || !secret) {
    throw new Error("PHAXIO_API_KEY / PHAXIO_API_SECRET are not set — see .env.example");
  }

  const form = new FormData();
  form.append("to", params.toNumber);
  form.append(
    "file",
    new Blob([new Uint8Array(params.pdfBytes)], { type: "application/pdf" }),
    params.filename,
  );
  if (process.env.PHAXIO_TEST_MODE === "true") {
    form.append("test_fail", "");
  }

  const response = await fetch(PHAXIO_API, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`,
    },
    body: form,
  });

  const body = (await response.json()) as {
    success: boolean;
    message?: string;
    data?: { id: number; status: string };
  };

  if (!response.ok || !body.success || !body.data) {
    throw new Error(`Fax send failed: ${body.message ?? response.statusText}`);
  }

  return { phaxioId: String(body.data.id), status: body.data.status };
}
