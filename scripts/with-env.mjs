// Zero-dependency env loader. Usage: node scripts/with-env.mjs <envFile> <cmd> [args...]
//
// Uses Node's native process.loadEnvFile() to populate process.env, then runs
// the command. Unlike `node --env-file=...`, this sets no exec flag, so nothing
// leaks into NODE_OPTIONS when Next.js re-spawns its dev/build workers.
import { spawn } from "node:child_process"

const [envFile, command, ...args] = process.argv.slice(2)

if (!envFile || !command) {
  console.error("usage: node scripts/with-env.mjs <envFile> <cmd> [args...]")
  process.exit(1)
}

process.loadEnvFile(envFile)

const child = spawn(command, args, {
  stdio: "inherit",
  env: process.env,
  // Resolve .cmd shims (e.g. next) on Windows.
  shell: process.platform === "win32",
})

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exit(code ?? 0)
})
