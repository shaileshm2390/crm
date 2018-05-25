'use strict';

module.exports = function (sequelize, DataTypes) {

    var Rfqcomment = sequelize.define('Rfqcomment', {
        comment: DataTypes.STRING
    },
        {
            associate: function (models) {
                Rfqcomment.belongsTo(models.User);
                Rfqcomment.belongsTo(models.Rfq);
            }
        }
    );

    return Rfqcomment;
}; 