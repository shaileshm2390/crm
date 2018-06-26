'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    //departments = require('../../app/controllers/departments');
    customerimages = require('../../app/controllers/customerimages');

module.exports = function (app) {
    app.route('/customerimages')
        .get(users.requiresLogin, customerimages.all)
        .post(users.requiresLogin, customerimages.create);  //users.requiresLogin, 
    app.route('/customerimages/:customerId')
        .get(users.requiresLogin, customerimages.customerImagesByCustomerId);
    app.route('/customerimages/:id')
        .delete(users.requiresLogin, customerimages.destroy);

    app.param('customerId', customerimages.imagesByCustomerId);
    app.param('id', customerimages.customerimage);
};

