import { ResponseData } from "@/typings";
import { GroupMember } from "@/typings/group";
import { sendData } from "@/utils/sendData";
import { WebSocket } from "ws";

export const getGroupMemberList = (client: WebSocket, groupId: number) => {
  return sendData<ResponseData<GroupMember[]>>(client, {
    action: "get_group_member_list",
    params: {
      group_id: groupId,
    },
  });
};
