import log from "npmlog";

// check if the app is running not in production
const isLocal = process.env.NODE_ENV !== 'production';

/* Add functionality here */
if (isLocal) {
  // load environment variables from .env file
  const { config: StartDotEnv } = await import ('dotenv');
  StartDotEnv();
  // configure logger
  log.level = process.env.LOG_LEVEL || 'silly';
} else {
  // configure logger
  log.level = process.env.LOG_LEVEL || 'warn';
}

export const config = {
  isLocal,
  log,
};