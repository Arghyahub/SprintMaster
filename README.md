# SprintMaster

SprintMaster is a modern, full-stack project management application designed to help teams streamline their workflow. It offers a seamless experience for task management, sprint planning, and team collaboration.

## 🚀 Tech Stack

### Frontend

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Material UI (MUI), Radix UI
- **State Management:** Zustand
- **Drag & Drop:** dnd-kit
- **Charts:** MUI X Charts
- **Icons:** Lucide React, MUI Icons

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT, Bcrypt
- **Security:** Helmet, CORS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

## 🛠️ Getting Started

Follow these steps to get the project running locally.

### 1. Database Setup

Start the PostgreSQL database and pgAdmin using Docker Compose.

```bash
docker-compose up -d
```

- **PostgreSQL**: Running on port `5432`
- **pgAdmin**: Running on port `5050` (http://localhost:5050)
  - **Email**: `admin@admin.com`
  - **Password**: `admin`

### 2. Backend Setup

Navigate to the backend directory and set up the server.

```bash
cd backend
```

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Environment Configuration:**
    Create a `.env` file in the `backend` directory based on `.env.example`:

    ```bash
    cp .env.example .env
    ```

    Ensure the `DATABASE_URL` matches your Docker configuration:

    ```env
    DATABASE_URL="postgresql://admin:admin@localhost:5432/mydb"
    PORT=5000
    FRONTEND_URL="http://localhost:3000"
    DEV_ENV="development"
    ACCESS_SECRET="your_access_secret_here"
    REFRESH_SECRET="your_refresh_secret_here"
    ```

3.  **Database Migration:**
    Generate Prisma client and push the schema to the database (if migrations exist, otherwise just generate):

    ```bash
    npx prisma generate
    # If you have migrations: npx prisma migrate dev
    # Or to sync schema directly: npx prisma db push
    ```

4.  **Start the Server:**
    ```bash
    npm run dev
    ```
    The backend runs on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and set up the client.

```bash
cd frontend
```

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Environment Configuration:**
    Create a `.env` file in the `frontend` directory based on `.env.example`:

    ```bash
    cp .env.example .env.local
    ```

    Set the API URL:

    ```env
    NEXT_PUBLIC_API_URL="http://localhost:5000/api"
    ```

3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The frontend runs on `http://localhost:3000`.

## 🌐 Accessing the Application

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Database GUI (pgAdmin):** [http://localhost:5050](http://localhost:5050)

## 📜 Scripts

### Backend (`/backend`)

- `npm run dev`: Starts the development server with Nodemon.
- `npm run build`: Compiles TypeScript and generates Prisma client.
- `npm start`: Runs the compiled application.
- `npm run seed`: Seeds the database (if applicable).

### Frontend (`/frontend`)

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Lints the codebase.

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.
