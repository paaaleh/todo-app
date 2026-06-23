const crypto = require('crypto')

const SECRET = 'mock-jwt-secret-dev-only'
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000

const MIN_DELAY_MS = 200
const MAX_DELAY_MS = 600

const PUBLIC_ROUTES = [
  { method: 'POST', path: '/api/auth/login' },
  { method: 'POST', path: '/api/auth/register' },
]

function base64url(input) {
  return Buffer.from(JSON.stringify(input))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function signToken(payload) {
  const header = base64url({ alg: 'HS256', typ: 'JWT' })
  const body = base64url(payload)
  const sig = crypto
    .createHmac('sha256', SECRET)
    .update(`${header}.${body}`)
    .digest('base64url')
  return `${header}.${body}.${sig}`
}

function verifyToken(token) {
  try {
    const [header, body, sig] = token.split('.')
    const expected = crypto
      .createHmac('sha256', SECRET)
      .update(`${header}.${body}`)
      .digest('base64url')
    if (sig !== expected) return null
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

function isPublicRoute(method, path) {
  return PUBLIC_ROUTES.some((r) => r.method === method && r.path === path)
}

function simulateDelay(req, res, next) {
  const delay = Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS
  setTimeout(next, delay)
}

function corsMiddleware(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  next()
}

function authMiddleware(req, res, next) {
  if (isPublicRoute(req.method, req.path)) return next()

  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' })
  }

  const token = authHeader.slice(7)
  const payload = verifyToken(token)
  if (!payload) {
    return res.status(401).json({ error: 'Токен недействителен или истёк' })
  }

  req.user = payload
  next()
}

function loginHandler(req, res, db) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' })
  }

  const user = db.users.find((u) => u.email === email && u.password === password)
  if (!user) {
    return res.status(401).json({ error: 'Неверный email или пароль' })
  }

  const { password: _, ...safeUser } = user
  const token = signToken({ sub: user.id, email: user.email, exp: Date.now() + TOKEN_TTL_MS })

  res.json({ token, user: safeUser })
}

function registerHandler(req, res, db) {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Имя, email и пароль обязательны' })
  }

  if (db.users.find((u) => u.email === email)) {
    return res.status(409).json({ error: 'Пользователь с таким email уже существует' })
  }

  const newUser = {
    id: db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1,
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  }
  db.users.push(newUser)

  const { password: _, ...safeUser } = newUser
  const token = signToken({ sub: newUser.id, email: newUser.email, exp: Date.now() + TOKEN_TTL_MS })

  res.status(201).json({ token, user: safeUser })
}

module.exports = (middlewares, server) => {
  const router = server.db

  middlewares.unshift(corsMiddleware)
  middlewares.unshift(simulateDelay)

  server.post('/api/auth/login', (req, res) => loginHandler(req, res, router.getState()))
  server.post('/api/auth/register', (req, res) => registerHandler(req, res, router.getState()))

  middlewares.push(authMiddleware)

  return middlewares
}
