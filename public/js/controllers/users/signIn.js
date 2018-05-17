'use strict';
angular.module('mean.auth').controller('signIn', ['$scope', '$window', 'Global', '$state', 'LogIn', function ($scope, $window, Global, $state, LogIn) {
    $scope.global = Global;


    $scope.signIn = function(user) {

        var logIn = new LogIn({
            email: user.email,
            password: user.password
        });

        console.log(logIn);

        logIn.$save(function (response) {               
            if(response.status === 'success'){
                $window.location.href = '/';
            }
        });
    };


}]);