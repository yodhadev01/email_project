const { DataTypes } = require('sequelize');
const {sequelize} = require('../../services/postgres');

const EmailLogs = sequelize.define('EmailLogs', {
	id: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},
	email_account_id: {
		type: DataTypes.BIGINT,
		allowNull: false,
		references: {
			model: 'email_account', // Name of the referenced table
			key: 'id',
		},
		onDelete: 'CASCADE', // Automatically delete logs if the email account is deleted
	},
	recipient_email: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	cc_emails: {
		type: DataTypes.TEXT, // Store comma-separated CC email addresses
		allowNull: true,
	},
	bcc_emails: {
		type: DataTypes.TEXT, // Store comma-separated BCC email addresses
		allowNull: true,
	},
	subject: {
		type: DataTypes.STRING(255),
		allowNull: true,
	},
	content: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	status: {
		type: DataTypes.ENUM('sent', 'failed', 'pending'),
		allowNull: false,
		defaultValue: 'pending',
	},
	response: {
		type: DataTypes.JSONB,
		allowNull: true, // Null if no error occurred
	},
	is_open: {
		type: DataTypes.BOOLEAN,
		allowNull: true, // Null if no error occurred
		defaultValue: false,
	},
	sent_at: {
		type: DataTypes.DATE,
		allowNull: true, // Null until the email is sent successfully
	},
}, {
	tableName: 'email_logs',
	timestamps: false,
});

module.exports = EmailLogs;