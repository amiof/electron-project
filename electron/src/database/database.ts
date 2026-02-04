import { DataSource } from "typeorm"
import { Download } from "./entities/download"
import * as path from "path"
import { app } from "electron"
import { Torrent } from "./entities/torrent"

const userDataPath = app.getPath("userData")
const pathDatabase = path.join(userDataPath, "Shabdiz-data", "database.sqlite")

export const DataSourceRepo = new DataSource({
  type: "sqlite",
  database: pathDatabase,
  entities: [Download, Torrent],
  synchronize: true,
  logging: false
})