'use strict';

var app = angular.module('mean.conversions').controller('ConversionsController', ['$scope', '$location', '$stateParams', 'Global', 'Conversions', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, Conversions, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;

    $scope.currentPage = 0;
    $scope.pageSize = $window.document.getElementById('hdnPageSize').value;
    $scope.data = [];
    $scope.searchString = "";

    $scope.getData = function () {
        return $filter('filter')($scope.conversions, $scope.searchString);
    }

    $scope.numberOfPages = function () {
        if (typeof $scope.getData() != 'undefined') {
            return Math.ceil($scope.getData().length / $scope.pageSize);
        }
    }

    var url = "//freegeoip.net/json/";
    $http.get(url).then(function (response) {
        $rootScope.ip = response.data.ip;
    });

    $scope.create = function () {
        var conversion = new Conversions({
            operation: this.operation,
            machine: this.machine,
            rate: this.rate,
            efficiency: this.efficiency
        });

        conversion.$save(function (response) {
            //$state.go('departments');
            $http.get("/conversions/" + conversion.id).then(function (response) {
                $scope.updatedConversion = JSON.stringify(response.data);

                $state.go('conversions');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New Conversion master is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedConversion });
            });
        });

        this.operation = "";
        this.rate = "";
        this.machine = "";
        this.efficiency = "";
    };

    $scope.remove = function (conversion) {
        if ($window.confirm('Are you absolutely sure you want to delete?')) {
            //get previous data from URL
            $http.get("/conversions/" + conversion.id).then(function (response) {
                $scope.previousConversion = JSON.stringify(response.data);


                if (conversion) {
                    conversion.$remove();

                    for (var i in $scope.conversions) {
                        if ($scope.conversions[i] === conversion) {
                            $scope.conversions.splice(i, 1);
                        }
                    }
                }
                else {
                    $scope.conversion.$remove();
                }

                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({
                    message: "Conversion " + conversion.id + " is deleted",
                    ipAddress: $rootScope.ip,
                    pageUrl: $location.url(),
                    userId: user.id,
                    previousData: $scope.previousConversion,
                    updatedData: ""
                });
               // $window.location.href = "/conversion";
            });
        }
    };

    $scope.update = function () {
        var conversion = $scope.conversion;
        if (!conversion.updated) {
            conversion.updated = [];
        }

        //get previous data from URL
        $http.get("/conversions/" + conversion.id).then(function (response) {
            $scope.previousData = JSON.stringify(response.data);
        });

        conversion.updated.push(new Date().getTime());

        conversion.$update(function () {
            //$state.go('viewDepartment', { departmentId: department.id })
            
            ///get updated data from URL
            $http.get("/conversions/" + conversion.id).then(function (response) {
                $scope.updatedData = JSON.stringify(response.data);
            

                $state.go('conversions');
            var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

            //watchdog calling
            commonCtrl.create({ message: "Conversion " + conversion.id + " is updated.", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousData, updatedData: $scope.updatedData });
           });
           
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.find = function () {        
        Conversions.query(function (conversions) {
            $scope.conversions = conversions;            
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.findOne = function () {
        Conversions.get({
            id: $stateParams.conversionId
        }, function (conversion) {
            $scope.conversion = conversion;
            }, function (error) {
                console.log(error);
                $window.location.href = "/signin";
            });
    };

}]);

app.filter('startFrom', function () {
    return function (input, start) {
        if (typeof(input) != 'undefined') {
        start = +start; //parse to int
        return input.slice(start);
    }
    }
});