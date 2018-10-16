'use strict';

module.exports = function (sequelize, DataTypes) {

    var HandoverSubmitted = sequelize.define('HandoverSubmitted', {        
    },
        {
            associate: function (models) {
                HandoverSubmitted.belongsTo(models.User);
            }
        }
    );

    return HandoverSubmitted;
}; 