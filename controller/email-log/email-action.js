const {get} = require('lodash');
const utils = require('../../utils/utils');
const emailAccountModel = require('../../models/email/email');
const emailLogModel = require('../../models/email-log/email-log');
const {sequelize} = require('../../services/postgres');
const logger = require('../../logger/logger')(__filename);

async function sendEmail (params = {}) {

	const {
		toEmail,
		subject,
		emailBody,
		ccList,
		bccList,
	} = params;
	
	const transaction = await sequelize.transaction();
	try {
		const requiredEmailAccount = await emailAccountModel.findEmailAccount({}, {
			transaction,
		});

		const password = await utils.decryptPassword({
			encryptedData: get(requiredEmailAccount, 'password.encryptedData', null), 
			ivHex: get(requiredEmailAccount, 'password.iv', null)
		});

		const requiredEamilLog = await emailLogModel.logEmail({
			emailAccountId: get(requiredEmailAccount, 'id', null),
			recipientEmail: toEmail,
			ccMails: ccList,
			bccMails: bccList,
			subject,
			content: emailBody,
		}, {transaction});
		
		const response = await utils.sendEmail({
			smtpHost: get(requiredEmailAccount, 'smtp_host', null),
			smtpPort: get(requiredEmailAccount, 'smtp_port', null),
			smtpUser: get(requiredEmailAccount, 'username', null),
			fromEmail: get(requiredEmailAccount, 'from_email', null),
    		fromName: get(requiredEmailAccount, 'from_name', null),
			password: password,
			toEmail: toEmail,
			subject: subject,
			body: emailBody,
			ccList: ccList,
			bccList: bccList,
			id: get(requiredEamilLog, 'id', null),
		}, {transaction});

		const status = response.success === true ? 'sent' : 'failed';

		await requiredEamilLog.update({
			status,
			response,
		}, {transaction});

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		logger.error(error);
		throw new Error(error.message);
	}
}

async function emailTracker (params = {}) {

	const {
		id
	} = params;
	
	const transaction = await sequelize.transaction();
	try {

		await emailLogModel.updateEmailLog({
			id,
			isOpen: true,
		}, {transaction});

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		logger.error(error);
		throw new Error(error.message);
	}
}

module.exports = {
	sendEmail,
	emailTracker,
};
