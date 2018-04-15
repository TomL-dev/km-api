var express = require('express');
var router = express.Router();

let db = require('../model/db');
let response = require('../functions/responses');
let mysql = require('mysql');

/*
trip type:
BUSINESS : 0
PRIVATE  : 1
*/

/* get km */
router.get('/', function(req, res, next) {
	db.getConnection((err, con) => {
		if (err) {
			response.sendDatabaseError(res, err);
		} else {
			con.query('SELECT * FROM km.km', (err, results, fields) => {
				con.release();
				if (err) {
					console.log(err);
					response.sendDatabaseError(res, err);
				} else {
					console.log(results);
					res.status(200).send({ "results": results });
				}
			});
		}
	});
});
router.get('/:start/:end', (req, res, next) => {
	const start = mysql.escape(req.params.start);
	const end = mysql.escape(req.params.end);
	if (end <= start) {
		response.sendInvalidParameter(res, "end date should be greater than start value");
	}
	if (end < 0 || start < 0) {
		response.sendInvalidParameter(res, "start or end date should be greater than 0");
	}
	db.getConnection((err, con) => {
		if (err) {
			response.sendDatabaseError(res, err);
		} else {
			const sql = "SELECT * FROM km.km WHERE km.date >= " + start + " AND km.date < " + end + " ORDER BY km.mileage ASC";
			con.query(sql, (err, results, fields) => {
				con.release();
				if (err) {
					response.sendDatabaseError(res, err);
				} else {
					res.status(200).send({ results });
				}
				
			});
		}
	});
})

router.post('/', (req, res, next) => {
	const body = req.body;
	const params = {
		"date": body.date,
		"location": body.location,
		"mileage": body.mileage,
		"reason": body.reason,
		"triptype": body.triptype,
		"fkcar": body.car
	};

	db.getConnection((err, con) => {
		if (err) {
			response.sendDatabaseError(res, err);
		} else {
			con.query('INSERT INTO km.km SET ?', params, (error, results) => {
				con.release();
				if (error) {
					response.sendDatabaseError(res, error);
				} else {
					res.status(200).send({
						"message": "added your kilometer registration",
						"results": results,
						"body": body
					})
				}
			});
		}
	});
})

module.exports = router;
