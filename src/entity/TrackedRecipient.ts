import { Column, Entity, OneToMany, PrimaryColumn, BaseEntity, Index } from "typeorm"
import { Award } from "./Award.js";

@Entity()
export class TrackedRecipient extends BaseEntity {
  @PrimaryColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
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