const { Router } = require('express');
// eslint-disable-next-line new-cap
const router = Router();
const {
	status
} = require('../api-handler/status');

router.get('/status', status);

module.exports = router;
