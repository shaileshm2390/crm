'use strict';
angular.module('mean.auth').controller('signIn', ['$scope', '$window', 'Global', '$state', 'LogIn', function ($scope, $window, Global, $state, LogIn) {
    $scope.global = Global;
    $scope.errorMessage = "";
    $scope.successMessage = "";
     
    $scope.signIn = function (user) {        
        var logIn = new LogIn({
            email: user.email,
            password: user.password
        });

        logIn.$save(function (response) {
            var urlParams = new URLSearchParams($window.location.search);
            var redirectUrl = "/";
            if (urlParams.has('redirect')) {
                redirectUrl = urlParams.get('redirect');
            }
            if (response.status === 'success') {
                $scope.errorMessage = "";
                $scope.successMessage = "Authenticated successfully. Please wait.."; 
                $window.location.href = redirectUrl;
            } else {
                $scope.successMessage = "";
                $scope.errorMessage = "Please enter valid credentail";
            }
        });
    };


}]);