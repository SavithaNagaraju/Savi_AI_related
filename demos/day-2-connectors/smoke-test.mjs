import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const serverPath = fileURLToPath(new URL("./product-catalog-server.mjs", import.meta.url));
const client = new Client({ name: "course-smoke-test", version: "1.0.0" });
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [serverPath],
});

try {
  await client.connect(transport);

  const tools = await client.listTools();
  assert(tools.tools.some((tool) => tool.name === "find_product"));

  const resources = await client.listResources();
  assert(resources.resources.some((resource) => resource.uri === "catalog://products"));

  const result = await client.callTool({
    name: "find_product",
    arguments: { query: "remote", maxPrice: 150 },
  });
  const resultText = result.content.find((item) => item.type === "text")?.text ?? "";
  assert.match(resultText, /Focus Lamp/);
  assert.match(resultText, /Nomad Dock/);

  console.log("MCP demo passed: tool, resource, and filtered results are available.");
} finally {
  await client.close();
}
