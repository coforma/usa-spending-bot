import "reflect-metadata"
import { readdirSync } from "fs";
import { config } from "./config.js"
import { AppDataSource } from "./data-source.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { exit } from "process";

// setup npm logger from config
const log = config.log;

// initialize the database
try {
  AppDataSource.initialize();
} catch (error: unknown) {
  const errMessage = error instanceof Error ? error.message : "Unknown error";
  log.error("APP_START", "Failed to initialize database: %s", errMessage);
  exit(1);
}

// initialize the Slack app
const { SlackApp: app } = await import("./SlackApp.js");

// dynamically import all commands from ./commands
// and register them with the SlackApp
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsDir = __dirname + "/commands";
const commandFiles = readdirSync(commandsDir);

commandFiles.forEach(async (file) => {
  if (!file.endsWith(".js")) {
    return;
  }
  await import(`${commandsDir}/${file}`);
});

// Start the app
await app.start(process.env.PORT || 3050);

log.info("APP_START", "⚡️ Bolt app is running!");


