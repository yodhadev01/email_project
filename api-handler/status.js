async function status(req, res) {
	
	return res.status(200).json({
		status: 'OK',
	});
};

module.exports = {
	status,
};