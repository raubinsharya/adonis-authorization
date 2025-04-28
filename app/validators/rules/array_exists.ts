import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

type Options = {
  table: string
  column: string
}

async function exists(value: unknown, options: Options, field: FieldContext) {
  if (!Array.isArray(value) || value.length === 0) return

  // Ensure all elements are strings
  if (!value.every((item) => typeof item === 'string' || typeof item === 'number')) {
    field.report('All values must be either of string or number', 'exists', field)
    return
  }

  // Fetch existing entries from the database
  const rows = await db
    .query()
    .from(options.table)
    .select(options.column)
    .whereIn(options.column, value)

  // Convert results into a Set for O(1) lookup
  const existingValues = new Set(rows.map((row) => row[options.column]))

  // Identify missing values
  const missingValues = value.filter((slug) => !existingValues.has(slug))

  if (missingValues.length > 0) {
    field.report(`${missingValues.join(', ')} does not exist in ${options.table}`, 'exists', field)
  }
}

export const arrayExists = vine.createRule(exists)
