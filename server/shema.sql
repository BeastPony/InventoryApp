-- Таблица ноутбуков
CREATE TABLE IF NOT EXISTS notebooks (
    id BIGINT PRIMARY KEY,
    inv_number TEXT NOT NULL,
    computer_name TEXT,
    current_user_name TEXT,
    location TEXT,
    service_tag TEXT,
    model TEXT,
    status TEXT DEFAULT 'active'
);

-- Таблица принтеров
CREATE TABLE IF NOT EXISTS printers (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    model TEXT,
    serial TEXT,
    ip_address TEXT,
    status TEXT DEFAULT 'active'
);

-- Таблица картриджей
CREATE TABLE IF NOT EXISTS cartridges (
    id BIGINT PRIMARY KEY,
    printer_model TEXT NOT NULL,
    cartridge_model TEXT,
    quantity TEXT
);

-- Таблица складов
CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL
);

-- Начальные склады
INSERT INTO warehouses (name, label) VALUES
('warehouse1', 'ABK IT офис'),
('warehouse2', 'ABK Кладовая'),
('warehouse3', 'VCE Кладовая')
ON CONFLICT (name) DO NOTHING;

-- Таблица оборудования (с внешним ключом к складам)
CREATE TABLE IF NOT EXISTS equipment (
    id BIGINT PRIMARY KEY,
    type TEXT NOT NULL,
    firma TEXT,
    model TEXT,
    quantity TEXT,
    comment TEXT,
    status TEXT DEFAULT 'active',
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE
);