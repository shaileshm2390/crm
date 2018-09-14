'use strict';

var app = angular.module('mean.htsts').controller('HtstsController', ['$scope', '$location', '$stateParams', 'Global', 'Htsts', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, Htsts, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;

    $scope.currentPage = 0;
    $scope.pageSize = $window.document.getElementById('hdnPageSize').value;
    $scope.data = [];
    $scope.searchString = "";
    $scope.message = "";

    $scope.getData = function () {
        return $filter('filter')($scope.htsts, $scope.searchString);
    }

    $scope.numberOfPages = function () {
        if (typeof $scope.getData() != 'undefined') {
            return Math.ceil($scope.getData().length / $scope.pageSize);
        }
    }

    var url = "http://api.ipstack.com/check?access_key=a0a80aaea559ceb4d5ebacc03c30f6d3";
    $http.get(url).then(function (response) {
        $rootScope.ip = response.data.ip;
    });

    $scope.create = function () {
        var htst = new Htsts({
            parameter: this.parameter,
            rate: this.rate,
            details: this.details,
        });
        $scope.message = "Loading.. Please wait !!";
        htst.$save(function (response) {
            //$state.go('departments');
            $http.get("/htsts/" + htst.id).then(function (response) {
                $scope.updatedData = JSON.stringify(response.data);

                $state.go('htsts');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New htsts is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedData });
                $scope.message = "";
                this.parameter = "";
                this.rate = "";
                this.details = "";
            });
        });
    };

    $scope.remove = function (htst) {
        if ($window.confirm('Are you absolutely sure you want to delete?')) {
            $scope.message = "Loading.. Please wait !!";
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
                //$scope.find();
            });
        }
    };

    $scope.update = function () {
        var htst = $scope.htst;
        if (!htst.updated) {
            htst.updated = [];
        }
        $scope.message = "Loading.. Please wait !!";
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
            $scope.message = "";
        }, function (error) {
            console.log(error);
            $scope.message = "";
            $window.location.href = "/signin";
        });
    };

    $scope.find = function () {
        $scope.message = "Loading.. Please wait !!"
        Htsts.query(function (htsts) {
            $scope.htsts = htsts;
            $scope.message = "";
        }, function (error) {
            $scope.message = "";
            $window.location.href = "/signin";
        });
    };

    $scope.findOne = function () {
        $scope.message = "Loading.. Please wait !!";
        Htsts.get({
            id: $stateParams.htstId
        }, function (htst) {
            $scope.message = "";
            $scope.htst = htst;
        }, function (error) {
            $scope.message = "";
            $window.location.href = "/signin";
        });
    };

    $scope.add = function () {
        var htst = new Htsts({
            parameter: this.parameter,
            rate: this.rate,
            details: this.details,
        });
        $scope.message = "New HTST added successfully..!";
        htst.$save(function (response) {
            //$state.go('departments');
            $http.get("/htsts/" + htst.id).then(function (response) {
                $scope.updatedData = JSON.stringify(response.data);
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });
    
                //watchdog calling
                commonCtrl.create({ message: "New htsts is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedData });
                $scope.message = "";
                this.parameter = "";
                this.rate = "";
                this.details = "";
            });
        });
    };

}]);

app.filter('startFrom', function () {
    return function (input, start) {
        if (typeof (input) != 'undefined') {
            start = +start; //parse to int
            return input.slice(start);
        }
    }
});

