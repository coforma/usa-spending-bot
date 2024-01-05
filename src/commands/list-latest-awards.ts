import log from "npmlog";
import { UsaSpendingAward } from "../types/UsaSpending.js";
import { getAwards } from "../utils/get-awards.js";
import { TrackedRecipient } from "../entity/TrackedRecipient.js";
import { SlackCommand } from "../types/SlackCommand.js";

// create a command to list 5 latest awards from usa spending api for the given recipient id
export const listLatestAwards: SlackCommand = async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  const shortName: string = command.text.trim() || "";

  if (shortName === "") {
    await say("Please provide a short name for the recipient");
    return;
  }

  const trackedRecipient = await TrackedRecipient.findOneBy({
    shortName,
  });

  if (!trackedRecipient) {
    await say(
      `No recipient tracked with short name: ${shortName}, Please track the recipient first using \`add-recipient\` command`,
    );
    return;
  }

  // query the usa spending api for awards for the given recipient id and list the latest 5 awards
  // make api call using got making a post request

  try {
    const awards: UsaSpendingAward["results"] = [];

    for await (const awardsResponse of getAwards(trackedRecipient.uei)) {
      awards.push(...awardsResponse);
    }

    // list the latest 5 awards based on the issued date
    const latestAwards = awards
      .sort((a, b) => {
        const dateA = new Date(a["Start Date"]);
        const dateB = new Date(b["Start Date"]);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);

    const blockMessage = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Latest 5 awards for recipient: ${shortName}, name: ${trackedRecipient.name}`,
          },
        },
        {
          type: "divider",
        },
      ],
    };

    latestAwards.forEach((award, index) => {
      // add a section block for each award with fields for each field
      blockMessage.blocks.push({
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Award ID:*\n ${award["Award ID"]}`,
          },
          {
            type: "mrkdwn",
            text: `*Award Amount:*\n \$${award["Award Amount"].toLocaleString(
              "en-US",
            )}`,
          },
          {
            type: "mrkdwn",
            text: `*Start Date:*\n ${award["Start Date"]}`,
          },
          {
            type: "mrkdwn",
            text: `*End Date:*\n ${award["End Date"]}`,
          },
          {
            type: "mrkdwn",
            text: `*Awarding Agency:*\n ${award["Awarding Agency"]}`,
          },
          {
            type: "mrkdwn",
            text: `*Description:*\n ${award.Description}`,
          },
        ],
      } as any);

      blockMessage.blocks.push({
        type: "divider",
      });
    });

    await say(blockMessage);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    log.error("COMMAND", "Failed to complete command: %s", errMessage);
    await say(`Failed to complete command: ${errMessage}`);
  }
};
