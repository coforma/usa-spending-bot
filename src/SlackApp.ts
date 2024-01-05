import pkg from "@slack/bolt";
const { App } = pkg;

export const SlackApp = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  customRoutes: [
    {
      path: "/ping",
      method: "GET",
      handler: (req, res) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("pong");
      },
    },
  ],
});
