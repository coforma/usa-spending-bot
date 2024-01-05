import { TrackedRecipient } from "../entity/TrackedRecipient.js";
import { Award } from "../entity/Award.js";
import { getAwards } from "../utils/get-awards.js";
import log from "npmlog";
import {
  UsaSpendingAward,
  UsaSpendingRecipient,
} from "../types/UsaSpending.js";
import got from "got";
import { SlackCommand } from "../types/SlackCommand.js";

// create a command to add a new entry into the sqlite database
export const addRecipient: SlackCommand = async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  const input = command.text.trim().split(" ");
  const recipientId: string = input[0] || "";
  let shortName: string = input[1] || "";

  if (recipientId === "") {
    await say("Please provide a recipient id");
    return;
  }

  try {
    // query the usa spending api and get the data for the given id and add an entry into the database
    // use got to make the request
    const { body } = await got(
      `https://api.usaspending.gov/api/v2/recipient/${recipientId}`,
      {
        responseType: "json",
      },
    );

    // check if the response is valid
    if (!body) {
      await say(`No data found for the given recipient id: ${recipientId}`);
      return;
    }

    if (shortName === "") {
      shortName = (body as UsaSpendingRecipient).name;
    }

    // add the data into the database using active record for typeorm
    const trackedRecipient = new TrackedRecipient();
    trackedRecipient.usaSpendingRecipientId = recipientId;
    trackedRecipient.name = (body as UsaSpendingRecipient).name;
    trackedRecipient.shortName = shortName;
    trackedRecipient.uei = (body as UsaSpendingRecipient).uei;
    trackedRecipient.duns = (body as UsaSpendingRecipient).duns;
    trackedRecipient.totalTransactionsCount = (
      body as UsaSpendingRecipient
    ).total_transactions;
    trackedRecipient.totalTransactionDollarAmount = (
      body as UsaSpendingRecipient
    ).total_transaction_amount;

    await trackedRecipient.save();

    // repull the tracked recipient from the database to get the id
    const savedRecipient = await TrackedRecipient.findOneBy({
      usaSpendingRecipientId: recipientId,
    });

    if (savedRecipient === null) {
      throw new Error("Failed to retrieve saved recipient");
    }

    await say(
      `Added recipient: ${trackedRecipient.name} with id: ${recipientId} now tracking all past awards.`,
    );

    const awards: UsaSpendingAward["results"] = [];

    for await (const awardsResponse of getAwards(trackedRecipient.uei)) {
      awards.push(...awardsResponse);
    }

    // insert all the awards into the database
    const insertAwards = awards.map((award) => {
      const newAward = new Award();
      newAward.usaSpendingAwardId = award["Award ID"];
      newAward.recipient = savedRecipient;
      newAward.startDate = award["Start Date"];
      newAward.endDate = award["End Date"];
      newAward.awardAmount = award["Award Amount"];
      newAward.description = award.Description;
      newAward.awardAgency = award["Awarding Agency"];
      newAward.awardSubAgency = award["Awarding Sub Agency"];

      return newAward;
    });

    await Award.save(insertAwards);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    log.error("COMMAND", "Failed to complete command: %s", errMessage);
    await say(`Failed to complete command: ${errMessage}`);
  }
};
