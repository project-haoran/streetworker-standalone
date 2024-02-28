import mongoose from "mongoose";
import { config } from "..";
import logger from "./logger";

export const initMongoose = () =>
  new Promise<void>((resolve, reject) => {
    mongoose.set("strictQuery", true);
    mongoose.connect(config.mongo);

    mongoose.connection.once("open", (err) => {
      if (!err) {
        logger.info("mongoose connected");
        resolve();
      } else {
        reject("mongoose connection failed" + err);
      }
    });
  });
