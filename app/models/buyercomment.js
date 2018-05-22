'use strict';

module.exports = function (sequelize, DataTypes) {

    var Buyercomment = sequelize.define('Buyercomment', {
        comment: DataTypes.STRING
    },
        {
            associate: function (models) {
                Buyercomment.belongsTo(models.User);
                Buyercomment.belongsTo(models.Buyer);
            }
        }
    );

    return Buyercomment;
};