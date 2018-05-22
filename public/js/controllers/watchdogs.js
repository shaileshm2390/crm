'use strict';

var app = angular.module('mean.watchdogs').controller('WatchdogsController', ['$scope', '$location', '$stateParams', 'Global', 'Watchdogs', '$state', '$window', '$filter', function ($scope, $location, $stateParams, Global, Watchdogs, $state, $window, $filter) {
    $scope.global = Global;
    var self = this;
    //console.log(communicate.communicateValue + " Parent World");
    self.create = function (data) {
        console.log(data);
        var watchdog = new Watchdogs({
            message: data.message,
            ipAddress: data.ipAddress,
            pageUrl: data.pageUrl,
            userId: data.userId,
            previousData: data.previousData,
            updatedData: data.updatedData
        });

        watchdog.$save(function (response) {
         // $state.go('watchdogs');
        });

        this.message = "";
        this.ipAddress = "";
        this.pageUrl = "";
        this.userId = "";
        this.previousData = "";
        this.updatedData = "";
    };

    return self;

}]);

