angular.module('autocompleteApp').controller('autocompleteController', function ($scope) {

        $scope.filteredChoices = [];
        $scope.isVisible = {
            suggestions: true
        };

        $scope.filterItems = function () {
            if ($scope.minlength <= $scope.enteredtext.length) {
                $scope.filteredChoices = querySearch($scope.enteredtext);
                $scope.isVisible.suggestions = $scope.filteredChoices.length > 0 ? true : false;
            }
            else {
                $scope.isVisible.suggestions = false;
            }
        };


        /**
         * Takes one based index to save selected choice object
         */
        $scope.selectItem = function (index) {
            $scope.selected = $scope.choices[index - 1];
            $scope.enteredtext = $scope.selected.label;
            $scope.isVisible.suggestions = false;
            window.location.href = "/rfq/" + $(".hdnRfqId").val() + "/costsheet/prepare/" + $('.ddlParts').val() + "/" + $scope.selected.id;
        };

        /**
         * Search for states... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearch(query) {
            // returns list of filtered items
            return query ? $scope.choices.filter(createFilterFor(query)) : [];
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = query.toLowerCase();

            return function filterFn(item) {
                // Check if the given item matches for the given query
                var label = item.label.toLowerCase();
                return (label.indexOf(lowercaseQuery) === 0);
            };
        }
}).directive('autocomplete', function ($timeout) {
    return {
        controller: 'autocompleteController',
        restrict: 'E',
        replace: true,
        scope: {
            choices: '=',
            enteredtext: '=',
            minlength: '=',
            selected: '='
        },
        templateUrl: '/views/costsheets/autocomplete.html'
    };
});




angular.module('autocompleteApp').controller('mainController', ['$scope', '$stateParams', 'Global', 'Buyers', '$state', '$window', '$http', '$rootScope', '$controller', '$location', function ($scope, $stateParams, Global, Buyers, $state, $window, $http, $rootScope, $controller, $location) {

    var choices = [];
    $http.get("/rfqParts/all")
        .then(function (response) {
            console.log(response.data);
            var index = 1;
            $.each(response.data, function (key, value) {
                choices.push({ index: index, id: value.id, label: value.partName});
                index++;
            });
            $scope.items = choices;
            $scope.text = '';
            $scope.minlength = 1;
            $scope.selected = {};
        }, function (response) {
            console.log(response);
        });

    //var choices = [
    //        { index: 1, id: 'ABC1', label: 'One' },
    //        { index: 2, id: 'ABC2', label: 'Two' },
    //        { index: 3, id: 'ABC3', label: 'Three' },
    //        { index: 4, id: 'ABC4', label: 'Four' },
    //        { index: 5, id: 'ABC5', label: 'Five' },
    //        { index: 6, id: 'ABC6', label: 'Six' },
    //        { index: 7, id: 'ABC7', label: 'Seven' },
    //        { index: 8, id: 'ABC8', label: 'Eight' },
    //        { index: 9, id: 'ABC9', label: 'Nine' },
    //        { index: 10, id: 'ABC10', label: 'Ten' },
    //    ];

        
}]);
