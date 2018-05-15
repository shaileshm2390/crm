'use strict';

module.exports = function (sequelize, DataTypes) {

    var Department = sequelize.define('Department', {
        name: DataTypes.STRING,
        status: DataTypes.BOOLEAN
    },
        {
            //associate: function (models) {
            //    Department.belongsTo(models.User);
            //}
        }
    );

    return Department;
};