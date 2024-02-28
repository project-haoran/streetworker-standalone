/**
 * Haoran
 */
import logger from "@/utils/logger";
import { preload } from "@/utils/preload";
import { Config } from "@/typings/config";
import { readFileSync } from "fs";
import { join } from "path";
import { initMongoose } from "./utils/mongoose";

import WebSocket from "ws";
import { messageEventNameList } from "./utils/store";
import { messageHandler } from "./messageHandler";

logger.info("project-haoran/streetworker standalone version");

preload();

export const config: Config = JSON.parse(
  readFileSync(join("data", "config.json"), "utf-8")
);

initMongoose().then(() => {
  const client = new WebSocket(config.host, {
    headers: {
      Authorization: config.accessToken
        ? "Bearer ".concat(config.accessToken)
        : "",
    },
  });

  client.on("open", () => {
    logger.info("onebot connected");
  });

  client.on("close", () => {
    logger.info("onebot disconnected");
    process.exit();
  });

  client.on("error", (err) => {
    logger.error("onebot connection failed");
    console.error(err);
  });

  client.on("message", (raw) => {
    try {
      const data = JSON.parse(raw.toString());

      if (data?.post_type === "meta_event") return;

      messageEventNameList.forEach((name) => {
        client.emit(name, raw);
      });

      messageHandler(client, data);

      console.log(raw.toString());
    } catch (error) {
      console.error(error);
    }
  });
});
