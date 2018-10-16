'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    handoversubmitteds = require('../../app/controllers/handoversubmitteds');

module.exports = function (app) {   
    app.route('/handoversubmitted')
        .post(users.requiresLogin, handoversubmitteds.save);
};

