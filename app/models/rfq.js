'use strict';

module.exports = function (sequelize, DataTypes) {

    var Rfq = sequelize.define('Rfq', {
        content: DataTypes.TEXT,
        subject: DataTypes.TEXT,
        type: DataTypes.STRING,
        marketingUserId: DataTypes.INTEGER
    },
        {
            associate: function (models) {
                Rfq.belongsTo(models.User);
                Rfq.belongsTo(models.Buyer);
                // Rfq.belongsTo(models.Customer);
                Rfq.hasMany(models.RfqImage);
                Rfq.hasMany(models.CostSheet);
                Rfq.hasMany(models.PurchaseOrder);
                Rfq.hasMany(models.Samplesubmission);
                Rfq.hasMany(models.Quotation);
                Rfq.hasMany(models.DeveloperHandover);
                Rfq.hasMany(models.Samplesubmissionimage);
                Rfq.hasMany(models.SampleInspectionReport);
                Rfq.hasOne(models.HandoverSubmitted);
                Rfq.hasMany(models.RfqFeasibilities);
                Rfq.hasMany(models.RfqParts);
                Rfq.hasMany(models.POPartDetails);
            }
        }
    );
     
    return Rfq;
};