'use strict';

module.exports = function (sequelize, DataTypes) {

    var Rfq = sequelize.define('Rfq', {
        content: DataTypes.TEXT,
        subject: DataTypes.TEXT,
    },
        {
            associate: function (models) {
                Rfq.belongsTo(models.User);
                Rfq.belongsTo(models.Buyer);
                Rfq.hasMany(models.RfqImage);
                Rfq.hasMany(models.CostSheet);
                Rfq.hasMany(models.PurchaseOrder);
                Rfq.hasMany(models.Samplesubmission);
                Rfq.hasMany(models.Quotation);
            }
        }
    );
     
    return Rfq;
};