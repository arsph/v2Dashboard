-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  date TEXT NOT NULL,
  traffic_amount TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  price INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  server TEXT NOT NULL,
  date TEXT NOT NULL,
  price INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
); 