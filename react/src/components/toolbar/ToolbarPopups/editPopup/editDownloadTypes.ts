export type DownloadOption = {
  key: string
  label: string
  description: string
  type?: "text" | "password"
  placeholder?: string
}

export type OptionGroup = {
  label: string
  options: DownloadOption[]
}

export const OPTION_GROUPS: OptionGroup[] = [
  {
    label: "Download",
    options: [
      { key: "split", label: "Split", description: "Number of segments" },
      { key: "max-download-limit", label: "Max Download Limit", description: "Max speed (0=unlimited)" },
      { key: "max-connection-per-server", label: "Max Connections", description: "Connections per server" },
      { key: "min-split-size", label: "Min Split Size", description: "Minimum split size" },
      { key: "max-concurrent-downloads", label: "Max Concurrent", description: "Concurrent download limit" },
      { key: "async-dns-server", label: "DNS Server", description: "Async DNS server" },
      { key: "dir", label: "Save Directory", description: "Download directory" },
      { key: "out", label: "File Name", description: "Output filename" },
      { key: "referer", label: "Referer", description: "HTTP referer" },
      { key: "user-agent", label: "User Agent", description: "HTTP user agent" },
      { key: "header", label: "Header", description: "Custom HTTP header" }
    ]
  },
  {
    label: "Torrent",
    options: [
      { key: "bt-max-peers", label: "Max Peers", description: "Max torrent peers" },
      { key: "bt-tracker", label: "Tracker", description: "Tracker list (newline-separated)" },
      { key: "seed-ratio", label: "Seed Ratio", description: "Seed ratio limit" },
      { key: "seed-time", label: "Seed Time", description: "Seed time (minutes)" }
    ]
  },
  {
    label: "Proxy",
    options: [
      {
        key: "all-proxy",
        label: "Proxy URL",
        description: "e.g. http://127.0.0.1:8080",
        placeholder: "http://127.0.0.1:8080"
      },
      { key: "all-proxy-user", label: "Username", description: "Proxy auth username" },
      { key: "all-proxy-passwd", label: "Password", description: "Proxy auth password", type: "password" }
    ]
  }
]

export const ALL_OPTIONS = OPTION_GROUPS.flatMap(({ options }) => options)

export function getOverrides(
  values: Record<string, string>,
  defaults: Record<string, string>,
  saved: Record<string, string>
) {
  return Object.fromEntries(
    ALL_OPTIONS.flatMap(({ key }) => {
      const value = values[key] ?? ""
      const defaultValue = defaults[key] ?? ""
      return value !== defaultValue || (saved[key] !== undefined && value === "") ? [[key, value]] : []
    })
  )
}
