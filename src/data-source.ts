import { DataSource } from "typeorm";
import { Award } from "./entity/Award.js";
import { TrackedRecipient } from "./entity/TrackedRecipient.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.DB_NAME || "./db/local.db",
  synchronize: true,
  logging: true,
  entities: [TrackedRecipient, Award],
  subscribers: [],
  migrations: [],
});