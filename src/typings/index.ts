import { Message } from "./message";
import { Sender } from "./sender";

export interface DataRaw {
  post_type: string;
  [key: string]: string;
}

export type MessageRaw = GroupMessage | PrivateMessage;

export interface MessageBase {
  sub_type: string;
  message_id: number;
  user_id: number;
  message: Message[];
  raw_message: string;
  font: number;
  sender: Sender;
  time: number;
  self_id: number;
  post_type: string;
}
export interface GroupMessage extends MessageBase {
  message_type: "group";
  group_id: number;
  anonymous: null;
}

export interface PrivateMessage extends MessageBase {
  message_type: "private";
}

export interface ResponseData<T> {
  status: string;
  retcode: number;
  data?: T;
  echo: string;
}
