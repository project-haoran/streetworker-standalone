import path from "path";
import { MessageRaw } from "./typings";
import minimist from "minimist";
import {
  sendGroupQuoteReplyMessage,
  sendGroupReplyMessage,
} from "./controllers/sendMessage";
import { WebSocket } from "ws";
import { info } from "./canvas/info";
import { stand } from "./canvas/stand";

export const messageHandler = (client: WebSocket, message: MessageRaw) => {
  let r;

  // 处理群消息

  if (message.message_type != "group") return;

  let msg = "";

  message.message.forEach((m) => {
    if (m.type == "text") {
      msg += m.data.text;
    }
  });

  if (!msg.includes("站街") && msg != "炒" && msg != "超" && msg != "操")
    return;

  // if (msg == "站街帮助") {
  //   const helpB64 = fs
  //     .readFileSync(path.resolve(__dirname, `assets/help.png`))
  //     .toString("base64");
  //   message.reply([
  //     {
  //       type: "Image",
  //       base64: helpB64,
  //     },
  //   ]);
  // }

  if (msg === "操1") {
    sendGroupReplyMessage(client, message.group_id, {
      type: "image",
      data: {
        file: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAWVJREFUSEvFlYtNxEAMRH2dQCVAJUAlQCXQyUEl0AnkRTvRxPHmo9OJlaLcOd4Z2+P1nuLK63Rl/NhDcB8RdxHBm+dneH+291f73Y1zjeAmIt4b6FqiED40woVfj+Bl8Hxt3gB8DCCKFmI9+PFbPm+ZoSJwcEgWmwwE8EcLZuGfCdjw3QBIm1qzsEP8ZBpATOT6zj7+P7sumeDcap4jkd0rANitGZT5zO4ERIeoeaPsldA5SzXFZHcCRZCjd00ySc93sjsB7ERLDekaLXqfElWr54t2ZDE7aIiEmNRV4knA6jxMIKmrJPaoj2fQIxCJ2lEnmeir9duMI7YTqFNcuA5G16yGoMRjAHtEPkIiglJkiZnbtBp2+PAwPrwhVOZJfM/AhxubOKl7hx2ATFwin4m/NiqOlMZ9ZxpWw27t5G6Rbg673JJbgP69nLz/duEoMr9cdG3yTYftoivzSHm6vnsu/YuI/gDkS2QZWOpu8wAAAABJRU5ErkJggg==",
      },
    });
  }

  const msgAry = msg.split(" ");
  const msgArgv = minimist(msgAry);
  const msgCmd = msgArgv._;

  const timestamp = new Date();
  const ts = timestamp.getTime();
  const filePath = path.resolve(__dirname, `temp/${ts}.png`);

  if (msgCmd.includes("站街")) {
    stand(
      client,
      message,
      timestamp,
      "random",
      msgArgv.force || msgArgv.f ? true : false
    );
  }

  if (msgCmd.includes("强制站街")) {
    stand(client, message, timestamp, "random", true);
  }

  if (
    msgCmd.includes("站街摇人") ||
    msgCmd.includes("炒") ||
    msgCmd.includes("超") ||
    msgCmd.includes("操")
  ) {
    stand(
      client,
      message,
      timestamp,
      "call",
      msgArgv.force || msgArgv.f ? true : false
    );
  }

  if (msg == "我的站街工资" || msg == "站街钱包") {
    sendGroupQuoteReplyMessage(
      client,
      message.group_id,
      message.message_id,
      "该方法未来将被废弃，请使用 “站街数据” 代替，查看钱包请使用 “PY钱包”。"
    );
    info(client, message, timestamp);
  }
  if (msg == "站街数据") {
    info(client, message, timestamp);
  }

  // if (msg == "站街人气榜") {
  //   rank(message, timestamp, filePath, "count");
  // }
  if (msg == "站街富豪榜") {
    sendGroupQuoteReplyMessage(
      client,
      message.group_id,
      message.message_id,
      "因站街工资迁移至PY钱包，故该排行榜已移除。"
    );
  }
  // if (msg == "站街赚钱榜") {
  //   rank(message, timestamp, filePath, "make_score");
  // }
  // if (msg == "站街赔钱榜") {
  //   rank(message, timestamp, filePath, "lose_score");
  // }
  // if (msg == "站街乖宝宝榜") {
  //   rank(message, timestamp, filePath, "good_boi");
  // }
  // if (msg == "站街坏宝宝榜") {
  //   rank(message, timestamp, filePath, "bad_boi");
  // }
};
