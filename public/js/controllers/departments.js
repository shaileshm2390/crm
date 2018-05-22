'use strict';

var app = angular.module('mean.departments').controller('DepartmentsController', ['$scope', '$location', '$stateParams', 'Global', 'Departments', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, Departments, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;

    var url = "//freegeoip.net/json/";
    $http.get(url).then(function (response) {
        $rootScope.ip = response.data.ip;
        console.log("IP start  -->   " + $rootScope.ip);
    });

    $scope.create = function () {
        var department = new Departments({
            name: this.name,
            status: 1
        });

        department.$save(function (response) {
            $state.go('departments');           
        });

        this.name = "";
        this.status = 1;
    };

    $scope.remove = function (department) {
        var deleteDepartment = $window.confirm('Are you absolutely sure you want to delete?');
        if (deleteDepartment) {
            if (department) {
                department.$remove();

                for (var i in $scope.departments) {
                    if ($scope.departments[i] === department) {
                        $scope.departments.splice(i, 1);
                    }
                }
            }
            else {
                $scope.department.$remove();
                $state.go('departments');
            }
        }   
    };

    $scope.update = function () {
        var department = $scope.department;
        if (!department.updated) {
            department.updated = [];
        }

        //get previous data from URL
        $http.get("http://localhost:3000/departments/" + department.id).then(function (response) {
            console.log("previous data  -->  " + JSON.stringify(response));
            $scope.previousData = JSON.stringify(response);
        });

        department.updated.push(new Date().getTime());

        department.$update(function () {
            //$state.go('viewDepartment', { departmentId: department.id })
            
            ///get updated data from URL
            $http.get("http://localhost:3000/departments/" + department.id).then(function (response) {
                console.log("updated data  -->  " + JSON.stringify(response));
                $scope.updatedData = JSON.stringify(response);
            

            $state.go('departments');
            var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

            //watchdog calling
            commonCtrl.create({ message: "hello", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousData, updatedData: $scope.updatedData });
           });
           
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.find = function () {        
        Departments.query(function (departments) {   
            $scope.departments = departments;
            
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.findOne = function () {
        Departments.get({
            departmentId: $stateParams.departmentId
        }, function (department) {
            $scope.department = department;
            }, function (error) {
                console.log(error);
                $window.location.href = "/signin";
            });
    };

}]);

app.controller('MyCtrl', ['$scope', '$filter', function ($scope, $filter) {
    $scope.currentPage = 0;
    $scope.pageSize = 3;
    $scope.data = [];

$scope.getData = function () {
    // needed for the pagination calc
    // https://docs.angularjs.org/api/ng/filter/filter
    return $filter('filter')($scope.departments)
    /* 
      // manual filter
      // if u used this, remove the filter from html, remove above line and replace data with getData()
      
       var arr = [];
       if($scope.q == '') {
           arr = $scope.data;
       } else {
           for(var ea in $scope.data) {
               if($scope.data[ea].indexOf($scope.q) > -1) {
                   arr.push( $scope.data[ea] );
               }
           }
       }
       return arr;
      */
}

$scope.numberOfPages = function () {
    return Math.ceil($scope.getData().length / $scope.pageSize);
}

}]);

app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

angular.module("myApp", []).run(function ($rootScope, $http) {
    var url = "//freegeoip.net/json/";
    $http.get(url).then(function (response) {
        console.log(response.data.ip);
        $rootScope.ip = response.data.ip;
    });
});