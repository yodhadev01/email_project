const emailSetting = require('./email-setting');
const emailAction = require('./email-action');
const status = require('./status');

const API_PREFIX = '/api/v1';

module.exports = (app) => {
	app.use(API_PREFIX, status);
	app.use(API_PREFIX, emailSetting);
	app.use(API_PREFIX, emailAction);
};
