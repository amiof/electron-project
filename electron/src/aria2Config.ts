import { getSessionPath } from "./utils"
import { electronStore } from "./store/electronStore"

const proxyConfig = electronStore.get("proxyConfig") || {}
const aria2Config = electronStore.get("aria2Config") || {}

const {
  maxConnectionSplit,
  maxConnection,
  connectTimeout,
  minSplitSize,
  maxDownloadLimit,
  dnsServer
} = aria2Config

const {
  ip,
  port,
  proxyPassword,
  proxyType,
  proxyStatus,
  proxyUserName
} = proxyConfig

// Build proxy-related args only if proxy is enabled
const proxyArgs = []
if (proxyStatus && ip && port) {
  proxyArgs.push(`--all-proxy=${proxyType}://${ip}:${port}`)
  if (proxyUserName) proxyArgs.push(`--all-proxy-user=${proxyUserName}`)
  if (proxyPassword) proxyArgs.push(`--all-proxy-passwd=${proxyPassword}`)
}


export const config = [
  "--enable-rpc",
  `--async-dns-server=${dnsServer}`,
  "--rpc-listen-all=true",
  "--rpc-allow-origin-all",
  `--save-session=${getSessionPath()}`,
  `--input-file=${getSessionPath()}`,
  "--log-level=error",
  `--console-log-level=notice`,
  "--save-session-interval=0",
  "--auto-file-renaming=true",
  "--force-sequential=true",
  "--check-integrity=true",
  `--max-connection-per-server=${maxConnection}`,
  `--split=${maxConnectionSplit}`,
  `--min-split-size=${minSplitSize}`,
  `--max-download-limit=${maxDownloadLimit}`,
  `--connect-timeout=${connectTimeout}`,
  ...proxyArgs
]