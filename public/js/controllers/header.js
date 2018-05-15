'use strict';
angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', 'SignOut', '$state', function ($scope, Global, SignOut, $state) {
    $scope.global = Global;

    $scope.menu = [
    //{
    //    "title": "Departments",
    //    "state": "departments"
    //}, {
    //    "title": "Create New Department",
    //    "state": "createDepartment"
    //    }
    ];
    
    $scope.isCollapsed = false;

    $scope.SignOut = function(){
        SignOut.get(function(response){
            if(response.status === 'success'){
                $scope.global = null;
                $state.go('home');
                window.location.href = '/';
            }
        });
    }


}]);