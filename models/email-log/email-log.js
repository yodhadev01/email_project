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
		errorMessage = null,
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
		error_message: errorMessage,
		sent_at: sentAt,
	}, {transaction});
	return emailLog;
};

module.exports = {
	logEmail,
};