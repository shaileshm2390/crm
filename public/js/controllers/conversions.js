'use strict';

var app = angular.module('mean.conversions').controller('ConversionsController', ['$scope', '$location', '$stateParams', 'Global', 'Conversions', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, Conversions, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;

    $scope.currentPage = 0;
    $scope.pageSize = $window.document.getElementById('hdnPageSize').value;
    $scope.data = [];
    $scope.searchString = "";
    $scope.message = "";

    $scope.getData = function () {
        return $filter('filter')($scope.conversions, $scope.searchString);
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
        $scope.message = "Loading.. Please wait..!!";
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
                $scope.message = "";
                this.operation = "";
                this.rate = "";
                this.machine = "";
                this.efficiency = "";
            });
        });

    };

    $scope.remove = function (conversion) {
        if ($window.confirm('Are you absolutely sure you want to delete?')) {
            $scope.message = "Loading.. Please wait..!!";
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
                $scope.message = "";
                $window.location.href = "/conversion";
            });
        }
    };

    $scope.update = function () {
        $scope.message = "Loading.. Please wait..!!";
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
            $scope.message = "";
           });
           
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.find = function () {
        $scope.message = "Loading.. Please wait..!!";
        Conversions.query(function (conversions) {
            $scope.message = "";
            $scope.conversions = conversions;            
        }, function (error) {
            console.log(error);
            $scope.message = "";
            $window.location.href = "/signin";
        });
    };

    $scope.findOne = function () {
        $scope.message = "Loading.. Please wait..!!";
        Conversions.get({
            id: $stateParams.conversionId
        }, function (conversion) {
            $scope.conversion = conversion;
            $scope.message = "";
            }, function (error) {
                console.log(error);
                $scope.message = "";
                $window.location.href = "/signin";
            });
    };


    $scope.onConversionChange = function () {
        $scope.machines = [];
        if (typeof ($scope.conversions) != 'undefined') {
            for (var i = 0 ; i < $scope.conversions.length; i++) {
                if ($scope.conversions[i].operation == $scope.selectedOperation) {
                    $scope.machines.push($scope.conversions[i]);
                }
            }
        }
    }

}]);

app.filter('startFrom', function () {
    return function (input, start) {
        if (typeof(input) != 'undefined') {
        start = +start; //parse to int
        return input.slice(start);
    }
    }
});

app.filter('unique', function () {
    // we will return a function which will take in a collection
    // and a keyname
    return function (collection, keyname) {
        // we define our output and keys array;
        var output = [],
            keys = [];

        // we utilize angular's foreach function
        // this takes in our original collection and an iterator function
        angular.forEach(collection, function (item) {
            // we check to see whether our object exists
            var key = item[keyname];
            // if it's not already part of our keys array
            if (keys.indexOf(key) === -1) {
                // add it to our keys array
                keys.push(key);
                // push this item to our final output array
                output.push(item);
            }
        });
        // return our array which should be devoid of
        // any duplicates
        return output;
    };
});