import got from "got";
import { UsaSpendingAward } from "../types/UsaSpending.js";

// create pagination async generator to get all the awards for the given recipient id
export async function* getAwards(recipientUei: string, limit: number = 10) {
  let page = 1;
  let hasMore = true;
  const jsonBody = {
    limit,
    page,
    fields: [
      "Award ID",
      "Recipient Name",
      "Start Date",
      "End Date",
      "Award Amount",
      "Description",
      "Awarding Agency",
      "Awarding Sub Agency",
      "Contract Award Type",
      "recipient_id",
      "prime_award_recipient_id",
    ],
    filters: {
      award_type_codes: ["A", "B", "C", "D"],
      recipient_search_text: [recipientUei],
      time_period: [
        {
          start_date: "2015-01-01",
          end_date: new Date().toISOString().split("T")[0],
        },
      ],
    },
  };

  while (hasMore) {
    // update the page number
    jsonBody.page = page;

    const { body } = await got.post(
      `https://api.usaspending.gov/api/v2/search/spending_by_award/`,
      {
        responseType: "json",
        json: jsonBody,
      },
    );

    // check if the response is valid
    if (!body) {
      throw new Error("Invalid response from usa spending api");
    }

    const awards = (body as UsaSpendingAward).results;

    if (awards.length === 0) {
      throw new Error("No awards found for the given recipient id");
    }

    // check if there are more awards to fetch
    if (!(body as UsaSpendingAward).page_metadata.hasNext) {
      hasMore = false;
    }

    page += 1;

    yield awards;
  }
}
