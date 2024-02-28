export type Message =
  | Text
  | Face
  | Image
  | Record
  | At
  | Location
  | Reply
  | Forward;

export interface Text {
  type: "text";
  data: {
    text: string;
  };
}

export interface Face {
  type: "face";
  data: {
    id: string;
  };
}

export interface Image {
  type: "image";
  data: {
    file: string;
  };
}

export interface Record {
  type: "record";
  data: {
    file: string;
  };
}

export interface At {
  type: "at";
  data: {
    qq: string;
  };
}

export interface Location {
  type: "location";
  data: {
    lat: string;
    lon: string;
    title: string;
    content: string;
  };
}

export interface Reply {
  type: "reply";
  data: {
    id: string;
  };
}

export interface Forward {
  type: "forward";
  data: {
    id: string;
  };
}
