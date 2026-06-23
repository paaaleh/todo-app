import { describe, it, expect } from 'vitest'
import {
  validators,
  validate,
  todoTitleRules,
  emailRules,
  passwordRules,
  checkEmailUnique,
} from 'src/utils/validation'

describe('validators.required', () => {
  it('returns true for non-empty string', () => {
    expect(validators.required()('hello')).toBe(true)
  })

  it('returns error for empty string', () => {
    expect(validators.required()('')).toBe('Поле обязательно для заполнения')
  })

  it('returns error for whitespace-only string', () => {
    expect(validators.required()('   ')).not.toBe(true)
  })

  it('accepts custom message', () => {
    expect(validators.required('Custom')('')).toBe('Custom')
  })
})

describe('validators.minLength', () => {
  it('passes when length >= min', () => {
    expect(validators.minLength(3)('abc')).toBe(true)
    expect(validators.minLength(3)('abcd')).toBe(true)
  })

  it('fails when length < min', () => {
    const result = validators.minLength(3)('ab')
    expect(result).not.toBe(true)
    expect(result).toContain('3')
  })
})

describe('validators.maxLength', () => {
  it('passes when length <= max', () => {
    expect(validators.maxLength(5)('abc')).toBe(true)
  })

  it('fails when length > max', () => {
    const result = validators.maxLength(3)('abcd')
    expect(result).not.toBe(true)
    expect(result).toContain('3')
  })
})

describe('validators.email', () => {
  it('accepts valid emails', () => {
    expect(validators.email()('user@example.com')).toBe(true)
    expect(validators.email()('a.b+c@x.co')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(validators.email()('notanemail')).not.toBe(true)
    expect(validators.email()('missing@')).not.toBe(true)
    expect(validators.email()('@nodomain.com')).not.toBe(true)
  })
})

describe('validate()', () => {
  it('returns null when all rules pass', () => {
    expect(validate('hello', [validators.required(), validators.minLength(2)])).toBeNull()
  })

  it('returns first error message when a rule fails', () => {
    const result = validate('', [validators.required(), validators.minLength(2)])
    expect(result).toBe('Поле обязательно для заполнения')
  })

  it('stops at first failing rule', () => {
    const result = validate('a', [validators.required(), validators.minLength(5)])
    expect(result).toContain('5')
  })
})

describe('todoTitleRules', () => {
  it('rejects empty title', () => {
    expect(validate('', todoTitleRules)).not.toBeNull()
  })

  it('rejects single character title', () => {
    expect(validate('a', todoTitleRules)).not.toBeNull()
  })

  it('accepts valid title', () => {
    expect(validate('Buy groceries', todoTitleRules)).toBeNull()
  })

  it('rejects title exceeding 200 characters', () => {
    expect(validate('a'.repeat(201), todoTitleRules)).not.toBeNull()
  })

  it('rejects whitespace-only title', () => {
    expect(validate('   ', todoTitleRules)).not.toBeNull()
  })
})

describe('emailRules', () => {
  it('accepts valid email', () => {
    expect(validate('test@example.com', emailRules)).toBeNull()
  })

  it('rejects empty email', () => {
    expect(validate('', emailRules)).not.toBeNull()
  })

  it('rejects malformed email', () => {
    expect(validate('notanemail', emailRules)).not.toBeNull()
  })
})

describe('passwordRules', () => {
  it('accepts valid password', () => {
    expect(validate('secure123', passwordRules)).toBeNull()
  })

  it('rejects short password', () => {
    expect(validate('abc', passwordRules)).not.toBeNull()
  })

  it('rejects empty password', () => {
    expect(validate('', passwordRules)).not.toBeNull()
  })
})

describe('checkEmailUnique', () => {
  it('returns true when email is unique', async () => {
    const result = await checkEmailUnique('new@example.com', async () => true)
    expect(result).toBe(true)
  })

  it('returns error message when email is taken', async () => {
    const result = await checkEmailUnique('taken@example.com', async () => false)
    expect(result).not.toBe(true)
    expect(result).toContain('email')
  })
})
