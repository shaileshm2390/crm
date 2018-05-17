'use strict';

angular.module('mean.users').controller('UsersController', ['$scope', '$stateParams', 'Global', 'Users', '$state', '$window', function ($scope, $stateParams, Global, Users, $state, $window) {
    $scope.global = Global;

    $scope.create = function () {
        isLoggedIn();
        var user = new Users({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            contact: this.user.contact,
            password: this.user.password,
            active: 1,
            DepartmentId: 1
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
        isLoggedIn();
        var deleteUser = $window.confirm('Are you absolutely sure you want to delete?');
        if (deleteUser) {
            if (user) {
                user.$remove();

                for (var i in $scope.departments) {
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
        isLoggedIn();
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
        isLoggedIn();
       // console.log($scope.global);       
        Users.query(function (users) {            
            $scope.users = users;
        });
    };

    $scope.findOne = function () {
        isLoggedIn();
        Users.get({
            userId: $stateParams.usersId
        }, function (user) {
            $scope.user = user;
        });
    };

    function isLoggedIn() {
        if (!$scope.global.authenticated) {
            $window.location.href = '/signin';
        }
    }

}]);