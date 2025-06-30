<h3 align="center">Habit Forge Frontend</h3>

<details>

<summary><strong>Table of Contents</strong></summary>

- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Features In Depth](#features-in-depth)
  - [1. User Authentication](#1-user-authentication)
  - [2. Real Time Habit Tracking](#2-real-time-habit-tracking)
  - [3. Dynamic Content Management](#3-dynamic-content-management)
  - [4. Customizable Themes](#4-customizable-themes)
  - [5. Analytics Dashboard](#5-analytics-dashboard)

</details>

## Built With

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff)](https://ui.shadcn.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](http://tailwindcss.com/)
[![v0](https://img.shields.io/badge/v0-000?logo=v0&logoColor=fff)](https://v0.dev/)
[![Better-Auth](https://img.shields.io/badge/BetterAuth-black?style=for-the-badge&logoColor=white)](https://www.better-auth.com/)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 22 or higher)
- **npm** (version 10 or higher)
- **Backend API** running on `http://localhost:3000` (see backend repository)

### Installation

To install the project, follow these steps:

1. Install the dependencies:
   ```bash
   npm install
   ```
2. Run it:
   ```bash
   npm run dev
   ```

## Features In Depth

### 1. User Authentication

**Secure and Seamless Login Experience**

- **Better Auth Integration**: Robust authentication system with session management
- **Persistent Sessions**: Stay logged in across browser sessions
- **Secure Logout**: Proper session invalidation and cleanup
- **User Profile Management**: Display user information in sidebar
- **Route Protection**: Automatic redirection for unauthenticated users

### 2. Real Time Habit Tracking

**Effortless Habit Management**

- **Instant Completion Toggle**: Mark habits as complete/incomplete with a single click
- **Visual Feedback**: Strikethrough text and visual indicators for completed habits
- **Dual Table System**: Separate views for incomplete and completed habits
- **Real-time Synchronization**: Changes reflect immediately across the interface
- **Bulk Operations**: Manage multiple habits efficiently

**Key Components:**

- Interactive checkboxes for habit completion
- Automatic table updates without page refresh
- Visual distinction between completed and pending habits

### 3. Dynamic Content Management

**Powerful CRUD Operations**

- **Create Habits**: Add new habits with title, description, and priority
- **Edit Habits**: Modify existing habits with inline editing
- **Delete Habits**: Remove habits with confirmation dialogs
- **Priority System**: Organize habits by None, Low, Medium, High priority
- **Search & Filter**: Find habits quickly with real-time search
- **Sorting**: Sort by title, priority, creation date, or completion status
- **Pagination**: Handle large datasets with customizable page sizes

### 4. Customizable Themes

**Beautiful Design That Adapts to You**

- **Three Theme Options**: Light, Dark, and System (follows OS preference)
- **Smooth Transitions**: Seamless theme switching without jarring changes
- **OKLCH Color System**: Modern color space for better color consistency
- **Persistent Preferences**: Theme choice saved across sessions
- **Component-wide Support**: All UI elements adapt to selected theme

**Theme Features:**

- **Light Theme**: Clean, bright interface for daytime use
- **Dark Theme**: Easy on the eyes for low-light environments
- **System Theme**: Automatically matches your operating system preference
- **Visual Indicators**: Clear indication of current theme selection
- **Hover Effects**: Smooth animations for better user experience

### 5. Analytics Dashboard

**Comprehensive Habit Insights**

- **Multi-Period Analysis**: View statistics for week, month, or year
- **Individual Habit Stats**: Detailed analytics for specific habits
- **All Habits Overview**: Aggregate statistics across all habits
- **Visual Charts**: Bar charts, line charts, and pie charts for data visualization
- **Key Metrics**: Track completion rates, streaks, and perfect days

**Chart Types:**

- **Bar Charts**: Daily/weekly/monthly completion counts
- **Line Charts**: Trend analysis over time
- **Pie Charts**: Completion distribution and habit comparison
- **Summary Cards**: Quick overview of key statistics

**Statistics Include:**

- Total completions or perfect days
- Current streak length
- Longest streak achieved
- Completion rate percentages
- Time-based aggregations (daily, weekly, monthly views)
