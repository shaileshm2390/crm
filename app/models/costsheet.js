'use strict';

module.exports = function (sequelize, DataTypes) {

    var CostSheet = sequelize.define('CostSheet', {
        data: DataTypes.TEXT,
        TotalCost: DataTypes.STRING,
        status: { type: DataTypes.STRING, defaultValue: "pending" }
    },  
        {
            associate: function (models) {
                CostSheet.belongsTo(models.User);
                CostSheet.belongsTo(models.Rfq);
                CostSheet.belongsTo(models.RfqParts);
            }
        } 
    );

    return CostSheet;
}; 