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

request('http://api.ipstack.com/check?access_key=a0a80aaea559ceb4d5ebacc03c30f6d3', { json: true }, (err, res, body) => {
    if (err) { console.log(err); }
    ipAddress = body.ip;
});
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
        console.log(err);
        return next();
    });
};



exports.getByRfqId = function (req, res, next, id) {
    db.Samplesubmissionimage.findAll({ where: { RfqId: id } }).then(function (samplesubmissionimages) {
        if (!samplesubmissionimages) {
            return next(new Error('Failed to load sample images ' + id));
        } else {           
            req.samplesubmissionimage = samplesubmissionimages;
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

    var sampleFile = req.files;
    sampleFile.file.name = Math.floor(Date.now() / 1000) + "-" + sampleFile.file.name;
    //sampleFile.file.mv(__dirname + '/../../public/temp/' + sampleFile.file.name, function (err) {
    sampleFile.file.mv('/temp/' + sampleFile.file.name, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            var response = { pathFromRoot: "/temp/" + sampleFile.file.name, success: true };

            return res.jsonp(response);
        }
    });
}

exports.insert = function (req, res) {
    // augment the department by adding the UserId
    // save and return and instance of department on the res object.  

    if (req.body.imagesString.trim() !== "") {
        var imageArray = req.body.imagesString.split(",");
        for (var index = 0; index < imageArray.length; index++) {
            var oldPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\temp");
            var newPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\uploads");

            module.exports.move(oldPath, newPath, function () { });
            var request = {
                imagePath: imageArray[index].replace("/temp/", "/uploads/"),
                RfqId: req.body.RfqId,
                operation: req.body.operation
            };
            db.Samplesubmissionimage.create(request).then(function (samplesubmissionimages) {
                if (!samplesubmissionimages) {
                    return res.send('/signin', { errors: new StandardError('sample submission images could not be created') });
                } else {
                    var fullUrl = req.originalUrl;

                    db.Watchdog.create({
                        message: "New Sample Subnission Drawing is created",
                        ipAddress: ipAddress,
                        pageUrl: fullUrl,
                        userId: req.user.id,
                        previousData: "",
                        updatedData: JSON.stringify(samplesubmissionimages)
                    });
                    return res.jsonp(samplesubmissionimages);
                }
            }).catch(function (err) {
                console.log(err);
            });
        }
    }
};

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
    var samplesubmissionimage = req.samplesubmissionimage;
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

exports.move = function (oldPath, newPath, callback) {

    var fs = require('fs');
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                console.log(err);
                //callback(err);
            }
            return;
        }
        callback();
    });
}
exports.copy = function () {
    var readStream = fs.createReadStream(oldPath);
    var writeStream = fs.createWriteStream(newPath);

    readStream.on('error', callback);
    writeStream.on('error', callback);

    readStream.on('close', function () {
        fs.unlink(oldPath, callback);
    });

    readStream.pipe(writeStream);
};
