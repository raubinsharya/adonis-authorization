import vine from '@vinejs/vine'

export const createPermissionValidator = vine.compile(
  vine.object({
    slug: vine.string().unique({ column: 'slug', table: 'permissions' }),
    title: vine.string().optional(),
  })
)
