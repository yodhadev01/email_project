const crypto = require('crypto');
const nodemailer = require('nodemailer');
const config = require('../config/config');

function validateName(name) {

	const nameRegex = /^[a-zA-Z\s'-]+$/;

	if (nameRegex.test(name)) {
		return true;
	} else {
		return false;
	}
}

function validateUsername(username) {
	const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
	if (usernameRegex.test(username)) {
		return { valid: true, message: 'Username is valid.' };
	} else {
		return { valid: false, message: 'Invalid username. It must be 3-20 characters long and can contain letters, numbers, underscores, dots, or hyphens.' };
	}
}

function validateEmail(email) {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (emailRegex.test(email)) {
		return { valid: true, message: 'Email is valid.' };
	} else {
		return { valid: false, message: 'Invalid email address. Please provide a valid email format (e.g., example@example.com).' };
	}
}

function validateHost(host) {
	// Regular expressions for validation
	const domainRegex = /^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(\.[a-zA-Z0-9-]{1,63})*\.[a-zA-Z]{2,}$/; // Valid domain with subdomains
	const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])){3}$/; // IPv4
	// eslint-disable-next-line max-len
	const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}(([0-9]{1,3}\.){3}[0-9]{1,3})|([0-9a-fA-F]{1,4}:){1,4}:(([0-9]{1,3}\.){3}[0-9]{1,3}))$/; // IPv6

	if (domainRegex.test(host)) {
		return true;
	} else if (ipv4Regex.test(host)) {
		return true;
	} else if (ipv6Regex.test(host)) {
		return true;
	} else {
		return false;
	}
}

// Function to encrypt a password
function encryptPassword(password) {

	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(config.ALGORITHM, Buffer.from(config.PASSWORD_SECRET_KEY, 'hex'), iv);
	let encrypted = cipher.update(password, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return {
		encryptedData: encrypted,
		iv: iv.toString('hex') // Store the IV along with the encrypted data
	};
}

// Function to decrypt a password
function decryptPassword(params = {}) {

	const {
		encryptedData,
		ivHex
	} = params;
	
	const decipher = crypto.createDecipheriv(config.ALGORITHM, Buffer.from(config.PASSWORD_SECRET_KEY, 'hex'), Buffer.from(ivHex, 'hex'));
	let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
}

async function sendEmail(params = {}) {

	const {
		smtpHost,
		smtpPort,
		smtpUser,
		fromEmail,
		fromName,
		password,
		toEmail,
		subject,
		body,
		ccList = [],
		bccList = []
	} = params;

	try {

		const transporter = nodemailer.createTransport({
			host: smtpHost,
			port: smtpPort,
			secure: smtpPort === 465, // true for 465 (SSL), false for other ports (STARTTLS)
			auth: {
				user: smtpUser,
				pass: password
			}
		});

		// Define email options
		const mailOptions = {
			from: `${fromName} <${fromEmail}>`, // Custom "From" name and email
			to: toEmail, // Recipient(s)
			subject: subject, // Email subject
			text: body, // Plain text body
			cc: ccList, // CC recipients
			bcc: bccList // BCC recipients
		};

		// Send the email
		const info = await transporter.sendMail(mailOptions);

		console.log('Email sent successfully:', info.messageId);
		return {
			success: true,
			id: info.messageId,
		};

	} catch (error) {
		return {
			success: false,
			message: error.message,
		};
	}
}

module.exports = {
	validateName,
	validateEmail,
	validateUsername,
	validateHost,
	encryptPassword,
	decryptPassword,
	sendEmail,
};