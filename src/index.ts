import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.EXCHANGERATE_HOST_API_KEY;
if (!API_KEY) {
  throw new Error("EXCHANGERATE_HOST_API_KEY is not set in environment");
}

const server = new McpServer({
  name: "Currency Converter",
  version: "1.0.0",
});

server.tool(
  "convert_currency",
  "Convert an amount from one currency to another using real-time exchange rates",
  {
    amount: z.number().positive().describe("The amount to convert"),
    from: z.string().length(3).describe("Source currency code (e.g. USD)"),
    to: z.string().length(3).describe("Target currency code (e.g. EUR)"),
  },
  async ({ amount, from, to }) => {
    const fromUpper = from.toUpperCase();
    const toUpper = to.toUpperCase();
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromUpper}/${toUpper}/${amount}`;

    let response: Response;
    try {
      response = await fetch(url);
    } catch (err) {
      return {
        isError: true,
        content: [{ type: "text", text: `Network error: ${err instanceof Error ? err.message : String(err)}` }],
      };
    }

    if (!response.ok) {
      return {
        isError: true,
        content: [{ type: "text", text: `API error: ${response.status} ${response.statusText}` }],
      };
    }

    const data = (await response.json()) as Record<string, unknown>;

    if (data["result"] !== "success") {
      const errorType = typeof data["error-type"] === "string" ? data["error-type"] : "unknown-error";
      return {
        isError: true,
        content: [{ type: "text", text: `Conversion failed: ${errorType}` }],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              from: fromUpper,
              to: toUpper,
              amount,
              converted_amount: data["conversion_result"],
              rate: data["conversion_rate"],
              last_updated: data["time_last_update_utc"],
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err: unknown) => {
  console.error("Server error:", err);
  process.exit(1);
});
