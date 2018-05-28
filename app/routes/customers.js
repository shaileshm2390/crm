'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    //departments = require('../../app/controllers/departments');
    customers = require('../../app/controllers/customers');

module.exports = function (app) {
    // Department Routes
    app.route('/customers')
        .get(customers.all)   //users.requiresLogin, 
        .post(customers.create);  //users.requiresLogin, 
    app.route('/customers/:customerId')
        .get(customers.show)  //users.requiresLogin, 
        .put(customers.update)    //users.requiresLogin, customers.hasAuthorization, 
        .delete(customers.destroy);   //users.requiresLogin, customers.hasAuthorization, 

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('customerId', customers.customer);
};

