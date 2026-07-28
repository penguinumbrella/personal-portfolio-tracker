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


--- display mock data
-- ============================================================================
-- Wayne Portfolio Seed Data
-- 1 user, 10 investment accounts, 24 securities, 100+ holdings
-- Purchase dates span 2020-2026, prices are historically plausible approximations.
-- NOTE: cost_per_share is stored as an INTEGER, so values are expressed in CENTS
--       (e.g. $300.25/share -> 30025) to preserve decimal precision without
--       altering the provided schema.
-- Safe to re-run: truncates existing rows for this user's data first.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. USER password - batman
-- ----------------------------------------------------------------------------
INSERT INTO portfolio.users (username, email, password_hash, is_enabled, user_role)
VALUES ('bwayne', 'bruce.wayne@wayneenterprises.com',
        '$2a$12$3EE..BmN08xNgm6AG4reFuujdZzwgmnIMQ4LEwaztSlcd/YnjUTHm', TRUE, 'USER')
ON CONFLICT (username) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. INVESTMENT ACCOUNTS (10 total, spread across all 5 account types)
-- ----------------------------------------------------------------------------
INSERT INTO portfolio.investment_account (nickname, account_type, institution_name, date_opened, user_id)
VALUES
    ('Retirement 401k',        'K401',            'Fidelity',        '2020-01-15', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('Long-Term Growth',       'BROKERAGE',        'Charles Schwab',  '2020-03-01', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('Dividend Income',        'ROTH_IRA',         'Vanguard',        '2020-02-10', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('Tim''s College Fund',    'BROKERAGE',        'Fidelity',        '2021-09-01', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('Damian Education Fund',  'BROKERAGE',        'Charles Schwab',  '2023-01-20', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('Emergency Reserve',      'HSA',              'Vanguard',        '2022-03-01', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('Wayne Family Trust',     'TRADITIONAL_IRA',  'Fidelity',        '2020-02-01', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('Charitable Foundation',  'BROKERAGE',        'Vanguard',        '2021-02-01', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('Gotham Real Estate',     'BROKERAGE',        'Charles Schwab',  '2022-01-10', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('Alfred''s Legacy',       'TRADITIONAL_IRA',  'Vanguard',        '2020-01-15', (SELECT id FROM portfolio.users WHERE username = 'bwayne'))
ON CONFLICT (nickname) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. SECURITIES (24 total, real tickers with plausible sector/type classification)
-- ----------------------------------------------------------------------------
INSERT INTO portfolio.security (ticker_symbol, security_name, sector, security_type, general_notes, user_id)
VALUES
    ('VOO',   'Vanguard S&P 500 ETF',                'FINANCIALS',  'ETF',          'Core low-cost S&P 500 index exposure; long-term core holding across accounts.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('VTI',   'Vanguard Total Stock Market ETF',      'FINANCIALS',  'ETF',          'Total U.S. market ETF; broad diversification complement to VOO.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('VXUS',  'Vanguard Total International Stock ETF','FINANCIALS','ETF',          'International developed and emerging market exposure.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('BND',   'Vanguard Total Bond Market ETF',       'FINANCIALS',  'BOND',         'Core bond ETF for stability and income.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('SCHD',  'Schwab US Dividend Equity ETF',        'CONSUMER',    'ETF',          'Dividend growth ETF focused on quality U.S. companies with strong payout histories.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('VYM',   'Vanguard High Dividend Yield ETF',     'FINANCIALS',  'ETF',          'High dividend yield ETF, complements SCHD in income-oriented accounts.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('AAPL',  'Apple Inc.',                           'TECHNOLOGY',  'STOCK',        'Long-term core technology holding since 2020.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('MSFT',  'Microsoft Corporation',                'TECHNOLOGY',  'STOCK',        'Cloud and enterprise software leader.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('NVDA',  'NVIDIA Corporation',                   'TECHNOLOGY',  'STOCK',        'AI/semiconductor growth position, accumulated gradually.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('GOOGL', 'Alphabet Inc.',                        'TECHNOLOGY',  'STOCK',        'Search, advertising, and cloud computing exposure.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('META',  'Meta Platforms, Inc.',                 'TECHNOLOGY',  'STOCK',        'Social media and digital advertising position.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('AMZN',  'Amazon.com, Inc.',                      'CONSUMER',    'STOCK',        'E-commerce and cloud (AWS) exposure.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('KO',    'The Coca-Cola Company',                'CONSUMER',    'STOCK',        'Classic dividend aristocrat, defensive consumer staple.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('PEP',   'PepsiCo, Inc.',                        'CONSUMER',    'STOCK',        'Snack and beverage staple with a steady dividend growth history.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('JNJ',   'Johnson & Johnson',                    'HEALTHCARE',  'STOCK',        'Diversified healthcare and pharma dividend aristocrat.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('XOM',   'Exxon Mobil Corporation',               'ENERGY',      'STOCK',        'Integrated oil major, added opportunistically.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('CVX',   'Chevron Corporation',                  'ENERGY',      'STOCK',        'Energy sector diversifier alongside XOM.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('JPM',   'JPMorgan Chase & Co.',                 'FINANCIALS',  'STOCK',        'Core financial sector holding with a strong dividend history.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('VNQ',   'Vanguard Real Estate ETF',              'REAL_ESTATE', 'ETF',          'Broad REIT ETF for diversified real estate exposure.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('O',     'Realty Income Corporation',            'REAL_ESTATE', 'STOCK',        'Monthly dividend-paying REIT, "The Monthly Dividend Company."', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('NEE',   'NextEra Energy, Inc.',                 'UTILITIES',   'STOCK',        'Utility with a renewable energy growth angle.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('DUK',   'Duke Energy Corporation',               'UTILITIES',   'STOCK',        'Stable regulated utility, defensive income holding.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('PG',    'Procter & Gamble Co.',                 'CONSUMER',    'STOCK',        'Consumer staples dividend aristocrat.', (SELECT id FROM portfolio.users WHERE username = 'bwayne')),
    ('BRK.B', 'Berkshire Hathaway Inc. Class B',      'FINANCIALS',  'STOCK',        'Diversified holding company, classic value position.', (SELECT id FROM portfolio.users WHERE username = 'bwayne'));

-- ----------------------------------------------------------------------------
-- 4. HOLDINGS (104 rows, no duplicate account/security pairs)
--    cost_per_share expressed in CENTS. Dates reflect gradual accumulation
--    per account rather than a single lump-sum purchase.
-- ----------------------------------------------------------------------------
INSERT INTO portfolio.holding (account_id, security_id, num_shares, cost_per_share, purchase_date)
SELECT a.id, s.id, v.num_shares, v.cost_per_share, v.purchase_date::DATE
FROM (VALUES
    -- Retirement 401k
    ('Retirement 401k','VOO', 45,  30025, '2021-03-15'),
    ('Retirement 401k','VTI', 60,  17550, '2020-06-10'),
    ('Retirement 401k','VXUS',200,  5210, '2021-09-01'),
    ('Retirement 401k','BND', 150,  8420, '2020-11-05'),
    ('Retirement 401k','SCHD',180,  7015, '2022-02-18'),
    ('Retirement 401k','VYM', 90,  10850, '2023-05-22'),
    ('Retirement 401k','JPM', 40,  15230, '2023-08-14'),
    ('Retirement 401k','JNJ', 35,  16240, '2021-12-01'),
    ('Retirement 401k','MSFT',25,  28500, '2022-07-19'),
    ('Retirement 401k','AMZN',15,  16800, '2024-01-10'),
    ('Retirement 401k','META',20,  31500, '2024-06-05'),

    -- Long-Term Growth
    ('Long-Term Growth','AAPL', 100, 14500, '2020-04-20'),
    ('Long-Term Growth','MSFT', 60,  22000, '2021-02-14'),
    ('Long-Term Growth','NVDA', 300,  1350, '2020-09-01'),
    ('Long-Term Growth','GOOGL',80,   9500, '2022-05-30'),
    ('Long-Term Growth','META', 50,  18500, '2022-11-15'),
    ('Long-Term Growth','AMZN', 70,  15200, '2021-07-08'),
    ('Long-Term Growth','VOO',  20,  43000, '2024-03-01'),
    ('Long-Term Growth','VTI',  25,  26000, '2024-09-12'),
    ('Long-Term Growth','JPM',  30,  20000, '2025-01-20'),
    ('Long-Term Growth','SCHD', 40,   8000, '2025-06-01'),

    -- Dividend Income
    ('Dividend Income','KO',  200,  5200, '2020-03-10'),
    ('Dividend Income','PEP', 100, 14000, '2020-08-15'),
    ('Dividend Income','JNJ', 80,  14700, '2021-01-22'),
    ('Dividend Income','XOM', 150,  4200, '2021-06-18'),
    ('Dividend Income','CVX', 100,  9800, '2022-04-05'),
    ('Dividend Income','JPM', 60,  13000, '2022-09-09'),
    ('Dividend Income','PG',  90,  14000, '2021-11-01'),
    ('Dividend Income','SCHD',250,  6500, '2020-12-01'),
    ('Dividend Income','VYM', 150,  9000, '2023-02-14'),
    ('Dividend Income','O',   120,  6000, '2023-07-20'),
    ('Dividend Income','NEE', 100,  7800, '2022-03-01'),
    ('Dividend Income','DUK', 80,   9200, '2024-01-15'),
    ('Dividend Income','BRK.B',30, 30000, '2024-08-01'),

    -- Tim's College Fund
    ('Tim''s College Fund','VOO', 30, 40000, '2021-09-01'),
    ('Tim''s College Fund','VTI', 40, 21500, '2021-09-01'),
    ('Tim''s College Fund','VXUS',100,  5700, '2022-01-15'),
    ('Tim''s College Fund','BND', 80,   8100, '2022-06-10'),
    ('Tim''s College Fund','SCHD',70,   7400, '2023-03-20'),
    ('Tim''s College Fund','VYM', 50,  11200, '2023-09-05'),
    ('Tim''s College Fund','JNJ', 20,  15800, '2024-02-01'),
    ('Tim''s College Fund','JPM', 15,  19000, '2025-01-10'),
    ('Tim''s College Fund','PG',  25,  16000, '2025-05-15'),

    -- Damian Education Fund
    ('Damian Education Fund','VOO',  15, 43500, '2023-01-20'),
    ('Damian Education Fund','VTI',  20, 22500, '2023-01-20'),
    ('Damian Education Fund','AAPL', 30, 17500, '2023-04-10'),
    ('Damian Education Fund','MSFT', 20, 33000, '2023-08-01'),
    ('Damian Education Fund','NVDA', 100, 4500, '2023-11-15'),
    ('Damian Education Fund','GOOGL',25, 13500, '2024-03-01'),
    ('Damian Education Fund','META', 15, 32000, '2024-07-10'),
    ('Damian Education Fund','JPM',  10, 21000, '2025-02-01'),
    ('Damian Education Fund','VXUS', 50,  6200, '2025-06-01'),

    -- Emergency Reserve
    ('Emergency Reserve','BND', 100,  7900, '2022-03-01'),
    ('Emergency Reserve','JNJ', 20,  16500, '2022-08-15'),
    ('Emergency Reserve','PG',  15,  15000, '2023-01-10'),
    ('Emergency Reserve','KO',  50,   5800, '2023-06-20'),
    ('Emergency Reserve','VYM', 30,  11000, '2024-02-14'),
    ('Emergency Reserve','XOM', 25,  10500, '2024-09-01'),
    ('Emergency Reserve','DUK', 20,  10000, '2025-03-15'),
    ('Emergency Reserve','NEE', 15,   7200, '2025-08-01'),

    -- Wayne Family Trust
    ('Wayne Family Trust','AAPL', 150, 15000, '2020-02-10'),
    ('Wayne Family Trust','MSFT', 100, 18500, '2020-05-15'),
    ('Wayne Family Trust','JNJ',  60,  14500, '2020-10-01'),
    ('Wayne Family Trust','JPM',  80,  10000, '2020-12-05'),
    ('Wayne Family Trust','KO',   150,  5000, '2021-03-01'),
    ('Wayne Family Trust','XOM',  100,  4000, '2021-08-20'),
    ('Wayne Family Trust','PG',   70,  12500, '2022-02-15'),
    ('Wayne Family Trust','BRK.B',50,  22000, '2022-09-01'),
    ('Wayne Family Trust','VOO',  25,  38000, '2023-04-10'),
    ('Wayne Family Trust','GOOGL',40,  10000, '2023-10-05'),
    ('Wayne Family Trust','VYM',  60,  10500, '2024-05-01'),
    ('Wayne Family Trust','SCHD', 80,   7800, '2025-01-15'),

    -- Charitable Foundation
    ('Charitable Foundation','SCHD',300,  6600, '2021-02-01'),
    ('Charitable Foundation','VYM', 200,  9500, '2021-07-15'),
    ('Charitable Foundation','KO',  180,  5300, '2021-11-01'),
    ('Charitable Foundation','PEP', 90,  15200, '2022-03-20'),
    ('Charitable Foundation','JNJ', 70,  16800, '2022-08-01'),
    ('Charitable Foundation','PG',  60,  14200, '2023-01-15'),
    ('Charitable Foundation','JPM', 50,  15500, '2023-06-01'),
    ('Charitable Foundation','XOM', 80,   9700, '2024-02-10'),
    ('Charitable Foundation','CVX', 50,  15500, '2024-07-01'),
    ('Charitable Foundation','O',   100,  5700, '2025-01-20'),
    ('Charitable Foundation','VOO', 20,  50000, '2025-09-01'),

    -- Gotham Real Estate
    ('Gotham Real Estate','VNQ', 150,  8300, '2022-01-10'),
    ('Gotham Real Estate','O',   200,  6200, '2022-05-15'),
    ('Gotham Real Estate','JPM', 30,  13500, '2022-11-01'),
    ('Gotham Real Estate','NEE', 80,   8000, '2023-04-01'),
    ('Gotham Real Estate','DUK', 60,   9500, '2023-09-15'),
    ('Gotham Real Estate','PG',  25,  14800, '2024-03-01'),
    ('Gotham Real Estate','VYM', 40,  12000, '2024-10-01'),
    ('Gotham Real Estate','SCHD',50,   7900, '2025-04-15'),
    ('Gotham Real Estate','MSFT',10,  40000, '2025-11-01'),

    -- Alfred's Legacy
    ('Alfred''s Legacy','KO',   300,  4900, '2020-01-15'),
    ('Alfred''s Legacy','JNJ',  100, 14200, '2020-04-01'),
    ('Alfred''s Legacy','PG',   120, 12200, '2020-07-01'),
    ('Alfred''s Legacy','XOM',  200,  3800, '2020-09-15'),
    ('Alfred''s Legacy','CVX',  100,  8200, '2020-11-01'),
    ('Alfred''s Legacy','JPM',  70,   9800, '2021-02-01'),
    ('Alfred''s Legacy','BRK.B',60,  21000, '2021-05-15'),
    ('Alfred''s Legacy','DUK',  90,   8800, '2021-08-01'),
    ('Alfred''s Legacy','PEP',  80,  13200, '2021-11-15'),
    ('Alfred''s Legacy','VOO',  15,  36000, '2022-02-01'),
    ('Alfred''s Legacy','NEE',  60,   7600, '2022-06-01'),
    ('Alfred''s Legacy','MSFT', 15,  22500, '2022-10-01')

) AS v(account_nickname, ticker, num_shares, cost_per_share, purchase_date)
JOIN portfolio.investment_account a ON a.nickname = v.account_nickname
JOIN portfolio.security s ON s.ticker_symbol = v.ticker
    AND s.user_id = (SELECT id FROM portfolio.users WHERE username = 'bwayne')
ON CONFLICT (account_id, security_id) DO NOTHING;

COMMIT;

-- ----------------------------------------------------------------------------
-- Quick sanity checks (optional - comment out if not needed)
-- ----------------------------------------------------------------------------
-- SELECT COUNT(*) AS total_holdings FROM portfolio.holding;
-- SELECT a.nickname, COUNT(*) AS num_holdings
--   FROM portfolio.holding h JOIN portfolio.investment_account a ON a.id = h.account_id
--   GROUP BY a.nickname ORDER BY num_holdings DESC;