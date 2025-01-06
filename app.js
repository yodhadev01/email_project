require('./services/postgres');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config/config');
const routes = require('./routes/index');
const logger = require('./logger/logger')(__filename);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(config.PORT, function (err, res) {
	if (err) {
		logger.error(err);
	} else {
		logger.info(`server started at PORT ${config.PORT}`);
		console.log(`server started at PORT ${config.PORT}`);
		routes(app);
	}
});
