'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    watchdogs = require('../../app/controllers/watchdogs');



module.exports = function (app) {
    // watchdogs Routes
    app.route('/watchdogs')     
        .post(users.requiresLogin, watchdogs.create); 
	app.route('/watchdogs/parts/:partid')     
        .get(users.requiresLogin, watchdogs.getPartTimeline);
		app.param('partid', watchdogs.partTimeline);
};

