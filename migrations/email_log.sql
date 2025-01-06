CREATE TYPE email_log_enum AS ENUM ('sent', 'failed', 'pending');

CREATE TABLE email_logs (
    id SERIAL PRIMARY KEY,
    email_account_id BIGINT NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    cc_emails TEXT NULL,
    bcc_emails TEXT NULL,
    subject VARCHAR(255) NULL,
    content TEXT NOT NULL,
    status email_log_enum NOT NULL DEFAULT 'pending',
    error_message JSONB,
    sent_at TIMESTAMP NULL,
    
    -- Foreign key to email_account table
    CONSTRAINT fk_email_logs_email_account FOREIGN KEY (email_account_id) REFERENCES email_account(id) ON DELETE CASCADE
);