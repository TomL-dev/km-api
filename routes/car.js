var express = require('express');
var router = express.Router();

let db = require('../model/db');
let response = require('../functions/responses');

/* get car list */
router.get('/', function (req, res, next) {
	db.getConnection((err, con) => {
		if (err) {
			response.sendDatabaseError(res, err);
		} else {
			con.query('SELECT * FROM km.car', (err, results, fields) => {
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

router.post('/', (req, res, next) => {
	const body = req.body;
	
	let params = { 
		"brand": body.brand,
		"model": body.model,
		"licence": body.licence,
		"datestart": body.datestart,
		"startmilage": body.startmilage
	}
	console.log(body.dateend)
	if (body.dateend !== undefined) {
		params.dateend = body.dateend;
	} else {
		params.dateend = -1;
	}
	console.log(params)
	db.getConnection((err, con) => {
		if (err) {
			response.sendDatabaseError(res, err);
		} else {
			con.query('INSERT INTO car SET ?', params, (error, results, fields) => {
				con.release();
				if (error) {
					response.sendDatabaseError(res, error);
				} else {
					res.status(200).send({
						"results": results,
						"input": body,
						"message": "created a new car"
					});
				}
			});
		}
	});
});

router.put('/:id', (req, res, next) => {
	const carid = req.params.id;
	if (carid < 0) {
		response.sendInvalidParameter(res, "please provide an valid car id");
	}
	
	// update car here
})

module.exports = router;
