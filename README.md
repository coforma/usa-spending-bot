# UsaSpendingBot

![USASpendingBot Logo](images/logoSmall.png)

This Slackbot is built using Node.js and TypeScript, and it utilizes the API from usaspending.gov to retrieve data on awarded contracts. The bot is designed to track the recipients of these contracts, allowing users to easily stay informed about which companies are receiving funding from the government. The bot can be configured to send regular updates to specific channels or users, providing them with real-time information on contract awards. The bot's user-friendly interface allows users to easily search for contract award data by various criteria, such as the awarding agency, the location of the recipient, and the date range of the award. Overall, this Slackbot is a valuable tool for anyone looking to stay up-to-date on government contract awards and the companies that are benefiting from them.

## Prerequisites

- nodejs v18.10
- npm

## Current Commands

- `/add-recipient [uuid]` - Add a recipient to the database along with storing all of their contract awards.
- `/list-latest-awards [uuid]` - List the 5 latest contract awards.

## Getting Started

1.Clone the repository

```bash
git clone https://github.com/coforma/UsaSpendingBot.git
```

2.Install dependencies

```bash
cd UsaSpendingBot
npm install
```

3.Create a .env file in the root of the project and set the following environment variables:

```bash
DB_HOST=localhost
DB_PORT=3050
DB_NAME="local.db"
SLACK_SIGNING_SECRET=""
SLACK_BOT_TOKEN=""
LOG_LEVEL="silly"
```

4.Start the application in development mode

```bash
npm run dev
```

## Code Structure

The structure below shows where to place specific new files and where to find specific types of files. All new commands should have its own file under the `commands` directory.

```bash
├── .env
├── src
│   ├── commands
│   │   ├── command-name.ts
│   │   └── ...
│   ├── entity
│   │   ├── entity-name.ts
│   │   └── ...
│   ├── types
│   │   ├── type-name.ts
│   │   └── ...
│   ├── utils
│   │   ├── util-name.ts
│   │   └── ...
│   ├── migration
│   │   ├── migration-name.ts
│   │   └── ...
│   ├── config.ts
│   ├── index.ts
│   └── data-source.ts

```

This will start the application using nodemon and ts-node, allowing for quick code changes and immediate feedback.

## Dependencies

@slack/bolt
got
npmlog
typeorm
sqlite3
reflect-metadata

## Testing

TODO: Add testing instructions

## Deployment

TODO: Add deployment instructions

- Do not run with .env file in production.

## Built With

- [nodejs](https://nodejs.org/) - JavaScript runtime
- [typescript](https://www.typescriptlang.org/) - TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
- [@slack/bolt](https://www.npmjs.com/package/@slack/bolt) - A powerful framework for building Slack apps using Node.js
- [got](https://www.npmjs.com/package/got) - Simplified HTTP requests
- [npmlog](https://www.npmjs.com/package/npmlog) - A logging framework for Node.js with support for custom log levels and colored console output
- [typeorm](https://typeorm.io/) - ORM for TypeScript and JavaScript (ES7, ES6, ES5). Supports MySQL, PostgreSQL, MariaDB, SQLite, MS SQL Server, Oracle, WebSQL databases.
- [sqlite3](https://www.npmjs.com/package/sqlite3) - Asynchronous, non-blocking SQLite3 bindings for Node.js.
- [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) - A polyfill for the Metadata Reflection API, part of the ECMAScript (ES) 2017 specification.
- [nodemon](https://www.npmjs.com/package/nodemon) - Utility that will monitor for any changes in your source and automatically restart your server.
- [ts-node](https://www.npmjs.com/package/ts-node) - TypeScript execution environment and REPL for node.
