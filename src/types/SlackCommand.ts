import { Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";

export type SlackCommand = Middleware<
  SlackCommandMiddlewareArgs,
  Record<string, unknown>
>;
