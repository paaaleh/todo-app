const fs = require('fs')
const path = require('path')

const initial = {
  users: [
    {
      id: 1,
      name: 'Алексей Иванов',
      email: 'alexey@example.com',
      password: 'password123',
      createdAt: '2024-01-15T10:00:00.000Z',
    },
    {
      id: 2,
      name: 'Мария Петрова',
      email: 'maria@example.com',
      password: 'password123',
      createdAt: '2024-01-20T09:30:00.000Z',
    },
    {
      id: 3,
      name: 'Дмитрий Сидоров',
      email: 'dmitry@example.com',
      password: 'password123',
      createdAt: '2024-02-01T14:00:00.000Z',
    },
  ],
  todos: [
    {
      id: 1,
      userId: 1,
      title: 'Изучить Vue 3 Composition API',
      completed: true,
      tagIds: [1, 2],
      createdAt: '2024-03-01T08:00:00.000Z',
      updatedAt: '2024-03-05T12:00:00.000Z',
    },
    {
      id: 2,
      userId: 1,
      title: 'Реализовать Pinia store',
      completed: true,
      tagIds: [1],
      createdAt: '2024-03-02T09:00:00.000Z',
      updatedAt: '2024-03-06T10:30:00.000Z',
    },
    {
      id: 3,
      userId: 1,
      title: 'Настроить Vue Router с guards',
      completed: false,
      tagIds: [1, 3],
      createdAt: '2024-03-03T10:00:00.000Z',
      updatedAt: '2024-03-03T10:00:00.000Z',
    },
    {
      id: 4,
      userId: 1,
      title: 'Написать unit-тесты для компонентов',
      completed: false,
      tagIds: [4],
      createdAt: '2024-03-04T11:00:00.000Z',
      updatedAt: '2024-03-04T11:00:00.000Z',
    },
    {
      id: 5,
      userId: 1,
      title: 'Подключить TypeScript strict mode',
      completed: true,
      tagIds: [1, 2],
      createdAt: '2024-03-05T08:30:00.000Z',
      updatedAt: '2024-03-07T09:00:00.000Z',
    },
  ],
  tags: [
    { id: 1, name: 'frontend', color: 'blue' },
    { id: 2, name: 'typescript', color: 'indigo' },
    { id: 3, name: 'design', color: 'pink' },
    { id: 4, name: 'testing', color: 'green' },
    { id: 5, name: 'devops', color: 'orange' },
  ],
}

fs.writeFileSync(
  path.join(__dirname, 'db.json'),
  JSON.stringify(initial, null, 2),
  'utf-8',
)

console.log('db.json сброшен до начального состояния')
