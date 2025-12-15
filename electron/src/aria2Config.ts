import { getSessionPath } from "./utils"

export const config = [
  "--enable-rpc",
  "--async-dns-server=8.8.8.8",
  "--rpc-listen-all=true",
  "--rpc-allow-origin-all",
  `--save-session=${getSessionPath()}`,
  `--input-file=${getSessionPath()}`,
  // "--log=/home/amir/.config/electron/AMDownloader/aria2.log",
  "--log-level=debug",
  "--save-session-interval=0",
  // "--force-save=true",
  // "--max-download-limit=10K",
  "--auto-file-renaming=true",
  "--force-sequential=true",
  "--check-integrity=true"
]