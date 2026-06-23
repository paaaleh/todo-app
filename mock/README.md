# Mock Backend

Mock-сервер на базе json-server для локальной разработки ToDo приложения.

## Запуск

```bash
cd mock
npm install
npm start
```

Сервер запустится на `http://localhost:3000`.

## Эндпоинты

### Аутентификация (публичные)

| Метод | URL | Описание |
|-------|-----|----------|
| POST | `/api/auth/login` | Вход. Body: `{ email, password }` |
| POST | `/api/auth/register` | Регистрация. Body: `{ name, email, password }` |

Ответ: `{ token: string, user: UserProfile }`

Токен нужно передавать во всех последующих запросах через заголовок:
```
Authorization: Bearer <token>
```

### Задачи (требуют токен)

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/todos?userId=1` | Список задач пользователя |
| POST | `/api/todos` | Создать задачу |
| PATCH | `/api/todos/:id` | Обновить задачу |
| DELETE | `/api/todos/:id` | Удалить задачу |

### Теги

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/tags` | Список тегов |

## Тестовые пользователи

| Email | Пароль |
|-------|--------|
| alexey@example.com | password123 |
| maria@example.com | password123 |
| dmitry@example.com | password123 |

## Сброс данных

```bash
npm run reset
```

## Особенности

- Задержка ответа: 200–600ms (имитация сети)
- CORS настроен для `http://localhost:9000`
- JWT токены истекают через 24 часа
- Данные сохраняются в `db.json` между перезапусками
