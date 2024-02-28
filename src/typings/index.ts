export interface GroupMessage {
  message_type: string;
  sub_type: string;
  message_id: number;
  group_id: number;
  user_id: number;
  anonymous: null;
  message: Message[];
  raw_message: string;
  font: number;
  sender: Sender;
  time: number;
  self_id: number;
  post_type: string;
}

export interface Message {
  type: string;
  data: Data;
}

export interface Data {
  text: string;
}

export interface Sender {
  user_id: number;
  nickname: string;
  card: null;
  sex: string;
  age: number;
  area: string;
  level: string;
  role: string;
  title: string;
}
