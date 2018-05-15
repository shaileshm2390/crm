'use strict';

angular.module('mean.users').controller('UsersController', ['$scope', '$stateParams', 'Global', 'Users', '$state', '$window', function ($scope, $stateParams, Global, Users, $state, $window) {
    $scope.global = Global;

    $scope.create = function () {
        isLoggedIn();
        var user = new Users({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            contact: this.contact,
            active: 1,
            DepartmentId: this.DepartmentId
        });

        user.$save(function (response) {
            // $state.go('viewDepartment', { departmentId: response.id })
            $state.go('users');
        });

        this.name = "";
        this.status = 1;
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