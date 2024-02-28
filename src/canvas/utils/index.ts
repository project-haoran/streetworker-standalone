// 常用方法

import axios from "axios";
import sharp from "sharp";

module.exports = {
  /**
   * 生成头像
   */
  async genAvatar(id: number, size: number, type: string) {
    if (!size) size = 64;
    if (!type) type = "friend";

    let apiUrl = "";

    switch (type) {
      case "friend":
        apiUrl = `https://q1.qlogo.cn/g?b=qq&nk=${id}&s=640`;
        break;

      case "group":
        apiUrl = `https://p.qlogo.cn/gh/${id}/${id}/640/`;
        break;

      default:
        return;
    }

    // 获取头像
    const input = await axios
      .get(apiUrl, {
        responseType: "arraybuffer",
      })
      .then((response) => Buffer.from(response.data, "binary"));

    // const metadata = await sharp(input).metadata();

    // 制作圆形遮罩
    const circleShape = Buffer.from(
      `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" /></svg>`
    );

    // 缩放以及圆形裁切
    const avatar = await sharp(input)
      .resize(size, size)
      .composite([
        {
          input: circleShape,
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer();

    return avatar;
  },

  /**
   * 生成圆角矩形
   */
  async genRoundedRect(
    width: number,
    height: number,
    rx: number,
    colour: string,
    weight: number
  ) {
    if (!rx) rx = 10;
    if (!colour) colour = "#BDBDBD";

    return Buffer.from(
      `<svg width="${width}" height="${height}"><rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="${colour}" stroke-width="${weight}" rx="${rx}"></rect></svg>`
    );
  },

  /**
   * 生成横向分割线
   */
  async genHr(length: number, colour: string, weight: number) {
    if (!colour) colour = "#BDBDBD";
    if (!weight) weight = 1;

    return Buffer.from(
      `<svg width="${length}" height="${weight}"><line x1="0" y1="0" x2="${length}" y2="0" stroke="${colour}" stroke-width="${weight}"/></svg>`
    );
  },

  /**
   * 随机数
   */
  randomRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  /**
   * 格式化日期时间
   */
  formatTs(dat: Date) {
    var year = dat.getFullYear();
    var mon =
      dat.getMonth() + 1 < 10 ? "0" + (dat.getMonth() + 1) : dat.getMonth() + 1;
    var data = dat.getDate() < 10 ? "0" + dat.getDate() : dat.getDate();
    var hour = dat.getHours() < 10 ? "0" + dat.getHours() : dat.getHours();
    var min = dat.getMinutes() < 10 ? "0" + dat.getMinutes() : dat.getMinutes();
    var seon =
      dat.getSeconds() < 10 ? "0" + dat.getSeconds() : dat.getSeconds();

    var newDate =
      year + "-" + mon + "-" + data + " " + hour + ":" + min + ":" + seon;
    return newDate;
  },

  /**
   * 数组内随机
   */
  randomArrayElem(array: unknown[]) {
    if (typeof array != "object") return;

    return array[Math.round(Math.random() * (array.length - 1))];
  },

  /**
   * 获取当日零时 Date
   * @param {Date} dat
   * @return {Date}
   */
  getDayDate(dat) {
    return new Date(
      `${dat.getFullYear()}-${dat.getMonth() + 1}-${dat.getDate()}`
    );
  },
};
