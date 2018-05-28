﻿'use strict';

module.exports = function (sequelize, DataTypes) {

    var PurchaseOrder = sequelize.define('PurchaseOrder', {
        status: DataTypes.STRING
    },
        {
            associate: function (models) {
                PurchaseOrder.belongsTo(models.Rfq);
            }
        }
    );

    return PurchaseOrder;
};