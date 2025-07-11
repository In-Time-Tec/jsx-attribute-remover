import { build } from "bun";

await build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "node",
  format: "esm",
  sourcemap: "external",
  external: ["vite", "@babel/core", "@babel/parser", "@babel/traverse", "@babel/generator"],
});