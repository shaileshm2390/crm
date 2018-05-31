'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');
const JSON = require('circular-json');

const request = require('request');
var ipAddress;
request('http://freegeoip.net/json/', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    ipAddress = body.ip;
    //console.log("ip from url  -->> " + ipAddress);
});

/**
 * Find department by id
 * Note: This is called every time that the parameter :departmentId is used in a URL.
 * Its purpose is to preload the department on the req object then call the next function.
 */
exports.purchaseorderimage = function (req, res, next, id) {
    db.PurchaseOrderImage.find({ where: { id: id } }).then(function (purchaseorderimage) {
        if (!purchaseorderimage) {
            req.purchaseorderimage = {};
            return next();
        } else {
            req.purchaseorderimage = purchaseorderimage;
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
    console.log("in node's create!!!!");
    var sampleFile = req.files;
    sampleFile.file.name = Math.floor(Date.now() / 1000) + "-" + sampleFile.file.name;
    sampleFile.file.mv(__dirname + '/../../public/temp/' + sampleFile.file.name, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            var response = { pathFromRoot: "/temp/" + sampleFile.file.name, success: true };

            var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

            db.Watchdog.create({
                message: "New Purchase-Order-Image is created.",
                ipAddress: ipAddress,
                pageUrl: fullUrl,
                userId: req.user.id,
                previousData: "",
                updatedData: JSON.stringify(response)
            });

            return res.jsonp(response);
        }
    });
}

/**
 * Update a department
 */
exports.update = function (req, res) {

    // create a new variable to hold the department that was placed on the req object.
    var purchaseorderimage = req.purchaseorderimage;

    purchaseorderimage.updateAttributes({
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

    console.log("in node's destroy!!!!");
    var purchaseorderimage = req.purchaseorderimage;
    console.log(JSON.stringify(req.purchaseorderimage));
    var imagePath = (__dirname + purchaseorderimage.imagePath).replace(/\//g, "\\").replace("app\\controllers", "public");
    var fs = require('fs');
    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, function (err) { });
    }
    purchaseorderimage.destroy().then(function () {
        return res.jsonp(purchaseorderimage);
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
    return res.jsonp(req.purchaseorderimage);
};

/**
 * List of department
 */
exports.all = function (req, res) {
    db.PurchaseOrderImage.findAll().then(function (purchaseorderimages) {
        return res.jsonp(purchaseorderimages);
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
    if (req.user.PurchaseorderimageId != 1) {
        return res.send(401, 'purchase order image is not authorized ');
    }
    next();
};
