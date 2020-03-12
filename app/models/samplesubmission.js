'use strict';

module.exports = function (sequelize, DataTypes) {

    var Samplesubmission = sequelize.define('Samplesubmission', {
        operation: DataTypes.STRING,
        stage: DataTypes.STRING,
        stageProcess: DataTypes.STRING,
        orderTo: DataTypes.STRING,
        orderDate: DataTypes.DATE,
        receivedDate: DataTypes.DATE,
        description : DataTypes.TEXT,
        cost: DataTypes.STRING,
        expectedDate: DataTypes.DATE
    },
        {
            associate: function (models) {
                Samplesubmission.belongsTo(models.Rfq);
                Samplesubmission.belongsTo(models.RfqParts);
            }
        }
    );

    return Samplesubmission;
};