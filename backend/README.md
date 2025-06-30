<h3 align="center">Habit Forge Backend</h3>

<details>

<summary><strong>Table of Contents</strong></summary>

- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Reference](#api-reference)
  - [Base URL](#base-url)
  - [Authentication](#authentication)
  - [Endpoints](#endpoints)
    - [Get All Posts](#get-all-posts)
    - [Create a New Post](#create-a-new-post)

</details>

## Built With

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](https://nodejs.org/en)
[![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-%2307405e.svg?logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?logo=drizzle&logoColor=000)](https://orm.drizzle.team/)
[![Better-Auth](https://img.shields.io/badge/BetterAuth-black?style=for-the-badge&logoColor=white)](https://www.better-auth.com/)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 22 or higher)
- **npm** (version 10.9.2)

### Installation

To install the project, follow these steps:

1. Make sure you're in the `backend` directory
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Prepare db:
   ```bash
   npm run prep-db
   ```
4. Run the api:
   ```bash
   npm run dev
   ```
5. Run the seeding script (if needed):
   ```bash
   npm run seed-db
   ```
   this script will create a user named "Example User" with the email "example@example.com" and password "password". And it will add a few habits and entries.

## API Reference

### Base URL

`http://localhost:3000/api`

---

### Authentication

The API uses **JWT bearer tokens** for authentication. Authenticated routes require the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained via the `/auth/sign-in/email` endpoint and set as HTTP-only cookies by the Better Auth system. Alternatively, use Postman/environment cookie injection for manual testing.

---

### Endpoints

#### Authentication

##### Register

- **POST** `/auth/sign-up/email`
- **Description:** Register a new user.
- **Body:**

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "securepassword123"
}
```

- **Responses:**

  - `201 Created` – User registered.
  - `400 Bad Request` – Missing or invalid fields.

##### Login

- **POST** `/auth/sign-in/email`
- **Description:** Log in with email and password.
- **Body:**

```json
{
  "email": "johndoe@example.com",
  "password": "securepassword123"
}
```

- **Responses:**

  - `200 OK` – Returns session cookie.
  - `401 Unauthorized` – Invalid credentials.

---

#### Habits

##### Get All Habits

- **GET** `/habits`
- **Description:** Get all habits for the authenticated user.
- **Responses:**

  - `200 OK` – Returns array of `Habit`.
  - `401 Unauthorized`

- **Example Response Body:**
  ```json
  [
    {
      "id": "habit_abc123",
      "title": "Read 20 pages",
      "description": "Evening reading routine",
      "priority": "none",
      "creation_date": "2025-06-28T12:00:00Z",
      "user_id": "user_123"
    },
    ...
  ]
  ```

##### Create Habit

- **POST** `/habits`
- **Description:** Create a new habit.
- **Body:**

```json
{
  "title": "Workout",
  "description": "Morning session",
  "priority": "medium"
}
```

- **Responses:**

  - `201 Created` – Habit created.
  - `400 Bad Request` – Missing required field `title`.
  - `401 Unauthorized`

- **Example Response Body:**
  ```json
  {
    "id": "habit_xyz456",
    "title": "Workout",
    "description": "Morning session",
    "priority": "medium",
    "creation_date": "2025-06-29T09:00:00Z",
    "user_id": "user_123"
  }
  ```

##### Get Habit By ID

- **GET** `/habits/{id}`
- **Responses:**

  - `200 OK` – Returns `Habit`.
  - `404 Not Found` – Not found or unauthorized.
  - `401 Unauthorized`

- **Example Response Body:**
  ```json
  {
    "id": "habit_abc123",
    "title": "Read 20 pages",
    "description": "Evening reading routine",
    "priority": "none",
    "creation_date": "2025-06-28T12:00:00Z",
    "user_id": "user_123"
  }
  ```

##### Update Habit By ID

- **PUT** `/habits/{id}`
- **Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "priority": "high"
}
```

- **Responses:**

  - `201 Created` – Habit updated.
  - `400 Bad Request`
  - `404 Not Found`
  - `401 Unauthorized`

- **Example Response Body:**
  ```json
  {
    "id": "habit_abc123",
    "title": "Workout",
    "description": "Updated description",
    "priority": "high",
    "creation_date": "2025-06-28T12:00:00Z",
    "user_id": "user_123"
  }
  ```

##### Delete Habit By ID

- **DELETE** `/habits/{id}`
- **Responses:**

  - `204 No Content`
  - `404 Not Found`
  - `401 Unauthorized`

---

#### Entries

##### Get All Entries

- **GET** `/entries`
- **Description:** Get all entries for authenticated user.
- **Responses:**

  - `200 OK` – Array of `Entry`.
  - `401 Unauthorized`

- **Example Response Body:**
  ```json
  [
    {
      "id": "entry_abc123",
      "completion_date": "2025-06-28T20:15:00Z",
      "user_id": "user_123",
      "habit_id": "habit_abc123"
    },
    ...
  ]
  ```

##### Create Entry

- **POST** `/entries`
- **Body:**

```json
{
  "habit_id": "habit_abc123"
}
```

- **Responses:**

  - `201 Created` – Entry created.
  - `400 Bad Request` – Missing `habit_id`.
  - `401 Unauthorized`

- **Example Response Body:**
  ```json
  {
    "id": "entry_xyz456",
    "completion_date": "2025-06-29T09:30:00Z",
    "user_id": "user_123",
    "habit_id": "habit_abc123"
  }
  ```

##### Get Entry By ID

- **GET** `/entries/{entryId}`
- **Responses:**

  - `200 OK` – Returns `Entry`.
  - `404 Not Found`
  - `401 Unauthorized`

- **Example Response Body:**
  ```json
  {
    "id": "entry_abc123",
    "completion_date": "2025-06-28T20:15:00Z",
    "user_id": "user_123",
    "habit_id": "habit_abc123"
  }
  ```

##### Delete Entry By ID

- **DELETE** `/entries/{entryId}`
- **Responses:**

  - `204 No Content`
  - `404 Not Found`
  - `401 Unauthorized`

---

#### Actions

##### Get Incomplete Habits Today

- **GET** `/actions/incomplete`
- **Responses:**

  - `200 OK` – Array of incomplete `Habit`.
  - `401 Unauthorized`

- **Example Response Body:**
  ```json
  [
    {
      "habits": {
        "id": "habit_xyz456",
        "title": "Meditate",
        "description": "10 minutes mindfulness",
        "priority": "low",
        "creation_date": "2025-06-25T08:00:00Z",
        "user_id": "user_123"
      },
      "entries": null
    },
    ...
  ]
  ```

##### Get Completed Habits Today

- **GET** `/actions/complete`
- **Responses:**

  - `200 OK` – Array of completed `Habit`.
  - `401 Unauthorized`

- **Example Response Body:**
  ```json
  [
    {
      "habits": {
        "id": "habit_xyz456",
        "title": "Meditate",
        "description": "10 minutes mindfulness",
        "priority": "low",
        "creation_date": "2025-06-25T08:00:00Z",
        "user_id": "user_123"
      },
      "entries": null
    },
    ...
  ]
  ```

---

#### Stats

##### Get All Habit Stats for a Period

- **GET** `/stats/{period}`
- **Parameters:**

  - `period`: `week` | `month` | `year`

- **Responses:**

  - `200 OK` – Summary and habit stats.
  - `400 Bad Request` – Invalid period.
  - `401 Unauthorized`
  - `404 Not Found`

- **Example Response Body:**
  ```json
  {
    "habits": {
      "habit_abc123": [
        { "date": "2025-06-24", "completed": true },
        { "date": "2025-06-25", "completed": false }
      ]
    },
    "perfectDays": 2,
    "longestStreak": 3,
    "currentStreak": 1
  }
  ```

##### Get Specific Habit Stats for a Period

- **GET** `/stats/{period}/{habitId}`
- **Parameters:**

  - `period`: `week` | `month` | `year`
  - `habitId`: habit identifier

- **Responses:**

  - `200 OK` – Stats object with completion info.
  - `400 Bad Request`
  - `401 Unauthorized`
  - `404 Not Found`

- **Example Response Body:**
  ```json
  {
    "dailyStatus": [
      { "date": "2025-06-24", "completed": true },
      { "date": "2025-06-25", "completed": false }
    ],
    "totalCompletions": 7,
    "longestStreak": 4,
    "currentStreak": 2
  }
  ```

---

### Security

All endpoints except `/auth/sign-up/email` and `/auth/sign-in/email` require JWT-based authentication. Session token is handled via HTTP-only cookies by default, compatible with `better-auth` integration.

Use Postman or browser DevTools to ensure cookies are sent correctly.
