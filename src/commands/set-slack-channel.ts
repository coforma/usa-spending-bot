import { SlackConfig } from "../entity/SlackConfig.js";
import log from "npmlog";
import { SlackCommand } from "../types/SlackCommand.js";

// create a command to add a new entry into the sqlite database
export const setSlackChannel: SlackCommand = async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  const input = command.text.trim().split(" ");
  const slackChannelId: string = input[0] || "";

  if (slackChannelId === "") {
    await say("Please provide a slack channel id to post new awards.");
    return;
  }

  try {
    const slackConfigs = await SlackConfig.find();

    if (slackConfigs.length === 0) {
      const slackConfig = new SlackConfig();
      slackConfig.slackChannelId = slackChannelId;
      await slackConfig.save();
    } else {
      const slackConfig = slackConfigs[0];
      slackConfig.slackChannelId = slackChannelId;
      await slackConfig.save();
    }

    await say(`Set slack channel to: ${slackChannelId}`);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    log.error("COMMAND", "Failed to complete command: %s", errMessage);
    await say(`Failed to complete command: ${errMessage}`);
  }
};
