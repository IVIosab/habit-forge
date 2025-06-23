<h3 align="center">Habit Forge Backend</h3>

<details>

<summary><strong>Table of Contents</strong></summary>

- [Built With](#built-with-)
- [Getting Started](#getting-started-)
  - [Prerequisites](#prerequisites-)
  - [Installation](#installation-)
- [API Reference](#api-reference-)
  - [Base URL](#base-url-)
  - [Authentication](#authentication-)
  - [Endpoints](#endpoints-)
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
   npm run prep
   ```
4. Run it:
   ```bash
   npm run dev
   ```

## API Reference

Here's a detailed list of all the available API endpoints, request parameters, and responses.

### Base URL //TODO

### Authentication //TODO

### Endpoints //TODO

<!--
#### Get All Posts

**Endpoint:** `GET /posts`

**Description:** Fetches a list of all posts.

**Query Parameters:**

| Parameter | Type     | Description                                         |
| --------- | -------- | --------------------------------------------------- |
| `page`    | `number` | The page number (default: 1)                        |
| `limit`   | `number` | The number of posts to fetch per page (default: 10) |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Post Title",
      "content": "Post content goes here.",
      "author": "Author Name",
      "created_at": "2024-12-01T12:00:00Z"
    },
    ...
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

#### Create a New Post

**Endpoint:** `POST /posts`

**Description:** Creates a new post.

**Request Body:**

```json
{
  "title": "New Post Title",
  "content": "Content of the new post.",
  "author": "Author Name"
}
```

**Response:**

```json
{
  "id": 101,
  "title": "New Post Title",
  "content": "Content of the new post.",
  "author": "Author Name",
  "created_at": "2024-12-15T10:00:00Z"
}
``` -->
