import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const products = [
  {
    id: "focus-lamp",
    name: "Focus Lamp",
    category: "lighting",
    description: "Adjustable desk lighting for remote work and video calls.",
    price: 79,
    stock: 18,
  },
  {
    id: "nomad-dock",
    name: "Nomad Dock",
    category: "connectivity",
    description: "Compact USB-C dock for a portable or remote workstation.",
    price: 129,
    stock: 7,
  },
  {
    id: "studio-speaker",
    name: "Studio Speaker",
    category: "audio",
    description: "Clear room audio for music, reviews, and presentations.",
    price: 199,
    stock: 0,
  },
];

const server = new McpServer({
  name: "product-catalog",
  version: "1.0.0",
});

server.tool(
  "find_product",
  "Find catalog products by name, category, description, and optional maximum price.",
  {
    query: z.string().min(1).describe("Words describing the desired product or use case"),
    maxPrice: z.number().positive().optional().describe("Maximum price in US dollars"),
  },
  async ({ query, maxPrice }) => {
    const normalizedQuery = query.toLowerCase();
    const matches = products.filter((product) => {
      const searchable = `${product.name} ${product.category} ${product.description}`.toLowerCase();
      return searchable.includes(normalizedQuery) && (maxPrice === undefined || product.price <= maxPrice);
    });

    return {
      content: [
        {
          type: "text",
          text: matches.length > 0
            ? JSON.stringify(matches, null, 2)
            : "No products matched the query and price limit.",
        },
      ],
    };
  },
);

server.resource(
  "product-catalog",
  "catalog://products",
  { description: "The complete teaching product catalog", mimeType: "application/json" },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(products, null, 2),
      },
    ],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Product catalog MCP server connected over stdio.");
