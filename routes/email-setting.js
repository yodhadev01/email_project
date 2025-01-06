const { Router } = require('express');
// eslint-disable-next-line new-cap
const router = Router();
const {
	saveEmailSettings
} = require('../api-handler/email-setting');

router.post('/emailsettings', saveEmailSettings);

module.exports = router;
