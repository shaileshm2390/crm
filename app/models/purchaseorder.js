'use strict';

module.exports = function (sequelize, DataTypes) {

    var PurchaseOrder = sequelize.define('PurchaseOrder', {
        status: DataTypes.STRING,
        gstNum : DataTypes.STRING,
        hsnNum : DataTypes.STRING,
        application: DataTypes.STRING,
        isClosed: DataTypes.BOOLEAN,
        reason : DataTypes.TEXT,
    },
        {
            associate: function (models) {
                PurchaseOrder.belongsTo(models.Rfq);
                PurchaseOrder.hasMany(models.PurchaseOrderImage);
            }
        }
    );

    return PurchaseOrder;
};