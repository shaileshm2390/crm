'use strict';

module.exports = function (sequelize, DataTypes) {

    var Quotation = sequelize.define('Quotation', {
        data: DataTypes.TEXT,
        emailContent: DataTypes.TEXT,
        //status: { type: DataTypes.STRING, defaultValue: "pending" }
        isCostSheetAttached: DataTypes.BOOLEAN
    },
        {
            associate: function (models) {
                Quotation.belongsTo(models.User);
                Quotation.belongsTo(models.CostSheet);
                Quotation.belongsTo(models.RfqParts);
                Quotation.hasMany(models.QuotationsCostSheet);
            }
        }
    );

    return Quotation;
}; 