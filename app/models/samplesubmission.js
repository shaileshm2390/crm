'use strict';

module.exports = function (sequelize, DataTypes) {

    var Samplesubmission = sequelize.define('Samplesubmission', {
        operation: DataTypes.STRING,
        stage: DataTypes.STRING,
        stageProcess: DataTypes.STRING,
        orderTo: DataTypes.STRING,
        orderDate: DataTypes.DATE,
        receivedDate: DataTypes.DATE,
        cost : DataTypes.STRING
    },
        {
            associate: function (models) {
                Samplesubmission.belongsTo(models.Rfq);
            }
        }
    );

    return Samplesubmission;
};