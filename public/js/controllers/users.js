'use strict';

var app = angular.module('mean.users').controller('UsersController', ['$scope', '$stateParams', 'Global', 'Users', '$state', '$window', '$filter', '$http', '$controller', '$rootScope', '$location', function ($scope, $stateParams, Global, Users, $state, $window, $filter, $http, $controller, $rootScope, $location) {
    $scope.global = Global;
    $scope.currentPage = 0;
    $scope.pageSize = $window.document.getElementById('hdnPageSize').value;;
    $scope.data = [];
    $scope.searchString = "";
    $scope.loggedInuser = $window.user.id;
    $scope.getData = function () {
        return $filter('filter')($scope.users, $scope.searchString);
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
        var userData = new Users({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            contact: this.user.contact,
            password: this.user.password,
            active: 1,
            DepartmentId: this.user.DepartmentId
        });
       
        userData.$save(function (response) {
           // $state.go('users');

            $http.get("/users/" + user.id).then(function (response) {
                $scope.updatedUser = JSON.stringify(response.data);

                $state.go('users');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New user " + user.id + " is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedUser });
            });

        });

        this.user.firstName = "";
        this.user.lastName = "";
        this.user.email = "";
        this.user.contact = "";
        this.user.active = 1;
        this.user.password = "";
        this.user.DepartmentId = 0;

    };

    $scope.remove = function (userToDelete) {
        var deleteUser = $window.confirm('Are you absolutely sure you want to delete?');
        if (deleteUser) {
            //get previous data from URL
            $http.get("/users/" + user.id).then(function (response) {
                $scope.previousUser = JSON.stringify(response.data);
                if (userToDelete) {
                    userToDelete.$remove();

                for (var i in $scope.users) {
                    if ($scope.users[i] === userToDelete) {
                        $scope.users.splice(i, 1);
                    }
                }
            }
            else {
                $scope.user.$remove();
                $state.go('users');
                }
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "User " + user.id + " is deleted", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousUser, updatedData: "" });
            });
        }
    };

    $scope.resetPassword = function (user) {
        if ($window.confirm('Are you absolutely sure you want to reset the password?')) {
            if (user.id > 0) {
                $http.get("/users/reset/" + user.id)
                    .then(function (response) {
                       // $scope.message = response.statusText;
                        $scope.message = "Mail sent successfully"
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
        $http.get("/users/" + user.id).then(function (response) {
            $scope.previousUser = JSON.stringify(response.data);
        });
        user.updated.push(new Date().getTime());
        user.$update(function () {
            //$state.go('viewDepartment', { departmentId: department.id })
           // $state.go('users');

            ///get updated data from URL
            $http.get("/users/" + user.id).then(function (response) {
                $scope.updatedUser = JSON.stringify(response.data);

                $state.go('users');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "user " + user.id + " is updated.", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: $scope.loggedInuser, previousData: $scope.previousUser, updatedData: $scope.updatedUser });
            });
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
