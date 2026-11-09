import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Self-contained server bundle for the VPS (.next/standalone/server.js).
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  turbopack: {
    rules: {
      // Tailwind only processes our own global stylesheets; CSS Modules and
      // node_modules CSS (maplibre) keep their native handling.
      "*.css": {
        condition: { all: [{ not: "foreign" }, { not: { path: /\.module\.css$/ } }] },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
