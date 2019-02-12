'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    dashboards = require('../../app/controllers/dashboards');



module.exports = function (app) {
    app.route('/dashboards/getSiteSummary')
        .post(users.requiresLogin, dashboards.all);  
    app.route('/dashboards/getRfqChartDetail')
        .post(users.requiresLogin, dashboards.getRfqChartDetail);
    app.route('/dashboards/getRfqPieChartDetail')
        .post(users.requiresLogin, dashboards.getRfqPieChartDetail);    
    app.route('/dashboards/getOpenRfq')
        .get(users.requiresLogin, dashboards.getOpenRfq);
    app.route('/dashboards/getMyRfq')
        .get(users.requiresLogin, dashboards.getMyRfq);
};

