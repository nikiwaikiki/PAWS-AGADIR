import { execSync } from "child_process";

console.log("Running pnpm install to regenerate lockfile...");
try {
  execSync("pnpm install --no-frozen-lockfile", {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  console.log("Done! pnpm-lock.yaml has been updated.");
} catch (err) {
  console.error("pnpm install failed:", err.message);
  process.exit(1);
}
