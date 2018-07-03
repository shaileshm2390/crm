'use strict';

var app = angular.module('mean.departments').controller('DepartmentsController', ['$scope', '$location', '$stateParams', 'Global', 'Departments', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, Departments, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;

    $scope.currentPage = 0;
    $scope.pageSize = $window.document.getElementById('hdnPageSize').value;
    $scope.data = [];
    $scope.searchString = "";
    $scope.message = "";

    $scope.getData = function () {
        return $filter('filter')($scope.departments, $scope.searchString);       
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
        var department = new Departments({
            name: this.name,
            status: 1
        });

        department.$save(function (response) {
            //$state.go('departments');
            $http.get("/departments/" + department.id).then(function (response) {
                $scope.updatedDetpartment = JSON.stringify(response.data);

                $state.go('departments');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New department is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedDetpartment });
                $scope.message = "";
                this.name = "";
                this.status = 1;
            });
        });
    };

    $scope.remove = function (department) {
        var deleteDepartment = $window.confirm('Are you absolutely sure you want to delete?');

        if (deleteDepartment) {
            $scope.message = "Loading.. Please wait..!!";
            //get previous data from URL
            $http.get("/departments/" + department.id).then(function (response) {
                $scope.previousDepartment = JSON.stringify(response.data);


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
                }

                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({
                    message: "Department " + department.id + " is deleted",
                    ipAddress: $rootScope.ip,
                    pageUrl: $location.url(),
                    userId: user.id,
                    previousData: $scope.previousDepartment,
                    updatedData: ""
                });
                $scope.message = "";
                $window.location.href = "/department";
            });
        }
    };

    $scope.update = function () {
        $scope.message = "Loading.. Please wait..!!";
        var department = $scope.department;
        if (!department.updated) {
            department.updated = [];
        }

        //get previous data from URL
        $http.get("/departments/" + department.id).then(function (response) {
            $scope.previousData = JSON.stringify(response.data);
        });

        department.updated.push(new Date().getTime());

        department.$update(function () {
            //$state.go('viewDepartment', { departmentId: department.id })
            
            ///get updated data from URL
            $http.get("/departments/" + department.id).then(function (response) {
                $scope.updatedData = JSON.stringify(response.data);
            

            $state.go('departments');
            var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

            //watchdog calling
            commonCtrl.create({ message: "Department " + department.id + " is updated.", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousData, updatedData: $scope.updatedData });
            $scope.message = "";
           });
           
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.find = function () {
        $scope.message = "Loading.. Please wait..!!";
        Departments.query(function (departments) {   
            $scope.departments = departments;
            $scope.message = "";
        }, function (error) {
            $scope.message = "";
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.findExceptAdmin = function () {
        $scope.message = "Loading.. Please wait..!!";
        Departments.query(function (departments) {
            for (var i in departments) {
                if (departments[i].name === 'Admin') {
                    departments.splice(departments[i], 1);
                }
            }
            $scope.departments = departments;
            $scope.message = "";
        }, function (error) {
            console.log(error);
            $scope.message = "";
            $window.location.href = "/signin";
        });
    };    

    $scope.findOne = function () {
        $scope.message = "Loading.. Please wait..!!";
        Departments.get({
            departmentId: $stateParams.departmentId
        }, function (department) {
            $scope.message = "";
            $scope.department = department;
        }, function (error) {
            $scope.message = "";
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