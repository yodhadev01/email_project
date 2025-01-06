const {get} = require('lodash');
const EmailAccount = require('./email-sequelize');

async function saveEmailAccount (params = {}, options = {}) {

	const {
		fromName,
		fromEmail,
		userName,
		password,
		smtpSetting,
		imapSetting,
	} = params;

	const {
		transaction
	} = options;

	if (!transaction){
		throw new Error('Transaction Should be Present');
	}

	const requiredEmailAccount = await EmailAccount.create(
		{
			from_name: fromName,
			from_email: fromEmail,
			username: userName,
			password: password,
			use_different_account: get(imapSetting, 'useDifferentAccount', null),
			imap_host: get(imapSetting, 'imapHost', null),
			imap_port: get(imapSetting, 'imapPort', null),
			imap_port_type: get(imapSetting, 'imapPortType', null),
			smtp_host: get(smtpSetting, 'smtpHost', null),
			smtp_port: get(smtpSetting, 'smtpPort', null),
			smtp_port_type: get(smtpSetting, 'smtpPortType', null),
			messages_per_day: get(smtpSetting, 'messagesPerDay', null),
			minimum_time_gap: get(smtpSetting, 'minimumTimeGap', null),
			set_different_reply: get(smtpSetting, 'setDifferentReply', null),
		},
		{ transaction });

	return requiredEmailAccount;
}

async function findEmailAccount (params = {}, options = {}) {

	const {
		transaction
	} = options;

	if (!transaction){
		throw new Error('Transaction Should be Present');
	}

	const requiredEmailAccount = await EmailAccount.findOne({
		order: [['id', 'DESC']], // Order by `id` in descending order
	}, {transaction});

	return requiredEmailAccount;
}

module.exports = {
	saveEmailAccount,
	findEmailAccount,
};