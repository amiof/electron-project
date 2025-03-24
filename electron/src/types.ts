export type TFileDetails = {
  name: string;
  path: string;
  size: number; // in bytes
  createdAt: Date;
  modifiedAt: Date;
  isDirectory: boolean;
}

