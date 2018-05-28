'use strict';

module.exports = function (sequelize, DataTypes) {

    var CostSheet = sequelize.define('CostSheet', {
        data: DataTypes.TEXT,
        status: { type: DataTypes.STRING, defaultValue: "pending" }
    },  
        {
            associate: function (models) {
                CostSheet.belongsTo(models.User);
                CostSheet.belongsTo(models.Rfq);
            }
        } 
    );

    return CostSheet;
}; 