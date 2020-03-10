'use strict';

module.exports = function (sequelize, DataTypes) {

    var QuotationFiles = sequelize.define('QuotationFiles', {
        filePath: DataTypes.TEXT
    },
        {
            associate: function (models) {
                QuotationFiles.belongsTo(models.Quotation);
            }
        }
    );

    return QuotationFiles;
};