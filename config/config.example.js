var config = {
	PASSWORD_SECRET_KEY: '',
	ALGORITHM: '',
	SELF_URL: '',
	POSTGRES_BACKEND: {
		CONNECTION_LIMIT: 20,
		CONNECTION_TIMEOUT: 60 * 60 * 1000,
		ACQUIRE_TIMEOUT: 60 * 60 * 1000,
		TIMEOUT: 60 * 60 * 1000,
		USER: '',
		HOST: '',
		DATABASE: '',
		PASSWORD: '',
		PORT: 5432,
		SSL: {
			rejectUnauthorized: false
		}
	},
	PORT: 4000,
};

module.exports = config;
