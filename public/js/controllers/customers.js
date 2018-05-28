'use strict';

var app = angular.module('mean.customers').controller('CustomersController', ['$scope', '$stateParams', 'Global', 'Customers', '$state', '$window', '$filter', '$http', '$rootScope', '$controller', '$location', function ($scope, $stateParams, Global, Customers, $state, $window, $filter, $http, $rootScope, $controller, $location) {
    $scope.global = Global;
    $scope.currentPage = 0;
    $scope.pageSize = $window.document.getElementById('hdnPageSize').value;
    $scope.data = [];
    $scope.imagesString = '';

    $scope.getData = function () {
        return $filter('filter')($scope.customers, $scope.searchString);
    }

    $scope.numberOfPages = function () {
        if (typeof $scope.getData() != 'undefined') {
            return Math.ceil($scope.getData().length / $scope.pageSize);
        }
    }

    $scope.add = function () {
        $state.go('createCustomerImage');
        //$window.location.href = "/createCustomerImage";
    };

    //get ip address
    var url = "//freegeoip.net/json/";
    $http.get(url).then(function (response) {
        $rootScope.ip = response.data.ip;
    });

    $scope.create = function () {
        var customer = new Customers({
            email: this.email,
            company: this.company,
            name: this.name,
            contact: this.contact,
            imagesString: this.imagesString
        });

        console.log(customer);
        customer.$save(function (response) {
            // $state.go('viewDepartment', { departmentId: response.id })
            //$state.go('customers');
            $http.get("/customers/" + customer.id).then(function (response) {
                $scope.updatedCustomer = JSON.stringify(response.data);

                $state.go('customers');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New customer " + customer.id + " is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedCustomer });
            });
        });

        this.email = "";
        this.company = "";
        this.name = "";
        this.contact = "";
        this.imagesString = "";
       
    };

    $scope.remove = function (customer) {
        var deleteCustomer = $window.confirm('Are you absolutely sure you want to delete?');
        if (deleteCustomer) {
            //get previous data from URL
            $http.get("/customers/" + customer.id).then(function (response) {
                $scope.previousCustomer = JSON.stringify(response.data);
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
            var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
            commonCtrl.create({ message: "Customer " + customer.id + " is deleted", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousCustomer, updatedData: "" });
            });
        }
    };

    $scope.update = function () {
        $scope.customer.imagesString = $scope.imagesString;
        var customer = $scope.customer;
        console.log("customer public controller  -->  " + JSON.stringify(customer));
        console.log("$scope.imageStrings   -->> " + $scope.imagesString);

        console.log("customer public controller 2 -->  " + JSON.stringify(customer));
        if (!customer.updated) {
            customer.updated = [];
        }
        //get previous data from URL
        $http.get("/customers/" + customer.id).then(function (response) {
            $scope.previousCustomer = JSON.stringify(response.data);
        });
        
        customer.updated.push(new Date().getTime());
        customer.$update(function () {
       
            ///get updated data from URL
            $http.get("/customers/" + customer.id).then(function (response) {
                $scope.updatedCustomer = JSON.stringify(response.data);

                $state.go('viewCustomer', { customerId: customer.id })
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "Customer " + customer.id + " is updated.", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousCustomer, updatedData: $scope.updatedCustomer });
            });
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
