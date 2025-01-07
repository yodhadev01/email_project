const { DataTypes } = require('sequelize');
const {sequelize} = require('../../services/postgres');

const EmailAccount = sequelize.define('EmailAccount', {
	id: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},
	from_name: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	from_email: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	username: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	password: {
		type: DataTypes.JSONB,
		allowNull: false,
	},
	use_different_account: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	imap_host: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	imap_port: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	imap_port_type: {
		type: DataTypes.ENUM('ssl', 'tls', 'none'),
		allowNull: false,
	},
	smtp_host: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	smtp_port: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	smtp_port_type: {
		type: DataTypes.ENUM('ssl', 'tls', 'none'),
		allowNull: false,
	},
	messages_per_day: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 1,
	},
	minimum_time_gap: {
		type: DataTypes.INTEGER, // Sequelize does not support INTERVAL directly, so we use STRING for custom parsing
		allowNull: false,
		defaultValue: 0,
	},
	set_different_reply: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
}, {
	tableName: 'email_account',
	timestamps: false,
});

module.exports = EmailAccount;
