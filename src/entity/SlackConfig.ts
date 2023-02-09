import { Column, Entity, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SlackConfig extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  slackChannelId!: string;
}
