const {get} = require('lodash');
const logger = require('../logger/logger')(__filename);
const emailController = require('../controller/email/save');

async function saveEmailSettings(req, res) {
	
	try {

		const body = get(req, 'body', {});

		const {
			fromName,
			fromEmail,
			userName,
			password,
			smtpSetting,
			imapSetting,
		} = body;

		await emailController.save({
			fromName,
			fromEmail,
			userName,
			password,
			smtpSetting,
			imapSetting,
		});

		return res.status(200).json({
			status: 'OK',
		});
	} catch (error) {
		logger.error(error);
		res.status(500).json({
			message: get(error, 'message', 'Internal Server Error'),
		});
	}
};

module.exports = {
	saveEmailSettings,
};