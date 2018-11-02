'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    rfqs = require('../../app/controllers/rfqs');



module.exports = function (app) {
    app.route('/rfqs')
        .get(users.requiresLogin, rfqs.all);
    app.route('/rfqs/:rfqId')
        .get(users.requiresLogin, rfqs.rfqs)
        .put(users.requiresLogin, rfqs.update);
    app.route('/buyersrfqs/:buyerId')
        .get(users.requiresLogin, rfqs.rfqs);
    app.route('/userrfqs/:userId')
        .get(users.requiresLogin, rfqs.rfqs);
    app.route('/rfqs/sendfeasiblemail')
        .post(users.requiresLogin, rfqs.sendInfeasibleMailToCustomer);
    app.route('/rfqs/report')
        .post(users.requiresLogin, rfqs.getReports);
    
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

