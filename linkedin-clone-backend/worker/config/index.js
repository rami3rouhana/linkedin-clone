const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./${process.env.NODE_ENV}.env`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  COMPANY_SERVICE: "COMPANY_SERVICE",
  WORKER_SERVICE: "WORKER_SERVICE",
  QUEUE_NAME:"WORKER_QUEUE"
};