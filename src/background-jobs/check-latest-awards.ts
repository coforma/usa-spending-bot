import log from "npmlog";
import { setTimeout } from "timers/promises";
import { Award } from "../entity/Award.js";
import { TrackedRecipient } from "../entity/TrackedRecipient.js";
import { UsaSpendingAwardResult } from "../types/UsaSpending.js";
import { getAwards } from "../utils/get-awards.js";
import { SlackConfig } from "../entity/SlackConfig.js";
import { App } from "@slack/bolt";

export async function checkLatestAwards(app: App) {
  while (true) {
    // do something
    const trackedRecipients = await TrackedRecipient.find();

    if (trackedRecipients.length === 0) {
      log.info("BACKGROUND_JOB", "No tracked recipients found.");
    } else {
      for (const trackedRecipient of trackedRecipients) {
        const latestAwardFromDb = trackedRecipient.awards.reduce(
          (prev, current) => {
            const prevStartDate = new Date(prev.startDate);
            const currentStartDate = new Date(current.startDate);
            return prevStartDate > currentStartDate ? prev : current;
          }
        );

        // pull awards from the API
        const awards: UsaSpendingAwardResult[] = [];

        for await (const awardsResponse of getAwards(trackedRecipient.uei)) {
          awards.push(...awardsResponse);
        }

        const latestAwardsFromApiNotInDb: UsaSpendingAwardResult[] = awards
          .sort((a, b) => {
            const dateA = new Date(a["Start Date"]);
            const dateB = new Date(b["Start Date"]);
            return dateB.getTime() - dateA.getTime();
          })
          .filter((award) => {
            const awardStartDate = new Date(award["Start Date"]);
            const latestAwardStartDate = new Date(latestAwardFromDb.startDate);
            return awardStartDate > latestAwardStartDate;
          });

        // insert all the awards into the database
        const insertAwards = latestAwardsFromApiNotInDb.map((award) => {
          const newAward = new Award();
          newAward.usaSpendingAwardId = award["Award ID"];
          newAward.recipient = trackedRecipient;
          newAward.startDate = award["Start Date"];
          newAward.endDate = award["End Date"];
          newAward.awardAmount = award["Award Amount"];
          newAward.description = award.Description;
          newAward.awardAgency = award["Awarding Agency"];
          newAward.awardSubAgency = award["Awarding Sub Agency"];

          return newAward;
        });

        await Award.save(insertAwards);

        // send message to slack channel with the new awards for the recipient
        const blockMessage = {
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `Latest 5 awards for recipient id: ${trackedRecipient.usaSpendingRecipientId}, name: ${trackedRecipient.name}`,
              },
            },
            {
              type: "divider",
            },
          ],
        };

        latestAwardsFromApiNotInDb.forEach((award, index) => {
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
                text: `*Award Amount:*\n \$${award[
                  "Award Amount"
                ].toLocaleString("en-US")}`,
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

        // Get slack channel to post to
        const slackConfig = await SlackConfig.findOneBy({ id: 1 });

        if (slackConfig) {
          // send message to slack channel
          await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: slackConfig.slackChannelId,
            blocks: blockMessage.blocks,
          });
        } else {
          log.warn(
            "check-latest-awards",
            "No slack channel has been set up, message not sent to slack."
          );
        }
      }
    }

    // wait every 2 hours
    await setTimeout(1000 * 60 * 60 * 2);
  }
}
