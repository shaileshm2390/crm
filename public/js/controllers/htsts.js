'use strict';

var app = angular.module('mean.htsts').controller('HtstsController', ['$scope', '$location', '$stateParams', 'Global', 'Htsts', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, Htsts, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;

    $scope.currentPage = 0;
    $scope.pageSize = $window.document.getElementById('hdnPageSize').value;
    $scope.data = [];
    $scope.searchString = "";

    $scope.getData = function () {
        return $filter('filter')($scope.htsts, $scope.searchString);
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
        var htst = new Htsts({
            parameter: this.parameter,
            rate: this.rate,
            details: this.details,
        });

        htst.$save(function (response) {
            //$state.go('departments');
            $http.get("/htsts/" + htst.id).then(function (response) {
                $scope.updatedData = JSON.stringify(response.data);

                $state.go('htsts');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New htsts is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedData });
            });
        });

        this.parameter = "";
        this.rate = "";
        this.details = "";
    };

    $scope.remove = function (htst) {
        if ($window.confirm('Are you absolutely sure you want to delete?')) {
            //get previous data from URL
            $http.get("/htsts/" + htst.id).then(function (response) {
                $scope.previousData = JSON.stringify(response.data);


                if (htst) {
                    htst.$remove();

                    for (var i in $scope.htsts) {
                        if ($scope.htsts[i] === htst) {
                            $scope.htsts.splice(i, 1);
                        }
                    }
                }
                else {
                    $scope.htst.$remove();
                }

                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({
                    message: "Htst " + htst.id + " is deleted",
                    ipAddress: $rootScope.ip,
                    pageUrl: $location.url(),
                    userId: user.id,
                    previousData: $scope.previousData,
                    updatedData: ""
                });
                $window.location.href = "/htst";
            });
        }
    };

    $scope.update = function () {
        var htst = $scope.htst;
        if (!htst.updated) {
            htst.updated = [];
        }

        //get previous data from URL
        $http.get("/htsts/" + htst.id).then(function (response) {
            $scope.previousData = JSON.stringify(response.data);
        });

        htst.updated.push(new Date().getTime());

        htst.$update(function () {
            //$state.go('viewDepartment', { departmentId: department.id })
            
            ///get updated data from URL
            $http.get("/htsts/" + htst.id).then(function (response) {
                $scope.updatedData = JSON.stringify(response.data);
            

                $state.go('htsts');
            var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

            //watchdog calling
            commonCtrl.create({ message: "Htst " + htst.id + " is updated.", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousData, updatedData: $scope.updatedData });
           });
           
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.find = function () {        
        Htsts.query(function (htsts) {
            $scope.htsts = htsts;            
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.findOne = function () {
        Htsts.get({
            id: $stateParams.htstId
        }, function (htst) {
            $scope.htst = htst;
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