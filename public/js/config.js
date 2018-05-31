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


        //customer image
        .state('createCustomerImage', {
            url: '/customerimages/create',
           controller: 'CustomerImagesController',
            templateUrl: 'views/customerimages/create.html'
        })

        // buyer      
        .state('createBuyer', {
            url: '/customer/{customerId}/buyer/create',
            controller: 'BuyersController',
            templateUrl: 'views/buyers/create.html'
        })
        .state('editBuyers', {
            url: '/customer/{customerId}/buyer/{buyerId}/edit',
            controller: 'BuyersController',
            templateUrl: 'views/buyers/edit.html'
        })
        .state('viewBuyer', {
            url: '/customer/{customerId}/buyer/{buyerId}',
            controller: 'BuyersController',
            templateUrl: 'views/buyers/view.html'
        })

        // RFQs
        .state('viewRfq', {
            url: '/customer/{customerId}/buyer/{buyerId}/rfq/{rfqId}',
            controller: 'RfqsController',
            templateUrl: 'views/rfqs/view.html'
        })

        // CostSheets
        .state('prepareCostSheet', {
            url: '/rfq/{rfqId}/costsheet/prepare',
            controller: 'CostSheetsController',
            templateUrl: 'views/costsheets/create.html'
        })

        .state('approveCostSheet', {
            url: '/rfq/{rfqId}/costsheet/approval',
            controller: 'CostSheetsController',
            templateUrl: 'views/costsheets/approval.html'
        })

        // CostSheets
        .state('shortQuotation', {
            url: '/rfq/{rfqId}/quotation/short',
            controller: 'CostSheetsController',
            templateUrl: 'views/quotations/short.html'
        })

        .state('detailQuotation', {
            url: '/rfq/{rfqId}/quotation/detail',
            controller: 'CostSheetsController',
            templateUrl: 'views/quotations/detail.html'
        })

        //purchase order
        .state('createPurchaseOrder', {
            url: '/rfq/{rfqId}/purchaseorder',
            controller: 'PurchaseordersController',
            templateUrl: 'views/purchaseorders/create.html'
        })

        //sample submission
        .state('sampleSubmission', {
            url: '/rfq/{rfqId}/samplesubmission',
            controller: 'SampleSubmissionsController',
            templateUrl: 'views/samplesubmission/create.html'
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