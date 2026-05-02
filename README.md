# Exchange Rates — MCP Server

A learning project for building [Model Context Protocol (MCP)](https://modelcontextprotocol.io) servers, using [exchangerate.host](https://exchangerate.host/) as the data source.

The project exposes a `convert_currency` MCP tool that converts an amount between any two currencies using real-time rates, and a standalone web UI for manual testing.

---

## What is MCP?

Model Context Protocol is an open standard that lets you expose tools and data sources to AI models (like Claude). An MCP server defines tools that a connected client (Claude Desktop, the MCP Inspector, or a custom agent) can call. This project implements one tool:

| Tool | Description |
|---|---|
| `convert_currency` | Converts an amount from one currency to another using live exchange rates |

---

## Getting an API Key

1. Go to [https://exchangerate.host/](https://exchangerate.host/) and create a free account
2. After signing in, navigate to your **Dashboard**
3. Copy the **API Access Key** shown on the dashboard
4. Paste it into your `.env` file (see [Configuration](#configuration) below)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

---

## Installation

```bash
git clone https://github.com/aravindsridhar66/exchange_rates.git
cd exchange_rates
npm install
```

---

## Configuration

Copy the example env file and add your API key:

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder with your key:

```
EXCHANGERATE_HOST_API_KEY=your_api_key_here
```

---

## Running the MCP Server

### Option 1 — MCP Inspector (recommended for development)

The Inspector gives you a browser UI to call tools interactively:

```bash
npm run build
npx @modelcontextprotocol/inspector node dist/index.js
```

Open the URL printed in the terminal (includes a session token, e.g. `http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=...`), click **Connect**, then go to the **Tools** tab and run `convert_currency`.

### Option 2 — Claude Desktop

Add the server to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "currency-converter": {
      "command": "node",
      "args": ["/absolute/path/to/exchange_rates/dist/index.js"]
    }
  }
}
```

Then build and restart Claude Desktop:

```bash
npm run build
```

The `convert_currency` tool will appear automatically in Claude's tool list.

---

## Running the Web UI

A lightweight Express server with a form-based UI for testing conversions without a connected MCP client:

```bash
npm run build
npm run server
```

Open [http://localhost:3000](http://localhost:3000).

You can type full currency names ("Indian Rupees", "Euros", "Japanese Yen") or 3-letter ISO codes ("INR", "EUR", "JPY") — the UI infers the code as you type and shows a badge confirming it was recognised.

---

## Project Structure

```
exchange_rates/
├── src/
│   ├── index.ts        # MCP server entry point
│   ├── server.ts       # Express web server
│   └── currencyMap.ts  # Currency name → ISO code inference
├── public/
│   └── index.html      # Web UI
├── .env                # API key (not committed)
├── .env.example        # Template for .env
└── .githooks/
    ├── pre-push        # Blocks direct pushes to main
    └── commit-msg      # Strips co-author attribution from commits
```

---

## Git Hooks

This project uses hooks stored in `.githooks/`. They are configured automatically via `core.hooksPath` when you clone, but if they aren't active run:

```bash
git config core.hooksPath .githooks
```

| Hook | Behaviour |
|---|---|
| `pre-push` | Prevents accidental direct pushes to `main` |
| `commit-msg` | Strips any `Co-Authored-By: Claude` lines from commit messages |

Branch protection on GitHub also enforces PRs for all non-admin contributors.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run the MCP server (`dist/index.js`) |
| `npm run server` | Run the web UI server (`dist/server.js`) |
| `npm run dev` | Watch mode — recompile on file changes |
