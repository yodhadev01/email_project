const EmailLogs = require('./email-log-sequelize');

async function logEmail (params = {}, options = {}) {

	const {
		emailAccountId,
		recipientEmail,
		ccMails = null,
		bccMails = null,
		subject,
		content,
		status,
		response = null,
		sentAt = new Date(),
	} = params;

	const {
		transaction
	} = options;

	const emailLog = await EmailLogs.create({
		email_account_id: emailAccountId,
		recipient_email: recipientEmail,
		cc_emails: ccMails ? ccMails.join(',') : null, // Convert array to comma-separated string
		bcc_emails: bccMails ? bccMails.join(',') : null, // Convert array to comma-separated string
		subject: subject,
		content: content,
		status: status,
		response: response,
		sent_at: sentAt,
	}, {transaction});
	return emailLog;
};

async function updateEmailLog (params = {}, options = {}) {

	const {
		id,
		isOpen,
	} = params;

	const {
		transaction
	} = options;

	const toUpdate = {};

	if (isOpen){
		toUpdate.is_open = true;
	}

	const requiredEmailLog = await EmailLogs.findOne({
		where: {
			id: id,
		}
	}, {transaction});

	if (!requiredEmailLog){
		throw new Error('Log Id Invalid');
	}

	const emailLog = await requiredEmailLog.update(toUpdate, {transaction});
	return emailLog;
};

module.exports = {
	logEmail,
	updateEmailLog,
};