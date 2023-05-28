import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordResetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    token: schema.string([rules.trim()]),
    email: schema.string([
      rules.trim(),
      rules.email(),
      rules.exists({ table: 'users', column: 'email' }),
    ]),
    password: schema.string([rules.trim(), rules.minLength(6), rules.confirmed()]),
  })

  public messages = {
    'required': 'le champ field est obligatoire.',
    'email': 'ces identifiants ont été déjà utilisé..',
    'password.minLength': 'le mot de passe devrait contenir en mois  6 caractèrs.',
    'password_confirmation.confirmed': 'le mot de passe n\'est identique .',
  }
}
