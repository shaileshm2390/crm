'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');
var sm = require("./sendmail");
var pdf = require('html-pdf');
var fs = require('fs');
const request = require('request');
var ipAddress;
request('http://api.ipstack.com/check?access_key=a0a80aaea559ceb4d5ebacc03c30f6d3', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    ipAddress = body.ip;
});


/**
 * Create a department
 */
exports.create = function (req, res) {   
    
    db.Quotation.create(req.body).then(function (quotation) {
        var request, AllAttachments = [], fileArray, filePath, CostSheetIdsArray;
        if (req.body.fileString.trim() !== "") {
            fileArray = req.body.fileString.split(",");
            for (var index = 0; index < fileArray.length; index++) {
                request = {
                    // imagePath: imageArray[index].replace("/temp/", "/uploads/"),
                    filePath: fileArray[index],
                    QuotationId: quotation.id
                };
                db.QuotationFiles.create(request).then(function (quotationfiles) {
                    if (!quotationfiles) {
                        return res.send('/signin', { errors: new StandardError('Quotation files could not be created') });
                    } 
                });
                AllAttachments.push({
                    filename: fileArray[index].split(",").pop(-1),
                    path: "./public" + fileArray[index]
                });
            }
        }
        if (req.body.CostSheetIds !== "") {
            CostSheetIdsArray = req.body.CostSheetIds.split(",");
            
            for (var index = 0; index < CostSheetIdsArray.length; index++) {
               var CostSheetDetails = {
                    // imagePath: imageArray[index].replace("/temp/", "/uploads/"),
                    QuotationId: quotation.id,
                    CostSheetId: CostSheetIdsArray[index]
                };
                db.QuotationsCostSheet.create(CostSheetDetails).then(function (quotationCostSheets) {
                    if (!quotationCostSheets) {
                        return res.send('/signin', { errors: new StandardError('Quotation CostSheets could not be inserted') });
                    }
                });
            }
        }
        
        var mailObject = {
            from: 'info@metaforgeindia.com',
            to: req.body.buyerEmail,
            subject: 'Metaforge - Quotation',
            html: req.body.emailContent
        };
        //if (req.body.isCostSheetAttached > 0) {
        //    // creating html to pdf
        //    var html = req.body.data;
        //    var options = { format: 'Letter' };
        //    filePath = './public/attachments/quotations/quotation-' + req.body.RfqId + '-' + Date.now() + '.pdf';
        //    pdf.create(html, options).toFile(filePath, function (err, res) {
        //        if (err) console.log(err);
        //        console.log(res); // { filename: /public/attachments/quotations/quotation-41-1532584071.pdf}
                
        //        mailObject.attachments = [{
        //            filename: 'Quotation.pdf',
        //            path: filePath
        //        }];
        //       sm.sendMail(mailObject, function () {
        //          if (fs.existsSync(filePath)) {
        //              fs.unlink(filePath, function (err) { });
        //          }
        //      });
        //    });
        //} else {
        //    sm.sendMail(mailObject);
        //}
        mailObject.attachments = AllAttachments;

        sm.sendMail(mailObject);

        // insert watchdog data
        var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

        db.Watchdog.create({
            message: "New Quotation is created with id = " + quotation.id,
            ipAddress: ipAddress,
            pageUrl: fullUrl,
            userId: quotation.UserId,
            previousData: "",
            updatedData: JSON.stringify(quotation),
					RfqId: req.body.RfqId, 
					RfqPartId: req.body.RfqPartId
        });
        return res.jsonp(quotation);
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

exports.all = function (req, res) {
    db.Quotation.findAll(
        {
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'email', 'firstName', 'lastName']
                },
                {
                    model: db.QuotationsCostSheet,
                    include: [{ model: db.CostSheet }]
                },
            ]
        }).then(function (quotations) {
            return res.jsonp(quotations);
        }).catch(function (err) {
            console.log(err);
            //return res.render('error', {
            //    error: err,
            //    status: 500
            //});
        });
};

exports.getQuotations = function (req, res) {
    return res.jsonp(req.quotations);
}

exports.quotationByRfqId = function (req, res, next, id) {
    db.Quotation.findAll({
        where: { RfqId: id },
        include: [
            {
                model: db.User,
                attributes: ['id', 'email', 'firstName', 'lastName']
            },
            {
                model: db.CostSheet,
            },
        ]
    }).then(function (quotations) {
        if (!quotations) {
            //return next(new Error('Failed to load samplesubmissions ' + id));
            req.quotations = {};
            return next();
        } else {
            req.quotations = quotations;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

exports.quotationByRfqIdAndPartId = function (req, res) {
    db.Quotation.findAll({
        where: { RfqId: req.rfqId2, PartId: req.partId },
        include: [
            {
                model: db.User,
                attributes: ['id', 'email', 'firstName', 'lastName']
            },
            {
                model: db.CostSheet,
            },
        ]
    }).then(function (quotations) {
        if (!quotations) {
            return res.jsonp(new Error('Failed to load Quotations ' + id));
        } else {
            if (quotations.length > 0) {
                for (var index = 0; index < quotations.length; index++) {
                    quotations[index].data = JSON.parse(quotations[index].data);
                }
            }
            return res.jsonp(quotations);
        }
    }).catch(function (err) {
        return res.jsonp(err);
    });
};