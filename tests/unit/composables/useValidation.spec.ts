import { describe, it, expect } from 'vitest'
import { useValidation } from 'src/composables/useValidation'
import { validators } from 'src/utils/validation'

const schema = {
  email: [validators.required('Email обязателен'), validators.email()],
  password: [validators.required('Пароль обязателен'), validators.minLength(6)],
}

describe('useValidation', () => {
  describe('initial state', () => {
    it('initialises fields with provided values', () => {
      const { fields } = useValidation({ email: '', password: '' }, schema)
      expect(fields.email.value).toBe('')
      expect(fields.password.value).toBe('')
    })

    it('starts with no errors before touching', () => {
      const { errors } = useValidation({ email: '', password: '' }, schema)
      expect(errors.email).toBeNull()
      expect(errors.password).toBeNull()
    })

    it('starts with touched and dirty false', () => {
      const { fields } = useValidation({ email: '', password: '' }, schema)
      expect(fields.email.touched).toBe(false)
      expect(fields.email.dirty).toBe(false)
    })
  })

  describe('touch()', () => {
    it('reveals error after touching an invalid field', () => {
      const { fields, errors, touch } = useValidation({ email: '', password: '' }, schema)
      fields.email.value = ''
      touch('email')
      expect(errors.email).toBe('Email обязателен')
    })

    it('shows no error after touching a valid field', () => {
      const { fields, errors, touch } = useValidation({ email: '', password: '' }, schema)
      fields.email.value = 'user@example.com'
      touch('email')
      expect(errors.email).toBeNull()
    })
  })

  describe('validate()', () => {
    it('returns false when form is invalid', () => {
      const { validate } = useValidation({ email: '', password: '' }, schema)
      expect(validate()).toBe(false)
    })

    it('returns true when all fields are valid', () => {
      const { fields, validate } = useValidation({ email: '', password: '' }, schema)
      fields.email.value = 'user@example.com'
      fields.password.value = 'secret123'
      expect(validate()).toBe(true)
    })

    it('marks all fields as touched after validate()', () => {
      const { fields, validate } = useValidation({ email: '', password: '' }, schema)
      validate()
      expect(fields.email.touched).toBe(true)
      expect(fields.password.touched).toBe(true)
    })
  })

  describe('isValid', () => {
    it('is false when fields are invalid regardless of touch state', () => {
      const { isValid } = useValidation({ email: 'notvalid', password: '' }, schema)
      expect(isValid).toBe(false)
    })

    it('is true when all fields satisfy their rules', () => {
      const { isValid } = useValidation(
        { email: 'ok@example.com', password: 'secret123' },
        schema,
      )
      expect(isValid).toBe(true)
    })
  })

  describe('reset()', () => {
    it('restores initial values and clears errors', () => {
      const { fields, errors, validate, touch, reset } = useValidation(
        { email: '', password: '' },
        schema,
      )
      fields.email.value = 'changed@x.com'
      touch('email')
      validate()
      reset()

      expect(fields.email.value).toBe('')
      expect(fields.email.touched).toBe(false)
      expect(fields.email.dirty).toBe(false)
      expect(errors.email).toBeNull()
    })
  })

  describe('getValue()', () => {
    it('returns plain object with current field values', () => {
      const { fields, getValue } = useValidation({ email: '', password: '' }, schema)
      fields.email.value = 'user@example.com'
      fields.password.value = 'mypassword'
      expect(getValue()).toEqual({
        email: 'user@example.com',
        password: 'mypassword',
      })
    })
  })

  describe('isDirty', () => {
    it('is false initially', () => {
      const { isDirty } = useValidation({ email: '', password: '' }, schema)
      expect(isDirty).toBe(false)
    })

    it('is true after setting a field dirty', () => {
      const { fields, isDirty } = useValidation({ email: '', password: '' }, schema)
      fields.email.dirty = true
      expect(isDirty).toBe(true)
    })
  })
})
