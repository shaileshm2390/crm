'use strict';

module.exports = function (sequelize, DataTypes) {

    var SampleStatus = sequelize.define('SampleStatus', {
        process: DataTypes.STRING,
        startDate: DataTypes.DATE,
        targetDate: DataTypes.DATE,
        status: DataTypes.STRING
    },
        {
            associate: function (models) {
                SampleStatus.belongsTo(models.User);
            }
        }
    );

    return SampleStatus;
};