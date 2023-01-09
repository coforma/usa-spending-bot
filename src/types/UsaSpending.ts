export interface UsaSpendingAwardResult {
  internal_id: number;
  "Award ID": string;
  "Recipient Name": string;
  "Start Date": string;
  "End Date": string;
  "Award Amount": number;
  Description: string;
  "Awarding Agency": string;
  "Awarding Sub Agency": string;
  "Contract Award Type": string | null;
  recipient_id: string;
  prime_award_recipient_id: string | null;
  awarding_agency_id: number;
  agency_slug: string;
  generated_internal_id: string;
}

export interface UsaSpendingAward {
  limit: number;
  results: UsaSpendingAwardResult[];
  messages: string[][];
  page_metadata: {
    page: number;
    hasNext: boolean;
    last_record_unique_id: number;
    last_record_sort_value: string;
  };
}

export interface UsaSpendingRecipient {
  name: string;
  uei: string;
  duns: string;
  recipient_id: string;
  total_transactions: number;
  total_transaction_amount: string;
}
