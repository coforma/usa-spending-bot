import log from "npmlog";
import { TrackedRecipient } from "../entity/TrackedRecipient.js";
import { SlackCommand } from "../types/SlackCommand.js";

// create a command to list 5 latest awards from usa spending api for the given recipient id
export const listTrackedRecipients: SlackCommand = async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  try {
    const trackedRecipients = await TrackedRecipient.find();

    if (trackedRecipients.length === 0) {
      await say(
        `No recipients tracked, Please track a recipient first using \`add-recipient\` command`
      );
      return;
    }

    const blockMessage = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:mag: List of tracked recipients`,
          },
        },
        {
          type: "divider",
        },
      ],
    };

    trackedRecipients.forEach((recipient, index) => {
      // create text for each recipient
      const text = `*<https://www.usaspending.gov/recipient/${recipient.usaSpendingRecipientId}/latest|${recipient.name}>*\n Short Name: ${recipient.shortName}\n ID: ${recipient.usaSpendingRecipientId}`;

      // add a section block for each recipient
      blockMessage.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text,
        },
        "accessory": {
          "type": "overflow",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "List Latest Awards"
              },
              "action_id": "list-latest-awards",
              "value": recipient.shortName
            },
          ],
        },
      } as any);
    });

    await say(blockMessage);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    log.error("COMMAND", "Failed to complete command: %s", errMessage);
    await say(`Failed to complete command: ${errMessage}`);
  }
};
