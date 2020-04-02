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
exports.samplesubmission = function (req, res, next, id) {
    db.Samplesubmission.find({ where: { id: id } }).then(function (samplesubmission) {
        if (!samplesubmission) {
            req.samplesubmission = {};
            return next();
        } else {
            req.samplesubmission = samplesubmission;
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
    var samplesubmissionList = new Array();
    db.Samplesubmission.destroy({ where: { operation: req.body.data[0].operation, RfqId: req.body.data[0].RfqId, stage: req.body.data[0].stage, RfqPartId: req.body.data[0].RfqPartId } });
    if (req.body.data.length > 0) {
        var totalData = req.body.data.length,
            sampleSubmissionRequest; 
        for (var index = 0; index < totalData; index++) {

            sampleSubmissionRequest = {
                operation: req.body.data[index].operation,
                stage: req.body.data[index].stage,
                stageProcess: req.body.data[index].stageProcess,
                orderTo: req.body.data[index].orderTo,
                orderDate: req.body.data[index].orderDate,
                receivedDate: req.body.data[index].receivedDate,
                cost: req.body.data[index].cost,
                description : req.body.data[index].description,
                RfqId: req.body.data[index].RfqId,
                RfqPartId: req.body.data[index].RfqPartId,
                expectedDate: req.body.data[index].expectedDate
            };
            
            db.Samplesubmission.create(sampleSubmissionRequest).then(function (samplesubmission) {
                if (!samplesubmission) {
                    return res.send('/signin', { errors: new StandardError('sample submission could not be created') });
                } else {
                    var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;
                    db.Watchdog.create({
                        message: "New Sample Submission is created",
                        ipAddress: ipAddress,
                        pageUrl: fullUrl,
                        userId: req.user.id,
                        previousData: "",
                        updatedData: JSON.stringify(samplesubmission)
                    });
                    samplesubmissionList.push(samplesubmission);
                }
            }).catch(function (err) {       
                console.log(err);
            });
        }
    }
    return res.jsonp(samplesubmissionList);
};

/**
 * Update a department
 */
exports.update = function (req, res) {

    // create a new variable to hold the department that was placed on the req object.
    var samplesubmission = req.samplesubmissions;

    var previousData;
    db.Samplesubmission.find({
        where: { RfqId: samplesubmission.RfqId },
        include: [
            { model: db.Rfq },
            { model: db.Samplesubmissionimage, }
        ]
    }).then(function (samplesubmission) {
        if (!samplesubmission) {
            req.samplesubmissions = {};
            return next();
        } else {
            req.samplesubmissions = samplesubmission;
            previousData = { "id": req.samplesubmissions.id, "startDate": req.samplesubmissions.startDate, "targetDate": req.samplesubmissions.targetDate, "process": req.samplesubmissions.process, "status": req.samplesubmissions.status, "RfqId": req.samplesubmissions.RfqId, "updatedAt": req.samplesubmissions.updatedAt, "createdAt": req.samplesubmissions.createdAt };
           // return next();
        }
    

    samplesubmission.updateAttributes({
        status: req.body.process
    }).then(function (a) {
        if (req.body.imagesString.trim() !== "") {
            var imageArray = req.body.imagesString.split(",");
            for (var index = 0; index < imageArray.length; index++) {
                var oldPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\temp");
                var newPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\uploads");

                module.exports.move(oldPath, newPath, function () { });
                var request = {
                    imagePath: imageArray[index].replace("/temp/", "/uploads/"),
                    SamplesubmissionId: samplesubmission.id
                };
                db.Samplesubmissionimage.create(request);

               }
        }
       

        var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;
        var updatedData = { "id": samplesubmission.id, "startDate": req.samplesubmissions.startDate, "targetDate": req.samplesubmissions.targetDate, "process": req.samplesubmissions.process, "status": samplesubmission.status, "RfqId": samplesubmission.RfqId, "updatedAt": samplesubmission.updatedAt, "createdAt": samplesubmission.createdAt };

        db.Watchdog.create({
            message: "Sample Submission is updated",
            ipAddress: ipAddress,
            pageUrl: fullUrl,
            userId: req.user.id,
            previousData: JSON.stringify(previousData),
            updatedData: JSON.stringify(updatedData)
        });
           return res.jsonp(a);
    }).catch(function (err) {
        return (err);
    });
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
    var samplesubmission = req.samplesubmission;
    db.User.destroy({ where: { SamplesubmissionId: req.samplesubmission.id } }).then(function () {
        samplesubmission.destroy().then(function () {
            return res.jsonp(samplesubmission);
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
    return res.jsonp(req.samplesubmission);
};

/**
 * List of department
 */
exports.all = function (req, res) {
    //db.Samplesubmission.findAll().then(function (samplesubmissions) {
    //    return res.jsonp(samplesubmissions);
    //}).catch(function (err) {
    //    return res.render('error', {
    //        error: err,
    //        status: 500
    //    });
    //});

    db.Samplesubmission.findAll({
        include: [
            { model: db.Samplesubmissionimage }
        ]
    }).then(function (samplesubmissions) {
        return res.jsonp(samplesubmissions);
    }).catch(function (err) {
        //return res.render('error', {
        //    error: err,
        //    status: 500
        //});
        console.log(err);
    });
};

/**
 *Department authorizations routing middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.user.SamplesubmissionId != 1) {
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

exports.samplesubmissionsByRfqId = function (req, res) {
    return res.jsonp(req.samplesubmissions);
};

exports.samplesubmissionByRfqId = function (req, res, next, id) {
    db.Samplesubmission.findAll({
        where: { RfqId: id, RfqPartId: req.query.partId},
        include: [

            {
                model: db.Rfq,
            
            }
            
        ]
    }).then(function (samplesubmission) {
        if (!samplesubmission) {
            //return next(new Error('Failed to load samplesubmissions ' + id));
            req.samplesubmissions = {};
            return next();
        } else {
            req.samplesubmissions = samplesubmission;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};
