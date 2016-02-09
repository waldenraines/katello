/**
 * @ngdoc object
 * @name  Bastion.content-hosts.controller:ContentHostsBulkActionController
 *
 * @requires $scope
 * @requires $q
 * @requires $location
 * @requires HostBulkAction
 * @requires HostCollection
 * @requires Nutupane
 * @requires CurrentOrganization
 * @requires Erratum
 * @requires translate
 * @requires BastionConfig
 *
 * @description
 *   A controller for providing bulk action functionality to the content hosts page.
 */
angular.module('Bastion.content-hosts').controller('ContentHostsBulkActionErrataController',
    ['$scope', '$q', '$location', 'HostBulkAction', 'HostCollection', 'Nutupane', 'CurrentOrganization', 'Erratum', 'BastionConfig',
    function ($scope, $q, $location, HostBulkAction, HostCollection, Nutupane, CurrentOrganization, Erratum, BastionConfig) {

        var nutupane;

        function installParams() {
            var params = $scope.nutupane.getAllSelectedResults();
            params['content_type'] = 'errata';
            params.content = _.pluck($scope.detailsTable.getSelected(), 'errata_id');
            params['organization_id'] = CurrentOrganization;
            return params;
        }

        function fetchErratum(errataId) {
            $scope.erratum = Erratum.get({id: errataId, 'organization_id': CurrentOrganization});
        }

        nutupane = new Nutupane(HostBulkAction, {}, 'installableErrata');
        nutupane.table.closeItem = function () {};
        $scope.detailsTable = nutupane.table;
        $scope.detailsTable.errataFilterTerm = "";
        $scope.detailsTable.initialLoad = false;
        $scope.outOfDate = false;
        $scope.initialLoad = true;
        $scope.remoteExecutionPresent = BastionConfig.remoteExecutionPresent;
        $scope.remoteExecutionByDefault = BastionConfig.remoteExecutionByDefault;
        $scope.setState(false, [], []);

        $scope.fetchErrata = function () {
            var params = $scope.nutupane.getAllSelectedResults('id');
            params['organization_id'] = CurrentOrganization;
            nutupane.setParams(params);
            $scope.detailsTable.working = true;
            $scope.outOfDate = false;
            if ($scope.table.numSelected > 0) {
                nutupane.refresh().then(function () {
                    $scope.detailsTable.working = false;
                    $scope.outOfDate = false;
                });
            } else {
                $scope.detailsTable.working = false;
            }
        };

        $scope.$watch('nutupane.table.rows', function (rows) {
            if ($scope.initialLoad && rows.length > 0) {
                $scope.initialLoad = false;
                $scope.fetchErrata();
            }
        });

        $scope.$watch('nutupane.table.numSelected', function (numSelected) {
            if ((numSelected > 0) && !$scope.detailsTable.working) {
                $scope.outOfDate = true;
            }
        });

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
            $scope.setState(true, [], []);
            HostBulkAction.installContent(params,
                function (data) {
                    $scope.setState(false, [], []);
                    $scope.transitionTo('content-hosts.bulk-actions.task-details', {taskId: data.id});
                },
                function (data) {
                    $scope.setState(false, [], data.errors);
                });
        };

        $scope.installErrataViaRemoteExecution = function(customize) {
            var errataIds = _.pluck($scope.detailsTable.getSelected(), 'errata_id'),
                selectedHosts = $scope.nutupane.getAllSelectedResults();
            form = $('#errataBulkActionForm');
            form.attr('action', '/katello/remote_execution');
            form.attr('method', 'post');
            form.find('input[name=remote_action]').val('errata_install');
            form.find('input[name=name]').val(errataIds.join(','));
            form.find('input[name=authenticity_token]').val(AUTH_TOKEN.replace(/&quot;/g,''));
            form.find('input[name=customize]').val(customize);
            form.find('input[name=content_host_ids]').val(selectedHosts.included.ids.join(','));
            form.find('input[name=scoped_search]').val(selectedHosts.included.search);
            form.submit();
        };

    }]
);
