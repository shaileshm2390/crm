'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    departments = require('../../app/controllers/departments');



module.exports = function (app) {
    // Department Routes
    app.route('/departments')
        .get(users.requiresLogin, departments.all)
        .post(users.requiresLogin, departments.create);
    app.route('/departments/:departmentId')
        .get(users.requiresLogin, departments.show)
        .put(users.requiresLogin, departments.hasAuthorization, departments.update)
        .delete(users.requiresLogin, departments.hasAuthorization, departments.destroy);

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('departmentId', departments.department);
};

