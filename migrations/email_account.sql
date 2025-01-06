CREATE TYPE imap_port_enum AS ENUM ('ssl', 'tls', 'none');
CREATE TYPE smtp_port_enum AS ENUM ('ssl', 'tls', 'none');

CREATE TABLE email_account (
    id SERIAL PRIMARY KEY,
    from_name VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL,
    password JSONB NOT NULL,
    use_different_account BOOLEAN DEFAULT FALSE,
    imap_host VARCHAR(255) NOT NULL,
    imap_port INT NOT NULL,
    imap_port_type imap_port_enum NOT NULL,
    smtp_host VARCHAR(255) NOT NULL,
    smtp_port INT NOT NULL,
    smtp_port_type smtp_port_enum NOT NULL,
    messages_per_day INT NOT NULL DEFAULT 1,
    minimum_time_gap INT NOT NULL DEFAULT 0,
    set_different_reply BOOLEAN DEFAULT FALSE
);