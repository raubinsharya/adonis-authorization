import vine from '@vinejs/vine'

export const signupValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim(),
    middleName: vine.string().optional(),
    lastName: vine.string().optional(),
    password: vine.string().minLength(6).maxLength(24).confirmed(),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db
          .from('users')
          .where('email', value)
          .whereNot('status', 'unauth')
          .first()
        return !user
      }),
    mobile: vine
      .string()
      .mobile(() => {
        return {
          locale: ['en-IN'],
        }
      })
      .unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .where('mobile', value)
          .whereNot('email', field.meta.email)
          .first()
        return !user
      })
      .optional(),
  })
)
