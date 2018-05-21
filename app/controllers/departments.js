'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');

/**
 * Find department by id
 * Note: This is called every time that the parameter :departmentId is used in a URL.
 * Its purpose is to preload the department on the req object then call the next function.
 */
exports.department = function (req, res, next, id) {
    console.log('id => ' + id); 
    db.Department.find({ where: { id: id } }).then(function (department) {
        if (!department) {
            return next(new Error('Failed to load department ' + id));
        } else {
            req.department = department;          
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

/**
 * Create a department
 */
exports.create = function (req, res) {
    // augment the department by adding the UserId
    // save and return and instance of department on the res object.
    db.Department.create(req.body).then(function (department) {
        if (!department) {
            return res.send('users/signup', { errors: new StandardError('Department could not be created') });
        } else {
            return res.jsonp(department);
        }
    }).catch(function (err) {
        return res.send('users/signup', {
            errors: err,
            status: 500
        });
    });
};

/**
 * Update a department
 */
exports.update = function (req, res) {

    // create a new variable to hold the department that was placed on the req object.
    var department = req.department;

    department.updateAttributes({
        name: req.body.name,
        status: req.body.status
    }).then(function (a) {
        return res.jsonp(a);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Delete an department
 */
exports.destroy = function (req, res) {

    // create a new variable to hold the department that was placed on the req object.
    console.log(req.department.id)
    var department = req.department;
    db.User.destroy({ where: { DepartmentId: req.department.id } }).then(function () {
        department.destroy().then(function () {
            return res.jsonp(department);
        }).catch(function (err) {
            return res.render('error', {
                error: err,
                status: 500
            });
        });
    });
};

/**
 * Show an department
 */
exports.show = function (req, res) {
    // Sending down the department that was just preloaded by the departments.department function
    // and saves department on the req object.
    return res.jsonp(req.department);
};

/**
 * List of department
 */
exports.all = function (req, res) {
    db.Department.findAll().then(function (departments) {
        return res.jsonp(departments);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 *Department authorizations routing middleware
 */
exports.hasAuthorization = function (req, res, next) {    
    if (req.user.DepartmentId != 1) {
        return res.send(401, 'User is not authorized ');
    }
    next();
};
