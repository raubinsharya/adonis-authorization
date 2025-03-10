import vine from '@vinejs/vine'

export const createRoleValidator = vine.compile(
  vine.object({
    slug: vine.string().unique({ column: 'slug', table: 'roles' }),
    title: vine.string().optional(),
  })
)
