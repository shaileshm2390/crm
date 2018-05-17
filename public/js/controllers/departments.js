'use strict';

angular.module('mean.departments').controller('DepartmentsController', ['$scope', '$location', '$stateParams', 'Global', 'Departments', '$state', '$window', function ($scope, $location, $stateParams, Global, Departments, $state, $window) {
    $scope.global = Global;
  
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
        department.updated.push(new Date().getTime());
        department.$update(function () {
            //$state.go('viewDepartment', { departmentId: department.id })
            $state.go('departments');
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