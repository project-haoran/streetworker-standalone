import path from "path";
import Text2svg from "text2svg";

export const text2svg = new Text2svg(
  path.join("assets", "fonts", "SourceHanSerifSC-Heavy.ttf")
);
