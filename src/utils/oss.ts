import OSS from "ali-oss";
import { readFileSync } from "fs";
import { join } from "path";

export const oss = new OSS(
  JSON.parse(readFileSync(join("data", "config.json"), "utf-8")).oss
);
