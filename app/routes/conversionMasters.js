'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    conversionMasters = require('../../app/controllers/conversionMasters');



module.exports = function (app) {
    app.route('/conversions')
        .get(users.requiresLogin, conversionMasters.all)   //users.requiresLogin, 
        .post(users.requiresLogin, conversionMasters.create);  //users.requiresLogin, 
    app.route('/conversions/:id')
        .get(users.requiresLogin, conversionMasters.show)  //users.requiresLogin, 
        .put(users.requiresLogin, conversionMasters.update)    //users.requiresLogin, departments.hasAuthorization, 
        .delete(users.requiresLogin, conversionMasters.destroy);   //users.requiresLogin, departments.hasAuthorization, 

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('id', conversionMasters.conversionMaster);
};

