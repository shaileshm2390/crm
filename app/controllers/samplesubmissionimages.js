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
exports.samplesubmissionimage = function (req, res, next, id) {
    db.Samplesubmissionimage.find({ where: { id: id } }).then(function (samplesubmissionimage) {
        if (!samplesubmissionimage) {
            req.samplesubmissionimage = {};
            return next();
        } else {
            req.samplesubmissionimage = samplesubmissionimage;
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
    //db.Samplesubmissionimage.create(req.body).then(function (samplesubmissionimage) {
    //    var sampleFile = req.files;
    //    var imagePath = { imagePath: "/public/temp/" + sampleFile.file.name };
    //    sampleFile.file.mv(__dirname + '/../../public/temp/' + sampleFile.file.name, function (err) {
    //        if (err) {
    //            console.log(err);
    //            res.status(500).send(err);
    //        } else {
    //            res.send('File uploaded!');
    //            db.Samplesubmissionimage.create(imagePath);
    //        }
    //    });
    //});

    var sampleFile = req.files;
    sampleFile.file.name = Math.floor(Date.now() / 1000) + "-" + sampleFile.file.name;
    sampleFile.file.mv(__dirname + '/../../public/temp/' + sampleFile.file.name, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            var response = { pathFromRoot: "/temp/" + sampleFile.file.name, success: true };
            return res.jsonp(response);
        }
    });
}

/**
 * Update a department
 */
exports.update = function (req, res) {

    // create a new variable to hold the department that was placed on the req object.
    var samplesubmissionimage = req.samplesubmissionimage;

    samplesubmissionimage.updateAttributes({
        imagePath: req.body.imagePath
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
    console.log("in destroy!!!!");
    var samplesubmissionimage = req.samplesubmissionimage;
    console.log(JSON.stringify(req.samplesubmissionimage));
    var imagePath = (__dirname + samplesubmissionimage.imagePath).replace(/\//g, "\\").replace("app\\controllers", "public");
    var fs = require('fs');
    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, function (err) { });
    }
    samplesubmissionimage.destroy().then(function () {
        return res.jsonp(samplesubmissionimage);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Show an department
 */
exports.show = function (req, res) {
    // Sending down the department that was just preloaded by the departments.department function
    // and saves department on the req object.
    return res.jsonp(req.samplesubmissionimage);
};

/**
 * List of department
 */
exports.all = function (req, res) {
    db.Samplesubmissionimage.findAll().then(function (samplesubmissionimages) {
        return res.jsonp(samplesubmissionimages);
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
    if (req.user.SamplesubmissionimageId != 1) {
        return res.send(401, 'sample submission image is not authorized ');
    }
    next();
};
