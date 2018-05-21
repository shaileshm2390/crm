'use strict';

module.exports = function (sequelize, DataTypes) {

    var Customercomment = sequelize.define('Customercomment', {
        comment: DataTypes.STRING
    },
        {
            associate: function (models) {
                Customercomment.belongsTo(models.User);
                Customercomment.belongsTo(models.Customer);
            }
        }
    );

    return Customercomment;
};