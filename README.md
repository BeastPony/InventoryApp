# IT Equipment Inventory

Manage your IT assets — notebooks, printers, cartridges, and equipment — across multiple warehouses.  
Built with React, Vite, Node.js, Express, and PostgreSQL.

## Features

- Track notebooks, printers, cartridges, and other equipment
- Organize equipment by warehouse (3 configurable locations)
- Add, edit, and delete items
- Import/Export current tab data as JSON
- Data persists in PostgreSQL

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18, Vite, CSS                 |
| Backend     | Node.js, Express                    |
| Database    | PostgreSQL                          |
| Libraries   | pg, cors, dotenv, nodemon (dev)     |

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** server (local or remote)

### 1. Clone the repository

    git clone <your-repo-url>
    cd InventoryApp

### 2. Install dependencies

**Server**

    cd server
    npm install

**Client**

    cd ..
    npm install

### 3. Set up the database

Connect to your PostgreSQL server (using psql, pgAdmin, or any client) and create a database and a user.

Example with `psql`:

    CREATE DATABASE it_equipment;
    CREATE USER your_user WITH PASSWORD 'your_strong_password';
    GRANT ALL PRIVILEGES ON DATABASE it_equipment TO your_user;
    \c it_equipment
    GRANT ALL ON SCHEMA public TO your_user;

Then run the schema file included in the project:

    psql -U your_user -d it_equipment -f server/schema.sql

Alternatively, open `server/schema.sql` and execute it manually in your database tool.  
The schema creates all required tables and inserts the default warehouses.

After the tables are created, grant the necessary permissions:

    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_user;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO your_user;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO your_user;

### 4. Configure the server

Create a `.env` file inside the `server` folder:

    DB_USER=your_user
    DB_PASSWORD=your_strong_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=it_equipment
    PORT=3001

Replace the values with the credentials you chose in step 3.

### 5. Start the application

**Start the backend**

    cd server
    npm run dev

The API will run on `http://localhost:3001`.

**Start the frontend**

Open a new terminal in the project root and run:

    npm run dev

The client will open at `http://localhost:5173`.

### 6. Access from other devices (optional)

To serve the app over your local network, update `vite.config.js`:

    export default defineConfig({
      plugins: [react()],
      server: {
        host: true,
        port: 5173,
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
          }
        }
      }
    })

Then open the app on any device in the same network using:

    http://<your-local-ip>:5173

(Find your IP with `ipconfig` on Windows or `ifconfig` on macOS/Linux.)

## Project Structure

    server/              Express API + PostgreSQL connection
      routes/            API endpoints
      schema.sql         Database tables and initial data
    src/                 React frontend
      components/        UI components
      hooks/             Custom hooks
      utils/             CamelCase ↔ snake_case helpers
      api.js             API client

## Customization

- Warehouse names and count can be modified in `server/schema.sql` (the initial `INSERT`) and in the `EquipmentSection` component.
- Database credentials and server port are set via `server/.env`.
- The app uses camelCase in the frontend and automatically converts to snake_case for the database.

## License

MIT
