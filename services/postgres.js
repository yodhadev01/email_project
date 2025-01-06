const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');
const {get} = require('lodash');
const logger = require('../logger/logger')(__filename);

const databaseName = get(config, 'POSTGRES_BACKEND.DATABASE', null);
const userName = get(config, 'POSTGRES_BACKEND.USER', null);
const password = get(config, 'POSTGRES_BACKEND.PASSWORD', null);
const host = get(config, 'POSTGRES_BACKEND.HOST', null);
const connectionLimit = get(config, 'POSTGRES_BACKEND.CONNECTION_LIMIT', null);
const connectTimeout = get(config, 'POSTGRES_BACKEND.CONNECTION_TIMEOUT', null);
const timeout = get(config, 'POSTGRES_BACKEND.TIMEOUT', null);
const env = get(config, 'ENV', null);

const sequelizeBody = {
	host: host,
	dialect: 'postgres',
	pool: {
		min: 1,
		max: connectionLimit,
		acquire: connectTimeout,
		idle: timeout,
	},
	dialectOptions: {
		ssl: {
			require: true, // This ensures SSL is used
			rejectUnauthorized: false, // Set to false for development; handle in production
		},
	}
};

const sequelize = new Sequelize(databaseName, userName, password, sequelizeBody);

async function executeQueryOnExternalDb (query, params = {}, transaction) {

	try {

		const results = await sequelize.query(query, {
			replacements: { ...params }, // Binding the parameter to the query
			transaction, // Running the query within the transaction
		});

		// Return or process the results as needed
		if (Array.isArray(results) && results.length){
			return results[0];
		}
		return null;
	} catch (error) {
		logger.error('Transaction rolled back due to error:', error);
		throw error;
	}
}

module.exports = {
	sequelize,
	executeQueryOnExternalDb,
};