// 个人信息方法

const env = process.env.ENV || "prod";

import { sendGroupReplyMessage } from "@/controllers/sendMessage";
import { StreetworkerModel } from "@/models/Streetworker";
import { GroupMessage } from "@/typings";
import path from "path";
import sharp from "sharp";
import { WebSocket } from "ws";
import { text2svg } from "./utils/text2svg";
import { formatTs, genAvatar } from "./utils";
import { oss } from "@/utils/oss";
import { nanoid } from "nanoid";

/**
 * 获取工资
 */
export const info = async (
  client: WebSocket,
  message: GroupMessage,
  timestamp: Date
) => {
  const result = await StreetworkerModel.aggregate([
    { $match: { qq: message.user_id, group: message.group_id } },
    { $unwind: "$into" },
    { $project: { into: 1, count: 1, stats: 1, score: 1 } },
    { $sort: { "into.ts": -1 } },
    { $limit: 1 },
  ]);
  if (result.length == 0) {
    sendGroupReplyMessage(client, message.group_id, [
      {
        type: "at",
        data: { qq: message.user_id.toString() },
      },
      {
        type: "text",
        data: {
          text: "您还没有站过街",
        },
      },
    ]);
    return;
  }

  const { count, score, stats } = result[0];

  const totalCount = count.friends + count.others;
  const friendsCount = count.friends;
  const per = Math.ceil(stats.into / totalCount);

  const card = await genSalaryCard({
    qq: message.user_id,
    nick: message.sender.nickname,
    per,
    score,
    totalCount,
    friendsCount,
    timestamp,
  });

  const filePath = `imgs/${nanoid()}.png`;

  await oss.put(filePath, card);

  const signUrl = oss.signatureUrl(filePath);

  sendGroupReplyMessage(client, message.group_id, [
    {
      type: "image",
      data: {
        file: signUrl,
      },
    },
  ]);

  return;
};

/**
 * 生成工资卡片
 */
async function genSalaryCard(dataObj: {
  qq: any;
  nick: any;
  per: any;
  score: any;
  totalCount: any;
  friendsCount: any;
  timestamp: any;
}) {
  const cardWidth = 400;
  const cardHeight = 300;

  const avatarSize = 96;
  const nickFontSize = 36;
  const introFontSize = 20;
  const dataIntroIconSize = 36;
  const dataIntroFontSize = 18;
  const tsTextFontSize = 16;

  const dataScoreIcon = await sharp(
    path.resolve(__dirname, "assets/info_wallet.png")
  ).toBuffer();
  const dataTotalCountIcon = await sharp(
    path.resolve(__dirname, "assets/info_person_total.png")
  ).toBuffer();
  const dataFriendsCountIcon = await sharp(
    path.resolve(__dirname, "assets/info_person_friends.png")
  ).toBuffer();

  const cardPadding = 30;
  const avatarTop = cardPadding;
  const avatarLeft = cardPadding;
  const introLeft = avatarLeft + avatarSize + 18;
  const nickTextMaxWidth = cardWidth - introLeft - cardPadding;
  const nickTop = Math.ceil(
    avatarTop + (avatarSize / 2 - (nickFontSize + 4 + introFontSize) / 2)
  );
  const introTop = Math.ceil(nickTop + nickFontSize + 6);
  const dataIntroTop = avatarTop + avatarSize + 24;
  const dataScoreIconLeft = Math.ceil((cardWidth - dataIntroIconSize * 3) / 4);
  const dataTotalCountIconLeft = dataScoreIconLeft * 2 + dataIntroIconSize;
  const dataFriendsCountIconLeft =
    dataScoreIconLeft * 3 + dataIntroIconSize * 2;
  const dataIntroTextTop = dataIntroTop + dataIntroIconSize + 5;
  const tsTextTop = cardHeight - tsTextFontSize - cardPadding;

  const { qq, nick, per, score, totalCount, friendsCount, timestamp } = dataObj;

  // 生成头像
  const avatar = await genAvatar(qq, avatarSize);

  // 生成文本

  // 昵称
  const tempNickText = text2svg.getSVG(nick, {
    fontSize: nickFontSize,
  });
  // 昵称这里需要判断会不会过大
  let nickText;
  if (
    text2svg.getWidth(nick, {
      fontSize: nickFontSize,
    }) > nickTextMaxWidth
  ) {
    nickText = await sharp(Buffer.from(tempNickText))
      .resize(nickTextMaxWidth)
      .toBuffer();
  } else {
    nickText = Buffer.from(tempNickText);
  }

  // 昵称下 intro
  const introText = text2svg.getSVG(`人均 ${per} 硬币`, {
    fontSize: introFontSize,
  });

  // 数据
  const dataScoreText = text2svg.getSVG(`${score} 硬币`, {
    fontSize: dataIntroFontSize,
  });
  const dataTotalCountText = text2svg.getSVG(`${totalCount} 次`, {
    fontSize: dataIntroFontSize,
  });
  const dataFriendsCountText = text2svg.getSVG(`${friendsCount} 群友`, {
    fontSize: dataIntroFontSize,
  });

  // 时间戳
  const tsText = text2svg.getSVG(formatTs(timestamp), {
    fontSize: tsTextFontSize,
  });

  // 生成卡片画布
  const card = await sharp({
    create: {
      width: cardWidth,
      height: cardHeight,
      channels: 4,
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 1,
      },
    },
  })
    .composite([
      {
        // 头像
        input: avatar,
        top: avatarTop,
        left: avatarLeft,
      },
      {
        // 昵称
        input: nickText,
        top: nickTop,
        left: introLeft,
      },
      {
        // 简介
        input: Buffer.from(introText),
        top: introTop,
        left: introLeft,
      },
      {
        // score icon
        input: dataScoreIcon,
        top: dataIntroTop,
        left: dataScoreIconLeft,
      },
      {
        // score text
        input: Buffer.from(dataScoreText),
        top: dataIntroTextTop,
        left: Math.ceil(
          dataScoreIconLeft +
            dataIntroIconSize / 2 -
            text2svg.getWidth(`${score} 硬币`, {
              fontSize: dataIntroFontSize,
            }) /
              2
        ),
      },
      {
        // count icon
        input: dataTotalCountIcon,
        top: dataIntroTop,
        left: dataTotalCountIconLeft,
      },
      {
        // count text
        input: Buffer.from(dataTotalCountText),
        top: dataIntroTextTop,
        left: Math.ceil(
          dataTotalCountIconLeft +
            dataIntroIconSize / 2 -
            text2svg.getWidth(`${totalCount} 次`, {
              fontSize: dataIntroFontSize,
            }) /
              2
        ),
      },
      {
        // friendsCount icongenAvatarItem
        input: dataFriendsCountIcon,
        top: dataIntroTop,
        left: dataFriendsCountIconLeft,
      },
      {
        // friendsCount text
        input: Buffer.from(dataFriendsCountText),
        top: dataIntroTextTop,
        left: Math.ceil(
          dataFriendsCountIconLeft +
            dataIntroIconSize / 2 -
            text2svg.getWidth(`${friendsCount} 群友`, {
              fontSize: dataIntroFontSize,
            }) /
              2
        ),
      },
      {
        // ts text
        input: Buffer.from(tsText),
        top: tsTextTop,
        left: Math.ceil(
          (cardWidth -
            text2svg.getWidth(formatTs(timestamp), {
              fontSize: tsTextFontSize,
            })) /
            2
        ),
      },
    ])
    .png()
    .toBuffer();

  return card;
}
