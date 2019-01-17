﻿'use strict';

module.exports = function (sequelize, DataTypes) {

    var Quotation = sequelize.define('Quotation', {
        data: DataTypes.TEXT,
        emailContent: DataTypes.TEXT,
        //status: { type: DataTypes.STRING, defaultValue: "pending" }
        isCostSheetAttached: DataTypes.BOOLEAN,
        CustomerFeedBack: DataTypes.STRING // 1-Await, 2-Proceed, 3-Cancel
    },
        {
            associate: function (models) {
                Quotation.belongsTo(models.User);
                Quotation.belongsTo(models.CostSheet);
            }
        }
    );

    return Quotation;
}; 