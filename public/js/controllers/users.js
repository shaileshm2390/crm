'use strict';

angular.module('mean.users').controller('UsersController', ['$scope', '$stateParams', 'Global', 'Users', '$state', '$window', function ($scope, $stateParams, Global, Users, $state, $window) {
    $scope.global = Global;

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
            // $state.go('viewDepartment', { departmentId: response.id })
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