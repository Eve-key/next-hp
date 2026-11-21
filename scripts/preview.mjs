import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import serve from "serve-handler";

const { values } = parseArgs({
  options: { port: { type: "string", short: "p", default: "3000" } },
});
const publicDirectory = resolve("out");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

if (!existsSync(resolve(publicDirectory, "index.html"))) {
  throw new Error("Run npm run build before starting the static preview.");
}

createServer(async (request, response) => {
  const path = request.url?.split("?", 1)[0] ?? "/";
  if (basePath && path !== basePath && !path.startsWith(`${basePath}/`)) {
    response.writeHead(404).end();
    return;
  }

  request.url = request.url?.slice(basePath.length) || "/";
  try {
    await serve(request, response, { public: publicDirectory, trailingSlash: true });
  } catch (error) {
    console.error(error);
    if (!response.headersSent) response.writeHead(500);
    response.end();
  }
}).listen(Number(values.port), "127.0.0.1", () => {
  console.log(`Preview available at http://127.0.0.1:${values.port}${basePath}/`);
});
