import Store from "electron-store"

interface Schema {
  test: string;
}

//add electron-store for save settings to config.json
export const electronStore = new Store<Schema>()