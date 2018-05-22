'use strict';

var app = angular.module('mean.customers').controller('CustomersController', ['$scope', '$stateParams', 'Global', 'Customers', '$state', '$window', '$filter', function ($scope, $stateParams, Global, Customers, $state, $window, $filter) {
    $scope.global = Global;
    $scope.currentPage = 0;
    $scope.pageSize = 3;
    $scope.data = [];
    $scope.getData = function () {
        return $filter('filter')($scope.customers, $scope.searchString);
    }

    $scope.numberOfPages = function () {
        if (typeof $scope.getData() != 'undefined') {
            return Math.ceil($scope.getData().length / $scope.pageSize);
        }
    }

    $scope.create = function () {
        var customer = new Customers({
            email: this.email,
            company: this.company,
            name: this.name,
            contact: this.contact
        });

        customer.$save(function (response) {
            // $state.go('viewDepartment', { departmentId: response.id })
            $state.go('customers');
        });

        this.email = "";
        this.company = "";
        this.name = "";
        this.contact = "";
       
    };

    $scope.remove = function (customer) {
        var deleteCustomer = $window.confirm('Are you absolutely sure you want to delete?');
        if (deleteCustomer) {
            if (customer) {
                customer.$remove();

                for (var i in $scope.customers) {
                    if ($scope.customers[i] === customer) {
                        $scope.customers.splice(i, 1);
                    }
                }
            }
            else {
                $scope.customer.$remove();
                $state.go('customers');
            }
        }
    };

    $scope.update = function () {
        var customer = $scope.customer;
        if (!customer.updated) {
            customer.updated = [];
        }
        customer.updated.push(new Date().getTime());
        customer.$update(function () {
            //$state.go('viewDepartment', { departmentId: department.id })
            $state.go('customers');
        });
    };

    $scope.find = function () {
        Customers.query(function (customers) {
            $scope.customers = customers;
        });
    };

    $scope.findOne = function () {
        Customers.get({
            customerId: $stateParams.customerId
        }, function (customer) {
            $scope.customer = customer;
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
