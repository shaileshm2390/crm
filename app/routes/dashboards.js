'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    dashboards = require('../../app/controllers/dashboards');



module.exports = function (app) {
    app.route('/dashboards/getSiteSummary')
        .get(users.requiresLogin, dashboards.all);    
    app.route('/dashboards/getRfqChartDetail')
        .get(users.requiresLogin, dashboards.getRfqChartDetail);
    app.route('/dashboards/getRfqPieChartDetail')
        .get(users.requiresLogin, dashboards.getRfqPieChartDetail);   
    app.route('/dashboards/getCustomerBenefitPieChartDetail')
        .get(users.requiresLogin, dashboards.getCustomerBenefitPieChartDetail);
    app.route('/dashboards/getOpenRfq')
        .get(users.requiresLogin, dashboards.getOpenRfq);
    app.route('/dashboards/getMyRfq')
        .get(users.requiresLogin, dashboards.getMyRfq);
};

