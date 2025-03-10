import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { hasPermissions, MorphMap } from '@holoyan/adonisjs-permissions'
import { AclModelInterface } from '@holoyan/adonisjs-permissions/types'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'mobile'],
  passwordColumnName: 'password',
})

@MorphMap('users')
export default class User
  extends compose(BaseModel, AuthFinder, hasPermissions())
  implements AclModelInterface
{
  getModelId(): number {
    return this.id
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare middleName?: string

  @column()
  declare lastName?: string

  @column()
  declare email: string

  @column()
  declare mobile?: string

  @column({ serializeAs: null })
  declare status?: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @computed()
  public get fullName(): string {
    return `${this.firstName} ${this.middleName} ${this.lastName}`
  }

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
