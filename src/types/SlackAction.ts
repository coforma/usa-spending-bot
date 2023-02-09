import { BlockAction, Middleware, SlackActionMiddlewareArgs } from "@slack/bolt";

export type SlackAction = Middleware<
  SlackActionMiddlewareArgs<BlockAction>,
  Record<string, unknown>
>;
