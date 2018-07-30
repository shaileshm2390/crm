'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    sampleInspectionReports = require('../../app/controllers/sampleInspectionReports');



module.exports = function (app) {
    app.route('/sampleInspectionReports')
        .get(users.requiresLogin, sampleInspectionReports.all)   //users.requiresLogin, 
        .post(users.requiresLogin, sampleInspectionReports.create);  //users.requiresLogin, purchaseorders.hasAuthorization, 

    app.route('/rfq/sampleInspectionReports/:rfqId')
        .get(users.requiresLogin, sampleInspectionReports.sampleInspectionReportsByRfqId);

    app.route('/sampleInspectionReports/image/:imageId')
    .delete(users.requiresLogin, sampleInspectionReports.destroyImage)
    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('rfqId', sampleInspectionReports.sampleInspectionReportByRfqId);
    app.param('imageId', sampleInspectionReports.sampleInspectionReportImage);
};

