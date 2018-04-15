function createResponse(res, status, message) {
	res.status(status).send(message);
}
function sendDatabaseError(res, err) {
	createResponse(res, 500, {
		"error": "error connecting to database",
		"reason": err
	});
}
function sendInvalidParameter(res, message) {
	createResponse(res, 422, {
		"error": "invalid parameter",
		"reason": message
	});
}



module.exports.sendDatabaseError = sendDatabaseError;
module.exports.sendInvalidParameter = sendInvalidParameter;