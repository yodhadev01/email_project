const { Router } = require('express');
// eslint-disable-next-line new-cap
const router = Router();
const {
	sendEmail,
	emailTracker,
} = require('../api-handler/email-action');

router.post('/sendemail', sendEmail);
router.get('/tracker', emailTracker);

module.exports = router;
