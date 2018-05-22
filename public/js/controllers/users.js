'use strict';

var app = angular.module('mean.users').controller('UsersController', ['$scope', '$stateParams', 'Global', 'Users', '$state', '$window','$filter', function ($scope, $stateParams, Global, Users, $state, $window, $filter) {
    $scope.global = Global;
    $scope.currentPage = 0;
    $scope.pageSize = 3;
    $scope.data = [];
    $scope.searchString = "";

    $scope.getData = function () {
        return $filter('filter')($scope.users, $scope.searchString);
    }

    $scope.numberOfPages = function () {
        if (typeof $scope.getData() != 'undefined') {
            return Math.ceil($scope.getData().length / $scope.pageSize);
        }
    }

    $scope.create = function () {
        var user = new Users({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            contact: this.user.contact,
            password: this.user.password,
            active: 1,
            DepartmentId: this.user.DepartmentId
        });
       
        user.$save(function (response) {
            $state.go('users');
        });

        this.user.firstName = "";
        this.user.lastName = "";
        this.user.email = "";
        this.user.contact = "";
        this.user.active = 1;
        this.user.password = "";
        this.user.DepartmentId = 0;

    };

    $scope.remove = function (user) {
        var deleteUser = $window.confirm('Are you absolutely sure you want to delete?');
        if (deleteUser) {
            if (user) {
                user.$remove();

                for (var i in $scope.users) {
                    if ($scope.users[i] === user) {
                        $scope.users.splice(i, 1);
                    }
                }
            }
            else {
                $scope.user.$remove();
                $state.go('users');
            }
        }
    };

    $scope.resetPassword = function (user) {
        if ($window.confirm('Are you absolutely sure you want to reset the password?')) {
            if (user.id > 0) {
                $http.get("/users/reset/" + user.id)
                    .then(function (response) {
                        console.log(response);
                        $scope.message = response.statusText;
                    }, function (response) {
                        //Second function handles error
                        $scope.errorMessage = response.statusText;
                    });
            }            
        }
    };

    $scope.update = function () {
        var user = $scope.user;
        if (!user.updated) {
            user.updated = [];
        }
        user.updated.push(new Date().getTime());
        user.$update(function () {
            //$state.go('viewDepartment', { departmentId: department.id })
            $state.go('users');
        });
    };

    $scope.find = function () {    
        Users.query(function (users) {            
            $scope.users = users;
        });
    };

    $scope.findOne = function () {
        Users.get({
            userId: $stateParams.userId
        }, function (user) {
            $scope.user = user;
        });
    };
}]);

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
app.filter('startFrom', function () {
    return function (input, start) {
        if (typeof(input) != 'undefined') {
            start = +start; //parse to int
            return input.slice(start);
        }
    }
});
