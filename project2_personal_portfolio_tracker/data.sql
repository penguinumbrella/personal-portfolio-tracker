INSERT INTO portfolio.users (username, email, password_hash)
VALUES
('onyx', 'onyx@example.com', 'hash001'),
('jdoe', 'jdoe@example.com', 'hash002'),
('asmith', 'asmith@example.com', 'hash003'),
('bjones', 'bjones@example.com', 'hash004'),
('mwilson', 'mwilson@example.com', 'hash005');

INSERT INTO portfolio.investment_account
(nickname, account_type, institution_name, date_opened, user_id)
VALUES
-- User 1
('Onyx Brokerage', 'BROKERAGE', 'Fidelity', '2021-01-10', 1),
('Onyx Roth IRA', 'ROTH_IRA', 'Vanguard', '2020-03-15', 1),
('Onyx HSA', 'HSA', 'HealthEquity', '2023-01-01', 1),

-- User 2
('John Brokerage', 'BROKERAGE', 'Schwab', '2019-05-01', 2),
('John 401k', 'K401', 'Fidelity', '2022-01-15', 2),

-- User 3
('Anna Brokerage', 'BROKERAGE', 'Vanguard', '2020-07-20', 3),
('Anna Roth', 'ROTH_IRA', 'Vanguard', '2021-08-15', 3),
('Anna Traditional', 'TRADITIONAL_IRA', 'Schwab', '2018-11-01', 3),

-- User 4
('Bob Brokerage', 'BROKERAGE', 'Robinhood', '2021-09-01', 4),
('Bob IRA', 'TRADITIONAL_IRA', 'Fidelity', '2020-10-15', 4),

-- User 5
('Mary Brokerage', 'BROKERAGE', 'Merrill', '2020-02-14', 5),
('Mary 401k', 'K401', 'Empower', '2021-03-01', 5),
('Mary Roth', 'ROTH_IRA', 'Vanguard', '2022-06-01', 5);

INSERT INTO portfolio.security
(ticker_symbol, security_name, sector, security_type, general_notes, user_id)
VALUES
-- User 1 (4 securities)
('AAPL', 'Apple Inc.', 'TECHNOLOGY', 'STOCK', 'Large cap tech', 1),
('MSFT', 'Microsoft Corporation', 'TECHNOLOGY', 'STOCK', 'Cloud computing leader', 1),
('VOO', 'Vanguard S&P 500 ETF', 'FINANCIALS', 'ETF', 'Core index fund', 1),
('BND', 'Vanguard Total Bond Market ETF', 'FINANCIALS', 'BOND', 'Bond exposure', 1),

-- User 2 (2 securities)
('JPM', 'JPMorgan Chase', 'FINANCIALS', 'STOCK', 'Major US bank', 2),
('VTI', 'Vanguard Total Stock Market ETF', 'FINANCIALS', 'ETF', 'Broad market fund', 2),

-- User 3 (3 securities)
('JNJ', 'Johnson & Johnson', 'HEALTHCARE', 'STOCK', 'Healthcare company', 3),
('PFE', 'Pfizer Inc.', 'HEALTHCARE', 'STOCK', 'Pharmaceutical company', 3),
('FXAIX', 'Fidelity 500 Index Fund', 'FINANCIALS', 'MUTUAL_FUND', 'Index mutual fund', 3),

-- User 4 (1 security)
('XOM', 'Exxon Mobil', 'ENERGY', 'STOCK', 'Energy producer', 4),

-- User 5 (3 securities)
('PLD', 'Prologis', 'REAL_ESTATE', 'STOCK', 'Industrial REIT', 5),
('NEE', 'NextEra Energy', 'UTILITIES', 'STOCK', 'Utility company', 5),
('CAT', 'Caterpillar Inc.', 'INDUSTRIALS', 'STOCK', 'Heavy equipment', 5);

INSERT INTO portfolio.holding
(account_id, security_id, num_shares, cost_per_share, purchase_date)
VALUES

-- User 1 accounts
(1, 1, 50, 150, '2023-01-15'),
(1, 2, 25, 300, '2023-02-01'),

(2, 3, 20, 400, '2022-10-01'),

(3, 1, 10, 145, '2024-01-01'),

-- User 2 accounts
(4, 5, 35, 145, '2022-03-01'),

(5, 5, 20, 140, '2023-05-01'),

-- User 3 accounts
(6, 7, 40, 160, '2023-01-10'),
(6, 8, 25, 45, '2023-02-10'),

(8, 9, 40, 150, '2022-01-15'),

-- User 4 accounts
(9, 10, 70, 95, '2023-04-01'),

(10, 10, 45, 90, '2022-06-01'),

-- User 5 accounts
(11, 11, 35, 120, '2023-01-01'),
(11, 12, 60, 70, '2023-02-01'),

(12, 12, 100, 65, '2022-05-01'),

(13, 11, 15, 115, '2024-01-15'),
(13, 13, 10, 205, '2024-03-01');