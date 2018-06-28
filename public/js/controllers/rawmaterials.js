'use strict';

var app = angular.module('mean.rawmaterials').controller('RawMaterialsController', ['$scope', '$location', '$stateParams', 'Global', 'RawMaterials', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, RawMaterials, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;

    $scope.currentPage = 0;
    $scope.pageSize = $window.document.getElementById('hdnPageSize').value;
    $scope.data = [];
    $scope.searchString = "";
    $scope.message = "";

    $scope.getData = function () {
        return $filter('filter')($scope.rawmaterials, $scope.searchString);
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
        $scope.message = "Loading.. Please wait..!!";
        var rawmaterial = new RawMaterials({
            material: this.material,
            rate: this.rate,
            scrapRate: this.scrapRate,
            scrapRecovery: this.scrapRecovery
        });

        rawmaterial.$save(function (response) {
            //$state.go('departments');
            $http.get("/rawmaterials/" + rawmaterial.id).then(function (response) {
                $scope.updatedRawMaterial = JSON.stringify(response.data);

                $state.go('rawmaterials');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New rawmaterials is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedRawMaterial });
                $scope.message = "";
                this.material = "";
                this.rate = "";
                this.scrapRate = "";
                this.scrapRecovery = "";
            });
        });

       
    };

    $scope.remove = function (rawmaterial) {
        if ($window.confirm('Are you absolutely sure you want to delete?')) {
            $scope.message = "Loading.. Please wait..!!";
            //get previous data from URL
            $http.get("/rawmaterials/" + rawmaterial.id).then(function (response) {
                $scope.previousRawMaterial = JSON.stringify(response.data);


                if (rawmaterial) {
                    rawmaterial.$remove();

                    for (var i in $scope.rawmaterials) {
                        if ($scope.rawmaterials[i] === rawmaterial) {
                            $scope.rawmaterials.splice(i, 1);
                        }
                    }
                }
                else {
                    $scope.rawmaterial.$remove();
                }

                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({
                    message: "RawMaterial " + rawmaterial.id + " is deleted",
                    ipAddress: $rootScope.ip,
                    pageUrl: $location.url(),
                    userId: user.id,
                    previousData: $scope.previousRawMaterial,
                    updatedData: ""
                });
                $scope.message = "";
                $window.location.href = "/material";
            });
        }
    };

    $scope.update = function () {
        var rawmaterial = $scope.rawmaterial;
        $scope.message = "Loading.. Please wait..!!";
        if (!rawmaterial.updated) {
            rawmaterial.updated = [];
        }

        //get previous data from URL
        $http.get("/rawmaterials/" + rawmaterial.id).then(function (response) {
            $scope.previousData = JSON.stringify(response.data);
        });

        rawmaterial.updated.push(new Date().getTime());

        rawmaterial.$update(function () {
            //$state.go('viewDepartment', { departmentId: department.id })
            
            ///get updated data from URL
            $http.get("/rawmaterials/" + rawmaterial.id).then(function (response) {
                $scope.updatedData = JSON.stringify(response.data);
            

                $state.go('rawmaterials');
            var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

            //watchdog calling
            commonCtrl.create({ message: "RawMaterial " + rawmaterial.id + " is updated.", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousData, updatedData: $scope.updatedData });
            $scope.message = "";
           });
           
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.find = function () {
        $scope.message = "Loading.. Please wait..!!";
        RawMaterials.query(function (rawmaterials) {
            $scope.rawmaterials = rawmaterials;
            $scope.message = "";
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.findOne = function () {
        $scope.message = "Loading.. Please wait..!!";
        RawMaterials.get({
            id: $stateParams.rawmaterialId
        }, function (rawmaterial) {
            $scope.rawmaterial = rawmaterial;
            $scope.message = "";
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