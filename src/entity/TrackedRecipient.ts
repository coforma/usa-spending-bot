import {
  Column,
  Entity,
  OneToMany,
  BaseEntity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Award } from "./Award.js";

@Entity()
export class TrackedRecipient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  @Unique("recipient_short_name", ["shortName"])
  shortName!: string;

  @Column()
  @Index({ unique: true })
  uei!: string;

  @Column()
  @Index({ unique: true })
  duns!: string;

  @Column()
  @Index({ unique: true })
  usaSpendingRecipientId!: string;

  @Column()
  totalTransactionsCount!: number;

  @Column()
  totalTransactionDollarAmount!: string;

  @OneToMany(() => Award, (award) => award.recipient)
  awards!: Award[];
}
