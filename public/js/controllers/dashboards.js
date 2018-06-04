'use strict';

var app = angular.module('mean.dashboards').controller('DashboardsController', ['$scope', '$location', '$stateParams', 'Global', 'Dashboards', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, Dashboards, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;

    $scope.find = function () {
        $http.get("/dashboards/getSiteSummary")
            .then(function (response) {
                $scope.siteSummary = response.data;
                console.log($scope.siteSummary);
            }, function (error) {
                console.log(error);
            });
    };

}]);