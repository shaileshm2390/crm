'use strict';

module.exports = function (sequelize, DataTypes) {

    var Quotation = sequelize.define('Quotation', {
        data: DataTypes.TEXT,
        //status: { type: DataTypes.STRING, defaultValue: "pending" }
        type: DataTypes.INTEGER
    },
        {
            associate: function (models) {
                Quotation.belongsTo(models.User);
                Quotation.belongsTo(models.Rfq);
                Quotation.belongsTo(models.CostSheet);
            }
        }
    );

    return Quotation;
}; 