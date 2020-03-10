// JavaScript source code
'use strict';

module.exports = function (sequelize, DataTypes) {

    var QuotationsCostSheet = sequelize.define('QuotationsCostSheet', {},
        {
            associate: function (models) {
                QuotationsCostSheet.belongsTo(models.Quotation);
                QuotationsCostSheet.belongsTo(models.CostSheet);
            }
        }
    );

    return QuotationsCostSheet;
};