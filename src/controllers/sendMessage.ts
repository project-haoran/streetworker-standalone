import { ResponseData } from "@/typings";
import { Message } from "@/typings/message";
import { sendData } from "@/utils/sendData";
import _ from "lodash";
import { WebSocket } from "ws";

export const sendGroupQuoteReplyMessage = (
  client: WebSocket,
  groupId: number,
  originMessageId: number | string,
  message: string | Message | Message[]
) => {
  const messageRaw: Message[] = _.isArray(message)
    ? (message as Message[])
    : _.isString(message)
    ? [{ type: "text", data: { text: message } }]
    : [message];
  return sendData<ResponseData<null>>(client, {
    action: "send_group_msg",
    params: {
      group_id: groupId,
      message: [
        {
          type: "reply",
          data: {
            id:
              typeof originMessageId === "number"
                ? originMessageId.toString()
                : originMessageId,
          },
        },
        ...messageRaw,
      ],
    },
  });
};

export const sendGroupReplyMessage = (
  client: WebSocket,
  groupId: number,
  message: string | Message | Message[]
) => {
  return sendData<ResponseData<null>>(client, {
    action: "send_group_msg",
    params: {
      group_id: groupId,
      message,
    },
  });
};
