"use strict";

/**
 * Module dependencies.
 */
var express     = require('express');
var fs          = require('fs');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load Configurations
var config          = require('./config/config');
var winston         = require('./config/winston');

winston.info('Starting '+config.app.name+'...');
winston.info('Config loaded: '+config.NODE_ENV);
winston.debug('Accepted Config:',config);

var db              = require('./config/sequelize');
var passport = require('./config/passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();

require('express-dynamic-helpers-patch')(app);

app.use(cookieParser('asdf33g4w4hghjkuil8saef345')); // cookie parser must use the same secret as express-session.

const cookieExpirationDate = new Date();
const cookieExpirationDays = 365;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

app.dynamicHelpers({
    user: function (req, res) {
        var roles, firstName, id, email; 
            if (req.user) {
                roles = ['member'];
                firstName = (req.user) ? req.user.firstName : '';
                id = (req.user) ? req.user.id : 0;
                email = (req.user) ? req.user.email : "";
            }
            else {
                roles = ['guest'];
                firstName = 'Guest';
                id = null;
            }

            return {
                firstName: firstName,
                id: id,
                roles: roles,
                email: email,
                isGuest: roles.indexOf('guest') !== -1,
                isAdmin: roles.indexOf('admin') !== -1
            }
        }
    });


app.use(session({
    secret: 'asdf33g4w4hghjkuil8saef345', // must match with the secret for cookie-parser
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: cookieExpirationDate // use expires instead of maxAge
    }
}));

//Initialize Express
require('./config/express')(app, passport);

//Start the app by listening on <port>
app.listen(config.PORT);
winston.info('Express app started on port ' + config.PORT);

//expose app
module.exports = app;
