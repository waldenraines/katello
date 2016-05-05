(function () {
    function RepositoryRoutes($stateProvider) {
        /**
         * @ngdoc object
         * @name  Bastion.repositories:RepositoryRoutes
         *
         * @requires $stateProvider
         *
         * @description
         *   Routes for repository pages.
         */

        $stateProvider.state("repository", {
            abstract: true,
            url: '/products/:productId/repositories/:repositoryId',
            permission: 'view_products',
            controller: 'RepositoryDetailsController',
            templateUrl: 'repositories/details/views/repository-details.html'
        })
        .state('repository.info', {
            url: '',
            permission: 'view_products',
            controller: 'RepositoryDetailsInfoController',
            templateUrl: 'repositories/details/views/repository-info.html',
            ncyBreadcrumb: {
                label: "{{ repository.name }}",
                parent: 'product.repositories.index'
            }
        })
        .state('repository.manage-content', {
            abstract: true,
            controller: 'RepositoryManageContentController',
            template: '<div ui-view></div>'
        })
        .state('repository.manage-content.packages', {
            url: '/content/packages',
            permission: 'view_products',
            templateUrl: 'repositories/details/views/repository-manage-packages.html',
            ncyBreadcrumb: {
                label: "{{'Packages' | translate }}",
                parent: 'repository.info'
            }
        })
        .state('repository.manage-content.package-groups', {
            url: '/content/package_groups',
            permission: 'view_products',
            templateUrl: 'repositories/details/views/repository-manage-package-groups.html',
            ncyBreadcrumb: {
                label: "{{'Package Groups' | translate }}",
                parent: 'repository.info'
            }
        })
        .state('repository.manage-content.puppet-modules', {
            url: '/content/puppet_modules',
            permission: 'view_products',
            templateUrl: 'repositories/details/views/repository-manage-puppet-modules.html',
            ncyBreadcrumb: {
                label: "{{'Manage Puppet Modules' | translate }}",
                parent: 'repository.info'
            }
        })
        .state('repository.manage-content.docker-manifests', {
            url: '/content/docker_manifests',
            permission: 'view_products',
            templateUrl: 'repositories/details/views/repository-manage-docker-manifests.html',
            ncyBreadcrumb: {
                label: "{{'Docker Manifests' | translate }}",
                parent: 'repository.info'
            }
        })
        .state('repository.manage-content.ostree-branches', {
            url: '/content/ostree_branches',
            permission: 'view_products',
            templateUrl: 'repositories/details/views/repository-manage-ostree-branches.html',
            ncyBreadcrumb: {
                label: "{{'OSTree Branches' | translate }}",
                parent: 'repository.info'
            }
        });

        $stateProvider.state('repository.tasks', {
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state('repository.tasks.index', {
            url: '/tasks',
            permission: 'view_repositories',
            templateUrl: 'repositories/details/views/repository-tasks.html',
            ncyBreadcrumb: {
                label: "{{'Tasks' | translate }}",
                parent: 'repository.info'
            }
        })
        .state('repository.tasks.details', {
            url: '/tasks/:taskId',
            permission: 'view_repositories',
            controller: 'TaskDetailsController',
            templateUrl: 'tasks/views/task-details.html',
            ncyBreadcrumb: {
                label: "{{ task.id }}",
                parent: 'repository.tasks.index'
            }
        });
    }

    angular.module('Bastion.repositories').config(RepositoryRoutes);

    RepositoryRoutes.$inject = ['$stateProvider'];
})();
