'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    rfqs = require('../../app/controllers/rfqs');



module.exports = function (app) {
    // Department Routes
    app.route('/rfqs')
        .get(rfqs.all);
    app.route('/rfqs/:rfqId')
        .get(rfqs.rfqs);
    app.route('/buyersrfqs/:buyerId')
        .get(rfqs.rfqs);
    app.route('/userrfqs/:userId')
        .get(rfqs.rfqs); 
    //    .post(users.requiresLogin, departments.hasAuthorization, departments.create);  //users.requiresLogin, 
    //app.route('/rfqs/:departmentId')
    //    .get(users.requiresLogin, departments.show)  //users.requiresLogin, 
    //    .put(users.requiresLogin, departments.update)    //users.requiresLogin, departments.hasAuthorization, 
    //    .delete(users.requiresLogin, departments.destroy);   //users.requiresLogin, departments.hasAuthorization, 

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('userId', rfqs.rfqByUser);
    app.param('rfqId', rfqs.rfq);
    app.param('buyerId', rfqs.rfqByBuyer);
};

