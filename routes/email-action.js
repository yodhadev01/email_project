const { Router } = require('express');
// eslint-disable-next-line new-cap
const router = Router();
const {
	sendEmail
} = require('../api-handler/email-action');

router.post('/sendemail', sendEmail);

module.exports = router;
