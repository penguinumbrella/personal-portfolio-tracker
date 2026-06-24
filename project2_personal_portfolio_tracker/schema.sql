CREATE SCHEMA IF NOT EXISTS portfolio;

CREATE TABLE IF NOT EXISTS portfolio.users (
	id				BIGSERIAL	PRIMARY KEY,
	username 		VARCHAR(32) NOT NULL UNIQUE,
	email			VARCHAR(64) NOT NULL,
	password_hash	VARCHAR(64) NOT NULL
);

DROP TYPE IF EXISTS portfolio.investment_type CASCADE;
CREATE TYPE portfolio.investment_type AS ENUM (
	'BROKERAGE',
	'TRADITIONAL_IRA',
	'ROTH_IRA',
	'K401',
	'HSA'
);

DROP TABLE IF EXISTS portfolio.investment_account;
CREATE TABLE IF NOT EXISTS portfolio.investment_account (
	id					BIGSERIAL 		PRIMARY KEY,
	nickname			VARCHAR(64) 	NOT NULL UNIQUE,
	account_type		portfolio.investment_type	NOT NULL,
	institution_name	VARCHAR(64) 	NOT NULL,
	date_opened			DATE 			DEFAULT CURRENT_DATE NOT NULL,
	user_id 			BIGINT 			NOT NULL,

	CONSTRAINT fk_user
		FOREIGN KEY(user_id)
		REFERENCES portfolio.users(id)
		ON DELETE CASCADE
);

DROP TYPE IF EXISTS portfolio.sector_type; 
CREATE TYPE portfolio.sector_type AS ENUM (
	'TECHNOLOGY',
	'HEALTHCARE',
	'FINANCIALS',
	'CONSUMER',
	'ENERGY',
	'INDUSTRIALS',
	'UTILITIES',
	'REAL_ESTATE'
);

DROP TYPE IF EXISTS portfolio.security_type_enum; 
CREATE TYPE portfolio.security_type_enum AS ENUM (
	'STOCK', 
	'ETF', 
	'MUTUAL_FUND', 
	'BOND');

DROP TABLE IF EXISTS portfolio.security;
CREATE TABLE IF NOT EXISTS portfolio.security (
	id 				BIGSERIAL 		PRIMARY KEY,
	ticker_symbol 	VARCHAR(10) 	NOT NULL,
	security_name 	VARCHAR(64) 	NOT NULL,
	sector 			portfolio.sector_type 	NOT NULL,
	security_type 	portfolio.security_type_enum 	NOT NULL,
	general_notes 	TEXT,
	user_id 			BIGINT 			NOT NULL,

	CONSTRAINT fk_user
		FOREIGN KEY(user_id)
		REFERENCES portfolio.users(id)
		ON DELETE CASCADE
);

DROP TABLE IF EXISTS portfolio.holding;
CREATE TABLE IF NOT EXISTS portfolio.holding (
	account_id 		BIGINT NOT NULL,
	security_id 	BIGINT NOT NULL,
	PRIMARY KEY (account_id, security_id),
	num_shares		INT		NOT NULL,
	cost_per_share	INT		NOT NULL,
	purchase_date	DATE 	NOT NULL,
	CONSTRAINT 			holding_account
		FOREIGN KEY 	(account_id) 
		REFERENCES 		portfolio.investment_account (id) 
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT 			holding_security
		FOREIGN KEY 	(security_id) 
		REFERENCES 		portfolio.security (id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);
	
CREATE INDEX IF NOT EXISTS holding_security_idx
    ON portfolio.holding(security_id);
