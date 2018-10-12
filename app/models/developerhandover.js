'use strict';

module.exports = function (sequelize, DataTypes) {

    var DeveloperHandover = sequelize.define('DeveloperHandover', {
        data: DataTypes.TEXT,
        expectedLeadTime: DataTypes.INTEGER 
    },
        {
            associate: function (models) {
                DeveloperHandover.belongsTo(models.User);
            }
        }
    );

    return DeveloperHandover;
}; 