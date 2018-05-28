'use strict';

module.exports = function (sequelize, DataTypes) {

    var Samplesubmissionimage = sequelize.define('Samplesubmissionimage', {
        imagePath: DataTypes.TEXT
    },
        {
            associate: function (models) {
                Samplesubmissionimage.belongsTo(models.Samplesubmission);
            }
        }
    );

    return Samplesubmissionimage;
};