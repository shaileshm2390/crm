"use strict";
//Setting up route
angular.module('mean').config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise(function($injector, $location){
        $injector.invoke(['$state', function($state) {
            $state.go('404');
        }]);
    });
    $stateProvider
        .state('home', {
            url: '/',
            controller: 'IndexController',
            templateUrl: 'views/index.html'
        })
        .state('SignIn', {
            url: '/signin',
            templateUrl: 'views/users/signin.html'
        })
        .state('SignUp', {
            url: '/signup',
            templateUrl: 'views/users/signup.html'
        })
        .state('departments', {
            url: '/department',
            controller: 'DepartmentsController',
            templateUrl: 'views/departments/list.html'
        })
        .state('createDepartment', {
            url: '/department/create',
            controller: 'DepartmentsController',
            templateUrl: 'views/departments/create.html'
        })
        .state('editDepartments', {
            url: '/department/{departmentId}/edit',
            controller: 'DepartmentsController',
            templateUrl: 'views/departments/edit.html'
        })
        .state('viewDepartment', {
            url: '/department/{departmentId}',
            controller: 'DepartmentsController',
            templateUrl: 'views/departments/view.html'
        })       

        //user 
        .state('users', {
            url: '/user',
            controller: 'UsersController',
            templateUrl: 'views/users/list.html'
        })
        .state('createUser', {
            url: '/user/create',
            controller: 'UsersController',
            templateUrl: 'views/users/create.html'
        })
        .state('editUsers', {
            url: '/user/{userId}/edit',
            controller: 'UsersController',
            templateUrl: 'views/users/edit.html'
        })
        .state('viewUser', {
            url: '/user/{userId}',
            controller: 'UsersController',
            templateUrl: 'views/users/view.html'
        })  

        //customer
        .state('customers', {
            url: '/customer',
            controller: 'CustomersController',
            templateUrl: 'views/customers/list.html'
        })
        .state('createCustomer', {
            url: '/customer/create',
            controller: 'CustomersController',
            templateUrl: 'views/customers/create.html'
        })
        .state('editCustomers', {
            url: '/customer/{customerId}/edit',
            controller: 'CustomersController',
            templateUrl: 'views/customers/edit.html'
        })
        .state('viewCustomer', {
            url: '/customer/{customerId}',
            controller: 'CustomersController',
            templateUrl: 'views/customers/view.html'
        })

        .state('404', {
            templateUrl: 'views/404.html'
        });
}
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);

}]);