USE pahana_edu_billing;

-- Insert sample customers
INSERT INTO customers (account_number, name, address, telephone, email, units_consumed) VALUES
('ACC001', 'John Doe', '123 Main Street, Colombo', '+94771234567', 'john@email.com', 150.50),
('ACC002', 'Jane Smith', '456 Park Avenue, Colombo', '+94777654321', 'jane@email.com', 200.75),
('ACC003', 'Bob Johnson', '789 Lake Road, Colombo', '+94779876543', 'bob@email.com', 175.25);

-- Insert sample items
INSERT INTO items (item_code, name, description, unit_price, category, stock_quantity) VALUES
('BOOK001', 'Java Programming Guide', 'Complete Java programming book', 2500.00, 'Books', 50),
('BOOK002', 'MySQL Database Design', 'Database design and optimization', 3000.00, 'Books', 30),
('STAT001', 'A4 Notebook', 'Ruled notebook 200 pages', 150.00, 'Stationery', 100),
('STAT002', 'Pen Set', 'Blue ballpoint pen set', 250.00, 'Stationery', 75),