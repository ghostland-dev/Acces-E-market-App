import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string([rules.trim()]),
    email: schema.string([
      rules.trim(),
      rules.email(),
      rules.normalizeEmail({ allLowercase: true }),
      rules.maxLength(255),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string([rules.trim(), rules.minLength(6), rules.confirmed()]),
  })

  public messages = {
    'required': 'le champ field est obligatoire.',
    'unique': 'ces identifiants ont été déjà utilisé..',
    'password.minLength': 'le mot de passe devrait contenir en mois  6 caractèrs.',
    'password_confirmation.confirmed': 'le mot de passe n\'est identique .',
  }
}
