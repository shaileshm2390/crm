'use strict';

module.exports = function (sequelize, DataTypes) {

    var Samplesubmission = sequelize.define('Samplesubmission', {
        status: DataTypes.STRING
    },
        {
            associate: function (models) {
                Samplesubmission.belongsTo(models.Rfq);
            }
        }
    );

    return Samplesubmission;
};