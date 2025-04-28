import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim(),
    middleName: vine.string().optional(),
    lastName: vine.string().optional(),
    password: vine.string().minLength(6).maxLength(24).confirmed(),
    status: vine.enum(['unauth', 'active', 'deactive', 'block']),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    mobile: vine
      .string()
      .mobile(() => {
        return {
          locale: ['en-IN'],
        }
      })
      .unique(async (db, value) => {
        const user = await db.from('users').where('mobile', value).first()
        return !user
      })
      .optional(),
  })
)
