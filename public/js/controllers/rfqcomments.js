'use strict';

angular.module('mean.rfqcomments').controller('RfqcommentsController', ['$scope', '$stateParams', 'Global', 'Rfqcomments', '$state', '$window', '$http', function ($scope, $stateParams, Global, Rfqcomments, $state, $window, $http) {
    $scope.global = Global;

    $scope.create = function () {
        var rfqcomment = new Rfqcomments({
            comment: this.comment,
            UserId: user.id, // user is global variable
            RfqId: $stateParams.rfqId
        });

        rfqcomment.$save(function (response) {
            $window.location.href = '/customer/' + $stateParams.customerId + '/buyer/' + $stateParams.buyerId + '/rfq/' + $stateParams.rfqId;
        });

        this.comment = "";
        this.UserId = "";
        this.RfqId = "";

    };

    $scope.find = function () {
        $http.get("/rfqcomments/" + $stateParams.rfqId)
            .then(function (response) {
                $scope.rfqcomments = response.data;
            }, function (response) {
                console.log(error, $stateParams.rfqId);
            });
    };

}]);