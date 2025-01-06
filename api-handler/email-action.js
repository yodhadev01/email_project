const {get} = require('lodash');
const logger = require('../logger/logger')(__filename);
const emailActionController = require('../controller/email-log/email-action');

async function sendEmail(req, res) {
	
	try {

		const body = get(req, 'body', {});

		const {
			toEmail,
			subject,
			emailBody,
			ccList,
			bccList,
		} = body;

		await emailActionController.sendEmail({
			toEmail,
			subject,
			emailBody,
			ccList,
			bccList,
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
	sendEmail,
};