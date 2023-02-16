import { TrackedRecipient } from "../entity/TrackedRecipient.js";
import log from "npmlog";
import { SlackCommand } from "../types/SlackCommand.js";
import { UsaSpendingRecipient } from "../types/UsaSpending.js";

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
            text: "| Name | Short Name | ID |",
          },
        },
        {
          type: "divider",
        },
      ],
    };

    savedRecipients.forEach((recipient) => {
      blockMessage.blocks.push({
        type: "section",
        text:
          {
            type: "mrkdwn",
            text: `| ${recipient.name} | ${recipient.shortName ?? recipient.name} | ${recipient.id} |`
          }
        },
        {
          type: "divider",
        }
      );
    });

    await say(blockMessage);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    log.error("COMMAND", "Failed to complete command: %s", errMessage);
    await say(`Failed to complete command: ${errMessage}`);
  }
};
