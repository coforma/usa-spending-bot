import {
  Column,
  Entity,
  ManyToOne,
  BaseEntity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TrackedRecipient } from "./TrackedRecipient.js";

@Entity()
export class Award extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Index({ unique: true })
  usaSpendingAwardId!: string;

  @ManyToOne(
    () => TrackedRecipient,
    (trackedRecipient) => trackedRecipient.awards
  )
  recipient!: TrackedRecipient;

  @Column()
  startDate!: string;

  @Column()
  endDate!: string;

  @Column()
  awardAmount!: number;

  @Column()
  description!: string;

  @Column()
  awardAgency!: string;

  @Column()
  awardSubAgency!: string;
}
