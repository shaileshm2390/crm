'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    samplesubmissions = require('../../app/controllers/samplesubmissions');



module.exports = function (app) {
    // Department Routes
    app.route('/samplesubmissions')
        .get(samplesubmissions.all)   //users.requiresLogin, 
        .post(samplesubmissions.create);  //users.requiresLogin, purchaseorders.hasAuthorization, 
    app.route('/samplesubmissions/:samplesubmissionId')
        .get(samplesubmissions.show)  //users.requiresLogin, 
        .put(samplesubmissions.update)    //users.requiresLogin, departments.hasAuthorization, 
        .delete(samplesubmissions.destroy);   //users.requiresLogin, departments.hasAuthorization, 

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('samplesubmissionId', samplesubmissions.samplesubmission);
};

