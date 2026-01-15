import { getSessionPath } from "./utils"
import { electronStore } from "./store/electronStore"

const proxyConfig = electronStore.get("proxyConfig") || {}
const aria2Config = electronStore.get("aria2Config") || {}
const torrentConfig = electronStore.get("torrentConfig") || {}

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

//torrent config
const {
  enableDht6,
  enableLpd,
  enableDht,
  maxPeers,
  enablePeerExchange,
  maxOverallDownloadLimit,
  maxOverallUploadLimit,
  maxUploadLimit,
  requestPeerSpeedLimit,
  seedRatio,
  seedTime,
  tracker,
  stopTimeout
} = torrentConfig

const addedTrackers = tracker ? [`--bt-tracker= ${tracker}`] : []

export const config = [
  "--enable-rpc",
  `${dnsServer && `{--async-dns-server=${dnsServer}`}`,
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
  `--enable-dht=${enableDht}`,
  `--enable-dht6=${enableDht6}`,
  `--bt-enable-lpd=${enableLpd}`,
  `--enable-peer-exchange=${enablePeerExchange}`,
  `--bt-max-peers=${maxPeers}`,
  `--bt-request-peer-speed-limit=${requestPeerSpeedLimit}`,
  `--seed-time=${seedTime}`,
  `--seed-ratio=${seedRatio}`,
  `--bt-stop-timeout=${stopTimeout}`,
  `--max-overall-upload-limit=${maxOverallUploadLimit}`,
  `--max-upload-limit=${maxUploadLimit}`,
  `--max-overall-download-limit=${maxOverallDownloadLimit}`,
  ...addedTrackers,
  ...proxyArgs
]