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
    if (err) { return console.log(err); }
    ipAddress = body.ip;
});
/**
 * Find department by id
 * Note: This is called every time that the parameter :departmentId is used in a URL.
 * Its purpose is to preload the department on the req object then call the next function.
 */
exports.sampleInspectionReport = function (req, res, next, id) {
    db.SampleInspectionReport.find({ where: { id: id } }).then(function (sampleInspectionReport) {
        if (!sampleInspectionReport) {
            req.sampleInspectionReport = {};
            return next();
        } else {
            req.sampleInspectionReport = sampleInspectionReport;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};


exports.sampleInspectionReportImage = function (req, res, next, id) {
    db.SampleInspectionReportImage.find({ where: { id: id } }).then(function (SampleInspectionReportImage) {
        if (!SampleInspectionReportImage) {
            req.SampleInspectionReportImage = {};
            return next();
        } else {
            req.SampleInspectionReportImage = SampleInspectionReportImage;
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

    db.SampleInspectionReport.create(req.body).then(function (SampleInspectionReport) {
        if (!SampleInspectionReport) {
            return res.send('/signin', { errors: new StandardError('purchaseorder could not be created') });
        } else {
            if (req.body.imagesString.trim() !== "") {
                var imageArray = req.body.imagesString.split(",");
                for (var index = 0; index < imageArray.length; index++) {
                    //var oldPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\temp");
                   // var newPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\uploads");

                   // module.exports.move(oldPath, newPath, function () { });
                    var request = {
                       // imagePath: imageArray[index].replace("/temp/", "/uploads/"),
					    imagePath: imageArray[index],
                        SampleInspectionReportId: SampleInspectionReport.id
                    };
                    db.SampleInspectionReportImage.create(request);
                }
            }
            var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

            db.Watchdog.create({
                message: "New SIR is created",
                ipAddress: ipAddress,
                pageUrl: fullUrl,
                userId: req.user.id,
                previousData: "",
                updatedData: JSON.stringify(SampleInspectionReport)
            });

            return res.jsonp(SampleInspectionReport);
        }
    }).catch(function (err) {
        console.log(err);
    });
};

/**
 * Show an department
 */
exports.show = function (req, res) {
    // Sending down the department that was just preloaded by the departments.department function
    // and saves department on the req object.
    return res.jsonp(req.sampleInspectionReport);
};

/**
 * List of department
 */
exports.all = function (req, res) {

    db.SampleInspectionReport.findAll({
        include: [
            { model: db.SampleInspectionReportImage }
        ]
    }).then(function (sampleInspectionReport) {
        return res.jsonp(sampleInspectionReport);
    }).catch(function (err) {
        console.log(err);
    });
};

exports.destroyImage = function (req, res) {

    var SampleInspectionReportImage = req.SampleInspectionReportImage;
    var imagePath = (__dirname + SampleInspectionReportImage.imagePath).replace(/\//g, "\\").replace("app\\controllers", "public");
    var fs = require('fs');
    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, function (err) { });
    }
    SampleInspectionReportImage.destroy().then(function () {
        return res.jsonp(SampleInspectionReportImage);
    }).catch(function (err) {
        console.log(err);
    });
};

/**
 *Department authorizations routing middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.user.PurchaseorderId != 1) {
        return res.send(401, 'User is not authorized ');
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

exports.sampleInspectionReportsByRfqId = function (req, res) {
    return res.jsonp(req.sampleInspectionReports);
};

exports.sampleInspectionReportByRfqId = function (req, res, next, id) {
    db.SampleInspectionReport.findAll({
        where: { RfqId: id },
        include: [

            {
                model: db.Rfq,

            },
            {
                model: db.SampleInspectionReportImage,
            }
        ]
    }).then(function (sampleInspectionReports) {
        if (!sampleInspectionReports) {
            //return next(new Error('Failed to load samplesubmissions ' + id));
            req.sampleInspectionReports = {};
            return next();
        } else {
            req.sampleInspectionReports = sampleInspectionReports;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};
