const http = require("http");

const options = {
  host: "localhost",
  port: "3050",
  path: "/ping",
  timeout: 2000,
};
const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});
// eslint-disable-next-line no-unused-vars
request.on("error", (err) => {
  process.exit(1);
});
request.end();
