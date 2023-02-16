import { TrackedRecipient } from "../entity/TrackedRecipient.js";
import log from "npmlog";
import { SlackCommand } from "../types/SlackCommand.js";

// create a command to list recipients already added to the database
export const listTrackedRecipients: SlackCommand = async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  try {
    const savedRecipients = await TrackedRecipient.find();

    const blockMessage = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Recipients:",
          },
        },
        {
          type: "divider",
        },
      ],
    };

    for (const recipient in savedRecipients) {
      blockMessage.blocks.push(
        {
          type: "section",
          text: {
              type: "mrkdwn",
              text: `*Recipient:* ${recipient.name}`
          }
        },
        {
          type: "divider",
        }
      );
    }

    await say(blockMessage);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    log.error("COMMAND", "Failed to complete command: %s", errMessage);
    await say(`Failed to complete command: ${errMessage}`);
  }
};
