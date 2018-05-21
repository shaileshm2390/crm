'use strict';

var app = angular.module('mean.users').controller('UsersController', ['$scope', '$stateParams', 'Global', 'Users', '$state', '$window', function ($scope, $stateParams, Global, Users, $state, $window) {
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

app.controller('MyCtrl', ['$scope', '$filter', function ($scope, $filter) {
    $scope.currentPage = 0;
    $scope.pageSize = 3;
    $scope.data = [];

    $scope.getData = function () {
        // needed for the pagination calc
        // https://docs.angularjs.org/api/ng/filter/filter
        return $filter('filter')($scope.users)
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

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
