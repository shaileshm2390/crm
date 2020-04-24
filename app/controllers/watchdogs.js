'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');

/**
 * Create a department
 */
exports.create = function (req, res) {
    db.Watchdog.create(req.body).then(function (watchdog) {        
        return res.jsonp(watchdog);
    }).catch(function (err) {
        //return res.send('/signin', {
        //    errors: err,
        //    status: 500
        //});
        //return res.status(500).send('/signin')
        console.log(err);
       
    });
};

exports.getPartTimeline = function (req, res) {
    return res.jsonp(req.partsTimeline);
};

exports.partTimeline = function(req, res, next, id) {
	db.sequelize.query("SELECT w.*, u.email FROM Watchdogs w INNER JOIN Users u ON u.id = w.userId AND w.rfqPartId = "+id, { type: db.sequelize.QueryTypes.SELECT}).then(function (records) {
        if (!records) {
            req.partsTimeline = {};
            return next();
        } else {
            req.partsTimeline = records;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
}
