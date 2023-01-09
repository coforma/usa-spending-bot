import { Column, Entity, PrimaryColumn, BaseEntity } from "typeorm";

@Entity()
export class SlackConfig extends BaseEntity {
  @PrimaryColumn()
  id!: number;

  @Column()
  slackChannelId!: string;
}
