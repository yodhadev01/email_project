const {get} = require('lodash');
const {sequelize} = require('../../services/postgres');
const utils = require('../../utils/utils');
const constant = require('../../utils/constant');
const emailAccountModel = require('../../models/email/email');
const logger = require('../../logger/logger')(__filename);

async function validateEmailSetting (params = {}) {

	const {
		fromName,
		fromEmail,
		userName,
	} = params;

	const isNameValid = utils.validateName(fromName);
	const isEmailValid = utils.validateEmail(fromEmail);
	const isUserNameValid = utils.validateUsername(userName);

	if (!isNameValid || !isEmailValid || !isUserNameValid){
		throw new Error('Please Enter Valid Data');
	}
}

async function validateSMTPSetting (params = {}) {

	const {
		smtpSetting
	} = params;

	const {
		smtpHost,
		smtpPort,
		smtpPortType,
		messagesPerDay,
		minimumTimeGap,
		setDifferentReply,
	} = smtpSetting;

	const validPortTypeList = get(constant, 'validPortTypeList', []);

	if (!validPortTypeList.includes(smtpPortType)){
		throw new Error('SMTP Port Type is Invalid');
	}

	if (typeof messagesPerDay !== 'number' || !Number.isInteger(messagesPerDay) || messagesPerDay < 0){
		throw new Error('Message Per Day Should be Valid');
	}

	if (typeof smtpPort !== 'number' || !Number.isInteger(smtpPort) || !(smtpPort >= 0 && smtpPort <= 65535)){
		throw new Error('SMTP Port Should be Valid');
	}

	if (![true, false].includes(setDifferentReply)) {
		throw new Error('Set Diffrent Reply must be Boolean');
	}

	if (typeof minimumTimeGap !== 'number' || !Number.isInteger(minimumTimeGap) || (minimumTimeGap < 0)){
		throw new Error('Minimum Time Gap Should be Valid');
	}

	const isHostValid = utils.validateHost(smtpHost);

	if (!isHostValid){
		throw new Error('SMTP Host Should be Valid');
	}
}

async function validateIMAPSetting (params = {}) {

	const {
		imapSetting,
	} = params;

	const {
		imapHost,
		imapPort,
		imapPortType,
		useDiffrentAccount,
	} = imapSetting;

	const validPortTypeList = get(constant, 'validPortTypeList', []);

	if (!validPortTypeList.includes(imapPortType)){
		throw new Error('IMAP Port Type is Invalid');
	}

	if (typeof imapPort !== 'number' || !Number.isInteger(imapPort) || !(imapPort >= 0 && imapPort <= 65535)){
		throw new Error('IMAP Port Should be Valid');
	}

	if (![true, false].includes(useDiffrentAccount)) {
		throw new Error('Use Diffrent Account must be Boolean');
	}

	const isHostValid = utils.validateHost(imapHost);

	if (!isHostValid){
		throw new Error('IMAP Host Should be Valid');
	}
}

async function save (params = {}) {

	const {
		fromName,
		fromEmail,
		userName,
		password,
		smtpSetting,
		imapSetting,
	} = params;

	await validateEmailSetting({
		fromName,
		fromEmail,
		userName,
	});

	await validateSMTPSetting({
		smtpSetting,
	});

	await validateIMAPSetting({
		imapSetting,
	});

	const encryptedPassword = utils.encryptPassword(password);

	const transaction = await sequelize.transaction();

	try {
		const requiredEmailAccount = await emailAccountModel.saveEmailAccount({
			fromName,
			fromEmail,
			userName,
			password: encryptedPassword,
			smtpSetting,
			imapSetting,
		}, {transaction});

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		logger.error(error);
		throw new Error(error.message);
	}
}

module.exports = {
	save,
};