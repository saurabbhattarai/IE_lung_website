import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const rootDir = process.cwd();

export async function resolve(specifier, context, nextResolve) {
  // Handle Next.js subpath exports in plain Node runner
  if (specifier === "next/server") {
    return nextResolve("next/server.js", context);
  }
  if (specifier === "next/headers") {
    return nextResolve("next/headers.js", context);
  }
  if (specifier === "next/cache") {
    return nextResolve("next/cache.js", context);
  }

  // 1. Resolve @/ path aliases
  if (specifier.startsWith("@/")) {
    const relativePart = specifier.slice(2);
    const candidateBase = path.resolve(rootDir, relativePart);
    for (const ext of ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.js"]) {
      const candidate = candidateBase + ext;
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return {
          shortCircuit: true,
          url: pathToFileURL(candidate).href,
        };
      }
    }
  }

  // 2. Resolve relative imports without file extensions
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const parentDir = context.parentURL
      ? path.dirname(fileURLToPath(context.parentURL))
      : rootDir;
    const candidateBase = path.resolve(parentDir, specifier);
    for (const ext of ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.js"]) {
      const candidate = candidateBase + ext;
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return {
          shortCircuit: true,
          url: pathToFileURL(candidate).href,
        };
      }
    }
  }

  return nextResolve(specifier, context);
}
