# IT Equipment Inventory

Web application for managing IT assets: notebooks, printers, cartridges and other equipment across multiple warehouses.

Built with React, Vite, Node.js, Express and PostgreSQL.

## Features

- Track notebooks, printers, cartridges and equipment
- Organize equipment by warehouse (3 locations)
- Add, edit, delete items
- Import/Export data as JSON

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL server

### Installation

1. **Clone the repo**
   ```bash
   git clone <repository-url>
   cd InventoryApp
Install backend dependencies

bash
cd server
npm install
Set up environment
Create a .env file inside the server folder:

env
DB_USER=your_db_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=it_equipment
PORT=3001
Prepare the database
Create a PostgreSQL database and run the SQL schema provided in server/schema.sql (or execute the table creation manually).

Install frontend dependencies

bash
cd ..
npm install
Start the servers

Backend: cd server && npm run dev → http://localhost:3001

Frontend: npm run dev → http://localhost:5173

Usage
Open the app, switch between tabs, select a warehouse (for equipment) and manage your data. Use the Export and Import buttons to backup or restore records.

License
MIT