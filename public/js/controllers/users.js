'use strict';

var app = angular.module('mean.users').controller('UsersController', ['$scope', '$stateParams', 'Global', 'Users', '$state', '$window', '$filter', '$http', '$controller', '$rootScope', '$location', function ($scope, $stateParams, Global, Users, $state, $window, $filter, $http, $controller, $rootScope, $location) {
    $scope.global = Global;
    $scope.currentPage = 0;
    $scope.pageSize = $window.document.getElementById('hdnPageSize').value;;
    $scope.data = [];
    $scope.searchString = "";
    $scope.loggedInuser = $window.user.id;
    $scope.message = "";
    $scope.getData = function () {
        return $filter('filter')($scope.users, $scope.searchString);
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
        var userData = new Users({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            contact: this.user.contact,
            password: this.user.password,
            active: 1,
            DepartmentId: this.user.DepartmentId
        });
        $scope.message = "Loading.. Please wait..!!";
        userData.$save(function (response) {
           // $state.go('users');

            $http.get("/users/" + user.id).then(function (response) {
                $scope.updatedUser = JSON.stringify(response.data);

                $state.go('users');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New user " + user.id + " is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedUser });
            });


            $scope.message = "";

            this.user.firstName = "";
            this.user.lastName = "";
            this.user.email = "";
            this.user.contact = "";
            this.user.active = 1;
            this.user.password = "";
            this.user.DepartmentId = 0;

        });

       

    };

    $scope.remove = function (userToDelete) {
        var deleteUser = $window.confirm('Are you absolutely sure you want to delete?');
        if (deleteUser) {
            $scope.message = "Loading.. Please wait..!!";
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
                $scope.message = "";
            });
        }
    };

    $scope.resetPassword = function (user) {
        if ($window.confirm('Are you absolutely sure you want to reset the password?')) {
            if (user.id > 0) {
                $scope.message = "Loading.. Please wait..!!";
                $http.get("/users/reset/" + user.id)
                    .then(function (response) {
                       // $scope.message = response.statusText;
                        $scope.successMessage = "Mail sent successfully"
                        $scope.message = "";
                    }, function (response) {
                        //Second function handles error
                        $scope.errorMessage = response.statusText;
                        $scope.message = "";
                    });
            }            
        }
    };

    $scope.update = function () {
        var user = $scope.user;
        $scope.message = "Loading.. Please wait..!!";
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
            $scope.message = "";
        });
    };

    $scope.find = function () {
        $scope.message = "Loading.. Please wait..!!";
        Users.query(function (users) {            
            $scope.users = users;
            $scope.message = "";
            console.log($scope.users);
        });
        
    };

    $scope.findOne = function () {
        $scope.message = "Loading.. Please wait..!!";
        Users.get({
            userId: $stateParams.userId
        }, function (user) {
            $scope.user = user;
            $scope.message = "";
        });
    };

    $scope.canAccess = function (key) {
        var marketingAccess = ['prepare costsheet', 'quotation','PO'];
        var devAccess = ['sample submission', 'inspection report', 'developer handover'];
        var currentUserRole = $window.user.role;

        if (currentUserRole === 'Dev' && devAccess.includes(key)) {
            return true;
        } else if (currentUserRole === 'Marketing' && marketingAccess.includes(key)) {
            return true;
        } else if (currentUserRole === 'Admin') {
            return true;
        }
        return false;
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
