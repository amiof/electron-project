import { getDb } from "./database"

interface RepositoryOptions {
  tableName: string
  jsonFields?: string[]
  validColumns?: string[]
}

export function createRepository({ tableName, jsonFields = [], validColumns }: RepositoryOptions) {
  function parseRow(row: Record<string, unknown>): Record<string, unknown> {
    if (!row) return row
    const result = { ...row }
    for (const field of jsonFields) {
      if (typeof result[field] === "string") {
        try {
          result[field] = JSON.parse(result[field] as string)
        } catch {
          // keep as-is
        }
      }
    }
    return result
  }

  function buildWhere(conditions: Record<string, unknown>): { sql: string; values: unknown[] } {
    const keys = Object.keys(conditions)
    const whereClauses: string[] = []
    const values: unknown[] = []

    for (const key of keys) {
      const value = conditions[key]
      if (value && typeof value === "object" && "values" in value) {
        const placeholders = (value.values as unknown[]).map(() => "?").join(", ")
        whereClauses.push(`${key} IN (${placeholders})`)
        values.push(...(value.values as unknown[]))
      } else {
        whereClauses.push(`${key} = ?`)
        values.push(value === undefined ? null : value)
      }
    }

    const sql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""
    return { sql, values }
  }

  function serializeValue(v: unknown): unknown {
    if (Array.isArray(v) || (typeof v === "object" && v !== null)) {
      return JSON.stringify(v)
    }
    return v === undefined ? null : v
  }

  return {
    find(): Record<string, unknown>[] {
      const rows = getDb().prepare(`SELECT * FROM ${tableName}`).all() as Record<string, unknown>[]
      return rows.map(parseRow)
    },

    findBy(conditions: Record<string, unknown>): Record<string, unknown>[] {
      const { sql, values } = buildWhere(conditions)
      const rows = getDb().prepare(`SELECT * FROM ${tableName} ${sql}`).all(...values) as Record<string, unknown>[]
      return rows.map(parseRow)
    },

    findOneBy(conditions: Record<string, unknown>): Record<string, unknown> | undefined {
      const { sql, values } = buildWhere(conditions)
      const row = getDb().prepare(`SELECT * FROM ${tableName} ${sql} LIMIT 1`).get(...values) as Record<string, unknown> | undefined
      return row ? parseRow(row) : undefined
    },

    findOne(options: { where: Record<string, unknown>; select?: string[] }): Record<string, unknown> | undefined {
      const columns = options.select ? options.select.join(", ") : "*"
      const { sql, values } = buildWhere(options.where)
      const row = getDb().prepare(`SELECT ${columns} FROM ${tableName} ${sql} LIMIT 1`).get(...values) as Record<string, unknown> | undefined
      return row ? parseRow(row) : undefined
    },

    insert(data: Record<string, unknown>) {
      let source: Record<string, unknown> = data

      // Handle wrapped downloadRow
      if (data.downloadRow && typeof data.downloadRow === "object") {
        source = data.downloadRow as Record<string, unknown>
      }

      // Filter to only valid columns if defined
      let entries = Object.entries(source)
      if (validColumns) {
        entries = entries.filter(([k]) => validColumns.includes(k))
      }

      if (entries.length === 0) {
        console.error(`[Repository] insert: no valid columns for table ${tableName}`)
        return { identifiers: [{ Id: 0 }] }
      }

      const columns = entries.map(([k]) => k).join(", ")
      const placeholders = entries.map(() => "?").join(", ")
      const values = entries.map(([_, v]) => serializeValue(v))

      const result = getDb().prepare(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`).run(...values)
      return { identifiers: [{ Id: result.lastInsertRowid }] }
    },

    update(conditions: Record<string, unknown>, data: Record<string, unknown>) {
      const setClauses: string[] = []
      const values: unknown[] = []

      for (const [key, value] of Object.entries(data)) {
        if (validColumns && !validColumns.includes(key)) continue
        setClauses.push(`${key} = ?`)
        values.push(serializeValue(value))
      }

      const { sql: whereSql, values: whereValues } = buildWhere(conditions)
      getDb().prepare(`UPDATE ${tableName} SET ${setClauses.join(", ")} ${whereSql}`).run(...values, ...whereValues)
    },

    delete(conditions: Record<string, unknown>) {
      const { sql, values } = buildWhere(conditions)
      getDb().prepare(`DELETE FROM ${tableName} ${sql}`).run(...values)
    }
  }
}
