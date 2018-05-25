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
