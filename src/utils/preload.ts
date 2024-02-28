import { existsSync, mkdirSync, statSync, writeFileSync } from "fs";
import logger from "./logger";
import { join } from "path";

export const preload = () => {
  if (!existsSync("data")) {
    mkdirSync("data");
    logger.info(`'data' directory is missing. creating`);
  } else if (!statSync("data").isDirectory()) {
    logger.error(`'data' is not a directory`);
    throw new Error();
  }

  const configPath = join("data", "config.json");
  if (!existsSync(configPath)) {
    logger.info(`initialling 'config.json'`);
    const initConfig = {
      host: "",
      accessToken: "",
      owner: 10000,
      mongo: "mongodb://user:pwd@host/db",
    };
    writeFileSync(configPath, JSON.stringify(initConfig, null, 2));
    throw new Error(`'config.json' initialled`);
  }

  logger.info("preload passed");
};
