import { WebSocket } from "ws";
import { nanoid } from "nanoid";
import { messageEventNameList } from "./store";

interface Options {
  timeout?: number;
}

export const sendData = <T>(
  client: WebSocket,
  data: Record<string, any>,
  options?: Options
) =>
  new Promise<T>((resolve, reject) => {
    const echo = nanoid();
    const eventName = `message-${echo}`;
    const timeout = setTimeout(() => {
      messageEventNameList.slice(
        messageEventNameList.findIndex((item) => item === eventName),
        1
      );
      client.removeListener(eventName, () => {});
      reject();
    }, options?.timeout ?? 10000);
    messageEventNameList.push(eventName);
    client.on(eventName, function (raw) {
      try {
        const result = JSON.parse(raw.toString());
        if (!result.echo || result.echo != echo) return;
        messageEventNameList.slice(
          messageEventNameList.findIndex((item) => item === eventName),
          1
        );
        client.removeListener(eventName, () => {});
        clearTimeout(timeout);
        if (result.status != "ok" || result.retcode != 0) reject(result);
        else resolve(result);
      } catch (error) {
        reject();
      }
    });
    client.send(
      JSON.stringify({
        ...data,
        echo,
      })
    );
  });
