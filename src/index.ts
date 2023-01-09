import "reflect-metadata";
import log from "npmlog";
import { AppDataSource } from "./data-source.js";
import { exit } from "process";
import { addRecipient } from "./commands/add-recipient.js";
import { listLatestAwards } from "./commands/list-latest-awards.js";
import { checkLatestAwards } from "./background-jobs/check-latest-awards.js";
import { setSlackChannel } from "./commands/set-slack-channel.js";

// check if the app is running not in production
const isLocal = process.env.NODE_ENV !== "production";

/* Add functionality here */
if (isLocal) {
  // load environment variables from .env file
  const { config: StartDotEnv } = await import("dotenv");
  StartDotEnv();
  // configure logger
  log.level = process.env.LOG_LEVEL || "silly";
} else {
  // configure logger
  log.level = process.env.LOG_LEVEL || "warn";
}

// initialize the database
try {
  await AppDataSource.initialize();
} catch (error: unknown) {
  const errMessage = error instanceof Error ? error.message : "Unknown error";
  log.error("APP_START", "Failed to initialize database: %s", errMessage);
  exit(1);
}

// initialize the Slack app
const { SlackApp: app } = await import("./SlackApp.js");

// load all the commands
app.command("/set-slack-channel", setSlackChannel);
app.command("/add-recipient", addRecipient);
app.command("/list-latest-awards", listLatestAwards);

// run background job this limits the application to run on a single server for now
checkLatestAwards(app);

// Start the app
await app.start(process.env.PORT || 3050);

log.info("APP_START", "⚡️ Bolt app is running!");
