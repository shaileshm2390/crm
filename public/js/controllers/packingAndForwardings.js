'use strict';

var app = angular.module('mean.packingAndForwardings').controller('PackingAndForwardingsController', ['$scope', '$location', '$stateParams', 'Global', 'PackingAndForwardings', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, PackingAndForwardings, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;

    $scope.currentPage = 0;
    $scope.pageSize = $window.document.getElementById('hdnPageSize').value;
    $scope.data = [];
    $scope.searchString = "";
    $scope.message = "";

    $scope.getData = function () {
        return $filter('filter')($scope.packingAndForwardings, $scope.searchString);
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
        var packingAndForwarding = new PackingAndForwardings({
            name: this.name,
            rate: this.rate,
        });
        $scope.message = "Loading.. Please wait !!";
        packingAndForwarding.$save(function (response) {
            //$state.go('departments');
            $http.get("/packingAndForwardings/" + packingAndForwarding.id).then(function (response) {
                $scope.updatedData = JSON.stringify(response.data);

                $state.go('packingAndForwardings');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New packingAndForwardings is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedData });
                $scope.message = "";
                this.name = "";
                this.rate = "";
            });
        });
    };

    $scope.remove = function (packingAndForwarding) {
        if ($window.confirm('Are you absolutely sure you want to delete?')) {
            $scope.message = "Loading.. Please wait !!";
            //get previous data from URL
            $http.get("/packingAndForwardings/" + packingAndForwarding.id).then(function (response) {
                $scope.previousData = JSON.stringify(response.data);


                if (packingAndForwarding) {
                    packingAndForwarding.$remove();

                    for (var i in $scope.htsts) {
                        if ($scope.packingAndForwardings[i] === packingAndForwarding) {
                            $scope.packingAndForwardings.splice(i, 1);
                        }
                    }
                }
                else {
                    $scope.packingAndForwarding.$remove();
                }

                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({
                    message: "PackingAndForwarding " + packingAndForwarding.id + " is deleted",
                    ipAddress: $rootScope.ip,
                    pageUrl: $location.url(),
                    userId: user.id,
                    previousData: $scope.previousData,
                    updatedData: ""
                });
                $window.location.href = "/packingAndForwarding";
                //$scope.find();
            });
        }
    };

    $scope.update = function () {
        var packingAndForwarding = $scope.packingAndForwarding;
        if (!packingAndForwarding.updated) {
            packingAndForwarding.updated = [];
        }
        $scope.message = "Loading.. Please wait !!";
        //get previous data from URL
        $http.get("/packingAndForwardings/" + packingAndForwarding.id).then(function (response) {
            $scope.previousData = JSON.stringify(response.data);
        });

        packingAndForwarding.updated.push(new Date().getTime());

        packingAndForwarding.$update(function () {
            //$state.go('viewDepartment', { departmentId: department.id })

            ///get updated data from URL
            $http.get("/packingAndForwardings/" + packingAndForwarding.id).then(function (response) {
                $scope.updatedData = JSON.stringify(response.data);


                $state.go('packingAndForwardings');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "PackingAndForwarding " + packingAndForwarding.id + " is updated.", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousData, updatedData: $scope.updatedData });
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
        PackingAndForwardings.query(function (packingAndForwardings) {
            $scope.packingAndForwardings = packingAndForwardings;
            $scope.message = "";
        }, function (error) {
            $scope.message = "";
            $window.location.href = "/signin";
        });
    };

    $scope.findOne = function () {
        $scope.message = "Loading.. Please wait !!";
        PackingAndForwardings.get({
            id: $stateParams.packingAndForwardingId
        }, function (packingAndForwarding) {
            $scope.message = "";
            $scope.packingAndForwarding = packingAndForwarding;
        }, function (error) {
            $scope.message = "";
            $window.location.href = "/signin";
        });
    };

    $scope.add = function () {
        var packingAndForwarding = new PackingAndForwardings({
            name: this.name,
            rate: this.rate
        });
        $scope.message = "New PackingAndForwarding added successfully..!";
        packingAndForwarding.$save(function (response) {
            //$state.go('departments');
            $http.get("/packingAndForwardings/" + packingAndForwarding.id).then(function (response) {
                $scope.updatedData = JSON.stringify(response.data);
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });
    
                //watchdog calling
                commonCtrl.create({ message: "New packingAndForwardings is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedData });
                $scope.message = "";
                this.name = "";
                this.rate = "";
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

