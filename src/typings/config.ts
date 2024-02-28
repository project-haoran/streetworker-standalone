export interface Config {
  host: string;
  accessToken?: string;
  owner: number;
  mongo: string;
  oss: {
    accessKeyId: string;
    accessKeySecret: string;
    region: string;
    bucket: string;
  };
}
