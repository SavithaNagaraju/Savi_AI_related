import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const products = [
  { id: "focus-lamp", name: "Focus Lamp", useCase: "remote work", price: 79, stock: 18 },
  { id: "nomad-dock", name: "Nomad Dock", useCase: "remote work", price: 129, stock: 7 },
  { id: "studio-speaker", name: "Studio Speaker", useCase: "presentations", price: 199, stock: 0 },
];

const server = new McpServer({ name: "catalog-assistant", version: "1.0.0" });

server.tool(
  "find_product",
  "Find teaching catalog products by use case and optional maximum price.",
  {
    useCase: z.string().min(1),
    maxPrice: z.number().positive().optional(),
  },
  async ({ useCase, maxPrice }) => {
    const matches = products.filter((product) =>
      product.useCase.includes(useCase.toLowerCase())
      && (maxPrice === undefined || product.price <= maxPrice));

    return {
      content: [{ type: "text", text: JSON.stringify(matches, null, 2) }],
    };
  },
);

server.resource(
  "catalog",
  "catalog://products",
  { description: "Complete teaching catalog", mimeType: "application/json" },
  async (uri) => ({
    contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(products, null, 2) }],
  }),
);

await server.connect(new StdioServerTransport());
