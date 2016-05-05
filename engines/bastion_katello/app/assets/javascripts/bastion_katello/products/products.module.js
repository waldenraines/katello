/**
 * @ngdoc module
 * @name  Bastion.products
 *
 * @description
 *   Module for product related functionality.
 */
angular.module('Bastion.products', [
    'ngResource',
    'ui.router',
    'Bastion',
    'Bastion.components',
    'Bastion.gpg-keys',
    'Bastion.i18n',
    'Bastion.sync-plans',
    'Bastion.tasks',
    'Bastion.utils'
]);

/**
 * @ngdoc object
 * @name Bastion.products.config
 *
 * @requires $stateProvider
 *
 * @description
 *   Used for systems level configuration such as setting up the ui state machine.
 */
angular.module('Bastion.products').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('products', {
        url: '/products',
        permission: 'view_products',
        views: {
            '@': {
                controller: 'ProductsController',
                templateUrl: 'products/views/products.html'
            }
        },
        ncyBreadcrumb: {
            label: "{{ 'Products' | translate }}"
        }
    })

    .state('products.new', {
        abstract: true,
        template: '<div ui-view></div>',
        views: {
            '@': {
                controller: 'NewProductController',
                templateUrl: 'products/new/views/product-new.html'
            }
        }
    })
    .state('products.new.form', {
        url: '/new',
        permission: 'create_products',
        controller: 'ProductFormController',
        templateUrl: 'products/new/views/product-new-form.html',
        ncyBreadcrumb: {
            label: "{{ 'New Product' | translate }}"
        }
    })
    .state('products.new.sync-plan', {
        url: '/new/sync-plan',
        permission: 'create_sync_plans',
        controller: 'NewSyncPlanController',
        templateUrl: 'sync-plans/new/views/new-sync-plan-form.html',
        ncyBreadcrumb: {
            label: "{{ 'New Sync Plan' | translate }}"
        }
    })

    .state("product-discovery", {
        abstract: true,
        url: '/products/discovery',
        controller: 'DiscoveryController',
        templateUrl: 'products/discovery/views/discovery-base.html'
    })
    .state("product-discovery.scan", {
        url: '/scan',
        permission: 'edit_products',
        templateUrl: 'products/discovery/views/discovery.html',
        ncyBreadcrumb: {
            label: "{{ 'Scan for Products' | translate }}",
            parent: 'products'
        }

    })
    .state("product-discovery.create", {
        url: '/scan/create',
        permission: 'edit_products',
        templateUrl: 'products/discovery/views/discovery-create.html',
        controller: 'DiscoveryFormController',
        ncyBreadcrumb: {
            label: "{{ 'Create Products' | translate }}"
        }
    });

    $stateProvider.state("product", {
        abstract: true,
        url: '/products/:productId',
        permission: 'view_products',
        controller: 'ProductDetailsController',
        templateUrl: 'products/details/views/product-details.html'
    })
    .state('product.info', {
        url: '',
        permission: 'view_products',
        controller: 'ProductDetailsInfoController',
        templateUrl: 'products/details/views/product-info.html',
        ncyBreadcrumb: {
            label: "{{ product.name }}",
            parent: 'products'
        }
    })
    .state('product.new-sync-plan', {
        url: '/sync-plan/new',
        permission: 'create_sync_plans',
        controller: 'NewSyncPlanController',
        templateUrl: 'products/details/views/product-new-sync-plan.html',
        ncyBreadcrumb: {
            label: "{{ 'New Sync Plan'  | translate}}",
            parent: 'product.info'
        }
    })
    .state('product.repositories', {
        abstract: true,
        controller: 'ProductRepositoriesController',
        template: '<div ui-view></div>'
    })
    .state('product.repositories.index', {
        url: '/repositories',
        permission: 'view_products',
        templateUrl: 'products/details/views/product-repositories.html',
        ncyBreadcrumb: {
            label: "{{ 'Repositories' | translate }}",
            parent: 'product.info'
        }
    })
    .state('product.repositories.new', {
        url: '/repositories/new',
        permission: 'create_products',
        controller: 'NewRepositoryController',
        templateUrl: 'repositories/new/views/repository-new.html',
        ncyBreadcrumb: {
            label: "{{ 'New Repository' | translate }}",
            parent: 'product.repositories.index'
        }
    });

    $stateProvider.state('product.tasks', {
        abstract: true,
        template: '<div ui-view></div>'
    })
    .state('product.tasks.index', {
        url: '/tasks',
        permission: 'view_products',
        templateUrl: 'products/details/views/product-tasks.html',
        ncyBreadcrumb: {
            label: "{{'Tasks' | translate }}",
            parent: 'product.info'
        }
    })
    .state('product.tasks.details', {
        url: '/tasks/:taskId',
        permission: 'view_products',
        controller: 'TaskDetailsController',
        templateUrl: 'tasks/views/task-details.html',
        ncyBreadcrumb: {
            label: "{{ task.id }}",
            parent: 'product.tasks.index'
        }
    });
}]);
