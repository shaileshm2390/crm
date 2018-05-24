'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    //departments = require('../../app/controllers/departments');
    customerimages = require('../../app/controllers/customerimages');

module.exports = function (app) {
    // Department Routes
    app.route('/customerimages')
        .post(customerimages.create);  //users.requiresLogin, 
    
};

