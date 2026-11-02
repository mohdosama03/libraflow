# LibraFlow

A full-stack MERN Library Management System — a digital library for discovering, borrowing and
managing books, with separate Student and Admin/Librarian experiences.

- **Frontend:** React 18, React Router, Tailwind CSS, Recharts, lucide-react, react-hot-toast (Vite)
- **Backend:** Node.js, Express, JWT authentication, role-based authorization
- **Database:** MongoDB with Mongoose

---

## 1. Project structure

```
libraflow/
├── server/                 Express API
│   ├── config/db.js         MongoDB connection
│   ├── models/               Mongoose schemas (User, Book, Category, Borrowing, Request, Fine, Wishlist, Notification, Review)
│   ├── controllers/          Route handlers / business logic
│   ├── routes/                REST endpoints
│   ├── middleware/           JWT auth, role authorization, validation, error handling
│   ├── utils/                  Helpers (seeder, token generation, notifications)
│   └── server.js               App entry point
├── client/                  React app (Vite)
│   └── src/
│       ├── components/       Reusable UI (cards, tables, badges, modals...)
│       ├── layouts/            Public / Student / Admin shells
│       ├── pages/               Route-level screens (public, student, admin)
│       ├── context/            Auth state
│       └── services/          Axios API clients
└── package.json             Root scripts to run both apps together
```

---

## 2. Prerequisites

- Node.js 18+ and npm
- A MongoDB database — either:
  - **Local:** [Install MongoDB Community Edition](https://www.mongodb.com/docs/manual/administration/install-community/) and run `mongod`, or
  - **Atlas (cloud, free tier):** create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas) and copy its connection string

---

## 3. Install dependencies

From the project root:

```bash
npm run install:all
```

This installs dependencies for both `server/` and `client/`. (You can also `cd server && npm install`
and `cd client && npm install` separately.)

---

## 4. Configure environment variables

**Backend** — copy the example file and fill in your values:

```bash
cd server
cp .env.example .env
```

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/libraflow
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
FINE_PER_DAY=5
BORROW_DAYS=14
MAX_BOOKS_PER_STUDENT=5
```

If you're using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
(`mongodb+srv://...`). Set `JWT_SECRET` to a long random string.

**Frontend** — copy its example file too:

```bash
cd ../client
cp .env.example .env
```

```
VITE_API_URL=http://localhost:5000/api
```

---

## 5. Seed demo data

With `MONGODB_URI` pointing at a reachable database, run from the project root:

```bash
npm run seed
```

This clears existing data and inserts:

- 9 categories (Programming, Science, History, Fiction, Biography, Business, Self Help, Literature, Technology)
- 20 books spread across those categories, each with a generated QR code
- 1 admin account and 10 student accounts
- A mix of active borrowings (including a couple that are intentionally overdue), returned
  borrowings (one with a fine), pending/approved requests, wishlist entries, and notifications

**Demo accounts** (password for all: `Password@123`):

| Role    | Email                                    |
|---------|-------------------------------------------|
| Admin   | `admin@libraflow.edu`                     |
| Student | `aarav.sharma@student.libraflow.edu`      |

(Nine more student accounts follow the same `firstname.lastname@student.libraflow.edu` pattern —
see `server/utils/seeder.js` for the full list.)

To wipe all collections without reseeding: `npm run seed -- -d` (run from `server/`: `npm run seed:destroy`).

---

## 6. Run the app

From the project root, start both the API and the frontend together:

```bash
npm run dev
```

- Backend API → `http://localhost:5000/api` (health check at `/api/health`)
- Frontend → `http://localhost:5173`

Or run them separately:

```bash
npm run server   # API only, with nodemon
npm run client   # Vite dev server only
```

---

## 7. What's implemented

**Public site:** Home (hero, search, live stats, popular/recent books, categories, how-it-works),
Books (search, category/author/availability filters, sorting, pagination), Book Details (full
metadata, QR code, reviews, borrow/request/wishlist actions), Categories, About, Login (student/admin
toggle), Register, Forgot Password.

**Student dashboard:** overview with stats and personalized recommendations, currently-borrowed
books with due/overdue indicators, borrowing history, my requests, wishlist, notifications, profile.

**Admin dashboard:** circulation stats, four live charts (books issued/returned per month, popular
categories, most-borrowed books), book CRUD with validation, category CRUD, student management
(search, activate/deactivate, detail view with history and fines), Issue Book flow (search student +
book, availability/limit checks), Return Book flow with automatic late-fine calculation, request
approval/rejection, fine settlement (paid/waived), reports with CSV export, notifications, settings.

**Cross-cutting:** JWT auth with role-based route protection on both client and server, toast
notifications for every action, loading/empty/error states throughout, fully responsive layouts
(including a mobile sidebar drawer for both dashboards), automatic overdue-status detection, and a
QR code generated per book for quick desk lookup.

---

## 8. Notes

- Fine-per-day, borrowing period and per-student book limits are controlled via the server's
  `.env` (`FINE_PER_DAY`, `BORROW_DAYS`, `MAX_BOOKS_PER_STUDENT`) rather than hard-coded.
- Book cover art is generated (gradient + initials) rather than pulling external images, so the app
  works fully offline with no third-party image dependencies.
- CSV export on the Reports page is generated client-side — no extra backend endpoint needed.
