'use strict';

module.exports = function (sequelize, DataTypes) {

    var SampleInspectionReportImage = sequelize.define('SampleInspectionReportImage', {
        imagePath: DataTypes.STRING
    },
        {
            associate: function (models) {
                SampleInspectionReportImage.belongsTo(models.SampleInspectionReport);
            }
        }
    );

    return SampleInspectionReportImage;
};