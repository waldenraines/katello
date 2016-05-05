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
    'Bastion.i18n',
    'Bastion.utils',
    'Bastion.components',
    'Bastion.sync-plans',
    'Bastion.gpg-keys',
    'Bastion.tasks'
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

    .state("products.discovery", {
        abstract: true,
        template: '<div ui-view></div>',
        views: {
            '@': {
                controller: 'DiscoveryController',
                templateUrl: 'products/discovery/views/discovery-base.html'
            }
        }
    })
    .state("products.discovery.scan", {
        url: '/discovery/scan',
        permission: 'edit_products',
        templateUrl: 'products/discovery/views/discovery.html',
        ncyBreadcrumb: {
            label: "{{ 'Scan for Products' | translate }}"
        }

    })
    .state("products.discovery.create", {
        url: '/discovery/scan/create',
        permission: 'edit_products',
        templateUrl: 'products/discovery/views/discovery-create.html',
        controller: 'DiscoveryFormController'

    });

    $stateProvider.state("products.bulk-actions", {
        abstract: true,
        template: '<div ui-view></div>',
        views: {
            '@': {
                controller: 'ProductsBulkActionController',
                templateUrl: 'products/bulk/views/bulk-actions.html'
            }
        }
    })
    .state('products.bulk-actions.sync', {
        url: '/bulk-actions/sync',
        permission: 'sync_products',
        controller: 'ProductsBulkActionSyncController',
        templateUrl: 'products/bulk/views/bulk-actions-sync.html',
        ncyBreadcrumb: {
            label: "{{ 'Bulk Actions Sync' | translate }}",
            parent: 'products'
        }
    })
    .state('products.bulk-actions.sync-plan', {
        url: '/bulk-actions/sync-plan',
        permission: 'edit_products',
        controller: 'ProductsBulkActionSyncPlanController',
        templateUrl: 'products/bulk/views/bulk-actions-sync-plan.html',
        ncyBreadcrumb: {
            label: "{{ 'Bulk Actions Sync Plan' | translate }}",
            parent: 'products'
        }
    })
    .state('products.bulk-actions.sync-plan.new', {
        url: '/bulk-actions/sync-plan/new',
        permission: 'create_sync_plans',
        views: {
            '@products.bulk-actions': {
                controller: 'NewSyncPlanController',
                templateUrl: 'sync-plans/new/views/new-sync-plan-form.html'
            }
        },
        ncyBreadcrumb: {
            label: "{{ 'Bulk Actions New Sync Plan' | translate }}",
            parent: 'products'
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
    .state('product.info.new-sync-plan', {
        url: '/sync-plan/new',
        permission: 'create_sync_plans',
        controller: 'NewSyncPlanController',
        templateUrl: 'sync-plans/new/views/new-sync-plan-form.html',
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
    })
    .state('product.repositories.info', {
        url: '/repositories/:repositoryId',
        permission: 'view_products',
        controller: 'RepositoryDetailsInfoController',
        templateUrl: 'repositories/details/views/repository-info.html',
        ncyBreadcrumb: {
            label: "{{ repository.name }}",
            parent: 'product.repositories.index'
        }
    })
    .state('product.repositories.manage-content', {
        abstract: true,
        controller: 'RepositoryManageContentController',
        template: '<div ui-view></div>'
    })
    .state('product.repositories.manage-content.packages', {
        url: '/repositories/:repositoryId/content/packages',
        permission: 'view_products',
        templateUrl: 'repositories/details/views/repository-manage-packages.html',
        ncyBreadcrumb: {
            label: "{{'Manage Packages' | translate }}",
            parent: 'product.repositories.info'
        }
    })
    .state('product.repositories.manage-content.package-groups', {
        url: '/repositories/:repositoryId/content/package_groups',
        permission: 'view_products',
        templateUrl: 'repositories/details/views/repository-manage-package-groups.html',
        ncyBreadcrumb: {
            label: "{{'Manage Package Groups' | translate }}",
            parent: 'product.repositories.info'
        }
    })
    .state('product.repositories.manage-content.puppet-modules', {
        url: '/repositories/:repositoryId/content/puppet_modules',
        permission: 'view_products',
        templateUrl: 'repositories/details/views/repository-manage-puppet-modules.html',
        ncyBreadcrumb: {
            label: "{{'Manage Puppet Modules' | translate }}",
            parent: 'product.repositories.info'
        }
    })
    .state('product.repositories.manage-content.docker-manifests', {
        url: '/repositories/:repositoryId/content/docker_manifests',
        permission: 'view_products',
        templateUrl: 'repositories/details/views/repository-manage-docker-manifests.html',
        ncyBreadcrumb: {
            label: "{{'Manage Docker Manifests' | translate }}",
            parent: 'product.repositories.info'
        }
    })
    .state('product.repositories.manage-content.ostree-branches', {
        url: '/repositories/:repositoryId/content/ostree_branches',
        permission: 'view_products',
        templateUrl: 'repositories/details/views/repository-manage-ostree-branches.html',
        ncyBreadcrumb: {
            label: "{{'Manage OSTree Branches' | translate }}",
            parent: 'product.repositories.info'
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
