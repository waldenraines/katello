/**
 * @ngdoc object
 * @name  Bastion.content-hosts.controller:ContentHostsBulkErrataModalController
 *
 * @requires $scope
 * @requires $http
 * @requires $location
 * @requires $window
 * @requires $timeout
 * @requires $uibModalInstance
 * @requires HostBulkAction
 * @requires HostCollection
 * @requires Nutupane
 * @requires CurrentOrganization
 * @requires Erratum
 * @requires GlobalNotification
 * @requires BastionConfig
 * @requires hostIds
 *
 * @description
 *   A controller for providing bulk action functionality to the content hosts page.
 */
angular.module('Bastion.content-hosts').controller('ContentHostsBulkErrataModalController',
    ['$scope', '$http', '$location', '$timeout', '$window', '$uibModalInstance', 'HostBulkAction', 'HostCollection', 'Nutupane', 'CurrentOrganization', 'Erratum', 'GlobalNotification', 'BastionConfig', 'hostIds',
    function ($scope, $http, $location, $window, $uibModalInstance, HostBulkAction, HostCollection, Nutupane, CurrentOrganization, Erratum, Notification, BastionConfig, hostIds) {
        var nutupane;

        function installParams() {
            var params = hostIds;
            params['content_type'] = 'errata';
            params.content = _.map($scope.table.getSelected(), 'errata_id');
            params['organization_id'] = CurrentOrganization;
            return params;
        }

        function fetchErratum(errataId) {
            $scope.erratum = Erratum.get({id: errataId, 'organization_id': CurrentOrganization});
        }

        nutupane = new Nutupane(HostBulkAction, hostIds, 'installableErrata');
        $scope.controllerName = 'katello_errata';
        nutupane.masterOnly = true;

        $scope.table = nutupane.table;
        $scope.table.errataFilterTerm = "";
        $scope.table.initialLoad = false;
        $scope.initialLoad = true;
        $scope.remoteExecutionPresent = BastionConfig.remoteExecutionPresent;
        $scope.remoteExecutionByDefault = BastionConfig.remoteExecutionByDefault;

        $scope.errataActionFormValues = {
            authenticityToken: $window.AUTH_TOKEN.replace(/&quot;/g, ''),
            search: hostIds.included.search
        };

        if (hostIds.included.ids) {
            $scope.errataActionFormValues.hostIds = hostIds.included.ids.join(',');
        }

        $scope.fetchErrata = function () {
            var params = hostIds;
            params['organization_id'] = CurrentOrganization;
            nutupane.setParams(params);
            $scope.table.working = true;
            if ($scope.table.numSelected > 0) {
                nutupane.refresh().then(function () {
                    $scope.table.working = false;
                });
            } else {
                $scope.table.working = false;
            }
        };

        $scope.transitionToErrata = function (erratum) {
            fetchErratum(erratum['errata_id']);
            $scope.transitionTo('content-hosts.bulk-actions.errata.details', {errataId: erratum['errata_id']});
        };

        $scope.transitionToErrataContentHosts = function (erratum) {
            $scope.erratum = erratum;
            $scope.transitionTo('content-hosts.bulk-actions.errata.content-hosts', {errataId: erratum['errata_id']});
        };

        $scope.installErrata = function () {
            if ($scope.remoteExecutionByDefault) {
                $scope.installErrataViaRemoteExecution();
            } else {
                $scope.installErrataViaKatelloAgent(false);
            }
        };

        $scope.installErrataViaKatelloAgent = function () {
            var params = installParams();
            HostBulkAction.installContent(params,
                function (data) {
                    nutupane.invalidate();
                    $scope.ok();
                    $scope.transitionTo('content-hosts.bulk-task', {taskId: data.id});
                },
                function (response) {
                    angular.forEach(response.data.errors, function (error) {
                        GlobalNotification.setErrorMessage(error);
                    });
                });
        };

        $scope.installErrataViaRemoteExecution = function(customize) {
            var errataIds = _.map($scope.table.getSelected(), 'errata_id');

            $scope.errataActionFormValues.remoteAction = 'errata_install';
            $scope.errataActionFormValues.errata = errataIds.join(',');
            $scope.errataActionFormValues.customize = customize;

            $timeout(function () {
                angular.element('#errataActionForm').submit();
            }, 0);
        };

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.fetchErrata();
    }]
);
