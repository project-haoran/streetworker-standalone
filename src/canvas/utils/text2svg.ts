import path from "path";
import Text2svg from "text-to-svg";

export const text2svg = Text2svg.loadSync(
  path.join("assets", "fonts", "SourceHanSerifSC-Heavy.ttf")
);
