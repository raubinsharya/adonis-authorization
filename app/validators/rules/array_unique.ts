import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

type Options = {
  table: string
  column: string
}

async function unique(value: unknown, options: Options, field: FieldContext) {
  if (!Array.isArray(value) || value.length === 0) return

  // Ensure all elements are strings
  if (!value.every((item) => typeof item === 'string')) {
    field.report('All values must be strings', 'exists', field)
    return
  }

  // Fetch existing entries from the database
  const rows = await db
    .query()
    .from(options.table)
    .select(options.column)
    .whereIn(options.column, value)

  if (rows.length > 0) {
    field.report(`${rows.join(', ')} exist in ${options.table}`, 'unique', field)
  }
}

export const arrayUnique = vine.createRule(unique)
