'use strict';

module.exports = function (sequelize, DataTypes) {

    var Rfq = sequelize.define('Rfq', {
        content: DataTypes.TEXT,
    },
        {
            associate: function (models) {
                Rfq.belongsTo(models.User);
                Rfq.belongsTo(models.Buyer);
            }
        }
    );

    return Rfq;
};