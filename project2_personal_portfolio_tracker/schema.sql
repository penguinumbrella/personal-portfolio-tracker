CREATE SCHEMA IF NOT EXISTS portfolio;

CREATE TABLE IF NOT EXISTS portfolio.users (
	id				BIGSERIAL	PRIMARY KEY,
	username 		VARCHAR(32) NOT NULL UNIQUE,
	email			VARCHAR(64) NOT NULL,
	password_hash	VARCHAR(64) NOT NULL
);

DROP TYPE IF EXISTS investment_type CASCADE;
CREATE TYPE investment_type AS ENUM (
	'Brokerage',
	'Traditional IRA',
	'Roth IRA',
	'401(k)',
	'HSA'
);

DROP TABLE IF EXISTS portfolio.investment_account;
CREATE TABLE IF NOT EXISTS portfolio.investment_account (
	id					BIGSERIAL 		PRIMARY KEY,
	nickname	VARCHAR(64) 	NOT NULL UNIQUE,
	account_type		investment_type	NOT NULL,
	institution_name	VARCHAR(64) 	NOT NULL,
	date_opened			DATE 			DEFAULT CURRENT_DATE NOT NULL,
	user_id 			BIGINT 			NOT NULL,

	CONSTRAINT fk_user
		FOREIGN KEY(user_id)
		REFERENCES portfolio.users(id)
		ON DELETE CASCADE
);
