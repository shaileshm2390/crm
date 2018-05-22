'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    departments = require('../../app/controllers/departments');



module.exports = function (app) {
    // Department Routes
    app.route('/departments')
        .get(users.requiresLogin,departments.all)   //users.requiresLogin, 
        .post(users.requiresLogin, departments.hasAuthorization, departments.create);  //users.requiresLogin, 
    app.route('/departments/:departmentId')
        .get(users.requiresLogin, departments.show)  //users.requiresLogin, 
        .put(users.requiresLogin, departments.update)    //users.requiresLogin, departments.hasAuthorization, 
        .delete(users.requiresLogin, departments.destroy);   //users.requiresLogin, departments.hasAuthorization, 

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('departmentId', departments.department);
};

