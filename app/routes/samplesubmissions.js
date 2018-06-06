'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    samplesubmissions = require('../../app/controllers/samplesubmissions');



module.exports = function (app) {
    // Department Routes
    app.route('/samplesubmissions')
        .get(users.requiresLogin, samplesubmissions.all)   //users.requiresLogin, 
        .post(users.requiresLogin, samplesubmissions.create)  //users.requiresLogin, purchaseorders.hasAuthorization, 

    app.route('/rfq/samplesubmissions/:rfqId')
        .get(users.requiresLogin, samplesubmissions.samplesubmissionsByRfqId)
        .put(users.requiresLogin, samplesubmissions.update);

    app.route('/samplesubmissions/:samplesubmissionId')
        .get(users.requiresLogin, samplesubmissions.show)  //users.requiresLogin, 
        .put(users.requiresLogin, samplesubmissions.update)    //users.requiresLogin, departments.hasAuthorization, 
        .delete(users.requiresLogin, samplesubmissions.destroy);   //users.requiresLogin, departments.hasAuthorization, 

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('samplesubmissionId', samplesubmissions.samplesubmission);
    app.param('rfqId', samplesubmissions.samplesubmissionByRfqId);
};

