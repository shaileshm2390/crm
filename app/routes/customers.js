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
        .get(users.requiresLogin, customers.all)   //users.requiresLogin, 
        .post(users.requiresLogin, customers.create);  //users.requiresLogin, 
    app.route('/customers/:customerId')
        .get(users.requiresLogin, customers.show)  //users.requiresLogin, 
        .put(users.requiresLogin, customers.update)    //users.requiresLogin, customers.hasAuthorization, 
        .delete(users.requiresLogin, customers.destroy);   //users.requiresLogin, customers.hasAuthorization, 

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('customerId', customers.customer);
};

