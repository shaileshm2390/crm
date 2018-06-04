'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    dashboards = require('../../app/controllers/dashboards');



module.exports = function (app) {
    // Department Routes
    app.route('/dashboards/getSiteSummary')
        .get(users.requiresLogin, dashboards.all)    
    app.route('/dashboards/getRfqChartDetail')
        .get(dashboards.getRfqChartDetail)
};

