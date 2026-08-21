import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  clean: true,
  sourcemap: true,
  noExternal: [
    "@javaquets/config",
    "@javaquets/database",
    "@javaquets/shared",
    "@javaquets/validation",
  ],
});
