INSERT INTO portfolio.users (username, email, password_hash)
VALUES
-- user 1 pass is hash001
-- user 2 pass is hash002
('onyx', 'onyx@example.com', '$2a$12$FKWNBDtA33/bzRircfFJ7.Ss2SOLeXyf0EXfimOYjSaet5cCTcyey'),
('jdoe', 'jdoe@example.com', '$2a$12$i96cC6vAYebq.UA5bVYfkecBVA042.6r1faqcZJJ6VS.xyaLfwnJ2')
;

INSERT INTO portfolio.investment_account
(nickname, account_type, institution_name, date_opened, user_id)
VALUES
-- User 1
('Onyx Brokerage', 'BROKERAGE', 'Fidelity', '2021-01-10', 1),
('Onyx Roth IRA', 'ROTH_IRA', 'Vanguard', '2020-03-15', 1),
('Onyx HSA', 'HSA', 'HealthEquity', '2023-01-01', 1),
('Onyx Brokerage2', 'BROKERAGE', 'Fidelity', '2022-01-10', 1),
('Onyx Roth IRA2', 'ROTH_IRA', 'Vanguard', '2022-03-15', 1),
('Onyx HSA2', 'HSA', 'HealthEquity', '2022-01-01', 1),


-- User 2
('John Brokerage', 'BROKERAGE', 'Schwab', '2019-05-01', 2),
('John 401k', 'K401', 'Fidelity', '2022-01-15', 2)
;

INSERT INTO portfolio.security
(ticker_symbol, security_name, sector, security_type, general_notes, user_id)
VALUES
-- User 1 (10 securities)
('AAPL', 'Apple Inc.', 'TECHNOLOGY', 'STOCK', 'Large cap tech', 1),
('MSFT', 'Microsoft Corporation', 'TECHNOLOGY', 'STOCK', 'Cloud computing leader', 1),
('VOO', 'Vanguard S&P 500 ETF', 'FINANCIALS', 'ETF', 'Core index fund', 1),
('BND', 'Vanguard Total Bond Market ETF', 'FINANCIALS', 'BOND', 'Bond exposure', 1),
('GOOGL', 'Alphabet Inc.', 'TECHNOLOGY', 'STOCK', 'Search engine giant', 1),
('AMZN', 'Amazon.com Inc.', 'CONSUMER', 'STOCK', 'E-commerce leader', 1),
('TSLA', 'Tesla, Inc.', 'CONSUMER', 'STOCK', 'Electric vehicle manufacturer', 1),
('NVDA', 'NVIDIA Corporation', 'TECHNOLOGY', 'STOCK', 'Semiconductor company', 1),
('JNJ', 'Johnson & Johnson', 'HEALTHCARE', 'STOCK', 'Healthcare company', 1),
('JPM', 'JPMorgan Chase', 'FINANCIALS', 'STOCK', 'Major US bank', 1),

-- User 2 (2 securities)
('JPM', 'JPMorgan Chase', 'FINANCIALS', 'STOCK', 'Major US bank', 2),
('VTI', 'Vanguard Total Stock Market ETF', 'FINANCIALS', 'ETF', 'Broad market fund', 2)
;

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

(5, 5, 20, 140, '2023-05-01')
;
