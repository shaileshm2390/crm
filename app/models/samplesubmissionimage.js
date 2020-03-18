'use strict';

module.exports = function (sequelize, DataTypes) {

    var Samplesubmissionimage = sequelize.define('Samplesubmissionimage', {
        imagePath: DataTypes.TEXT,
        operation: DataTypes.STRING
    },
        {
            associate: function (models) {
                Samplesubmissionimage.belongsTo(models.Rfq);
                Samplesubmissionimage.belongsTo(models.RfqParts);
            }
        }
    );

    return Samplesubmissionimage;
};