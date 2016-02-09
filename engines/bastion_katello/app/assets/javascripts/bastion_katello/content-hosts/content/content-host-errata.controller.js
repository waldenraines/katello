/**
 * @ngdoc object
 * @name  Bastion.content-hosts.controller:ContentHostErrataController
 *
 * @requires $scope
 * @requires HostErratum
 * @requires Nutupane
 * @requires BastionConfig
 *
 * @description
 *   Provides the functionality for the content host package list and actions.
 */
/*jshint camelcase:false*/
angular.module('Bastion.content-hosts').controller('ContentHostErrataController',
    ['$scope', 'translate', 'HostErratum', 'Nutupane', 'Organization', 'Environment', 'BastionConfig',
    function ($scope, translate, HostErratum, Nutupane, Organization, Environment, BastionConfig) {
        var errataNutupane, params = {
            'sort_by': 'updated',
            'sort_order': 'DESC',
            'paged': true,
            'errata_restrict_applicable': true
        };

        function loadErratum(errataId) {
            $scope.erratum = HostErratum.get({'id': $scope.host.id,
                'errata_id': errataId});
        }

        errataNutupane = new Nutupane(HostErratum, params, 'get');
        errataNutupane.masterOnly = true;
        $scope.detailsTable = errataNutupane.table;
        $scope.detailsTable.errataFilterTerm = "";
        $scope.detailsTable.errataCompare = function (item) {
            var searchText = $scope.detailsTable.errataFilterTerm;
            return item.type.indexOf(searchText) >= 0 ||
                item.errata_id.indexOf(searchText) >= 0 ||
                item.title.indexOf(searchText) >= 0;
        };

        $scope.remoteExecutionPresent = BastionConfig.remoteExecutionPresent;
        $scope.remoteExecutionByDefault = BastionConfig.remoteExecutionByDefault;

        $scope.selectedErrataOption = 'current';
        $scope.errataOptions = [{name: "Current Environment", label: 'current'}, {name: 'foo', label: 'bar'}];

        $scope.detailsTable.initialLoad = false;
        $scope.host.$promise.then(function() {
            if ($scope.host.content && $scope.host.id) {
                errataNutupane.setParams({id: $scope.host.id});
                errataNutupane.load();
            }
        });

        $scope.setupErrataOptions = function (host) {
            var libraryString = translate("Library Synced Content"),
                currentEnv = translate("Current Environment (%e/%cv)").replace("%e", host.content.lifecycle_environment_name).replace("%cv", host.content.content_view_name),
                previousEnv;

            $scope.errataOptions = [{name: currentEnv, label: 'current', order: 3}];

            if (!host.content['lifecycle_environment_library?']) {
                Environment.get({id: host.content.lifecycle_environment_id}).$promise.then(function (env) {
                    previousEnv = translate("Previous Environment (%e/%cv)").replace('%e', env.prior.name).replace("%cv", host.content_view_name);
                    $scope.errataOptions.push({name: previousEnv,
                        label: 'prior', order: 2, 'content_view_id': host.content.content_view_id, 'environment_id': env.prior.id});

                });
            }
            if (!host.content['content_view_default?']) {
                Organization.get({id: host.organization_id}).$promise.then(function (org) {
                    $scope.errataOptions.push({name: libraryString, label: 'library', order: 1,
                        'content_view_id': org.default_content_view_id, 'environment_id': org.library_id});
                });
            }
        };

        $scope.host.$promise.then($scope.setupErrataOptions);

        $scope.refreshErrata = function (selected) {
            var option, errataParams;
            errataParams = {'id': $scope.host.id};
            $scope.selectedErrataOption = selected;

            if (selected === 'library' || selected === 'prior') {
                option = _.find($scope.errataOptions, function (opt) {
                    return opt.label === selected;
                });
                errataParams['content_view_id'] = option['content_view_id'];
                errataParams['environment_id'] = option['environment_id'];
            }

            errataNutupane.setParams(errataParams);
            errataNutupane.refresh();
        };

        $scope.transitionToErratum = function (erratum) {
            loadErratum(erratum.errata_id);
            $scope.transitionTo('content-hosts.details.errata.details', {errataId: erratum.errata_id});
        };

        $scope.selectedErrataIds = function () {
            var errataIds = [];
            selected = $scope.detailsTable.getSelected();
            angular.forEach(selected, function (value) {
                errataIds.push(value.errata_id);
            });
            return errataIds;
        };

        $scope.performViaKatelloAgent = function () {
            var errataIds = $scope.selectedErrataIds();
            if (errataIds.length > 0) {
                HostErratum.apply({id: $scope.host.id, 'errata_ids': errataIds},
                                   function (task) {
                                        $scope.detailsTable.selectAll(false);
                                        $scope.transitionTo('content-hosts.details.tasks.details', {taskId: task.id});
                                    });
            }
        };

        $scope.performViaRemoteExecution = function(customize) {
            var errataIds = $scope.selectedErrataIds();
            form = $('#remoteActionForm');
            form.attr('action', '/katello/remote_execution');
            form.attr('method', 'post');
            form.find('input[name=remote_action]').val('errata_install');
            form.find('input[name=name]').val(errataIds.join(','));
            form.find('input[name=authenticity_token]').val(AUTH_TOKEN.replace(/&quot;/g,''));
            form.find('input[name=customize]').val(customize);
            form.find('input[name=host_ids]').val($scope.contentHost.host.id);
            form.submit();
        };

        $scope.applySelected = function () {
            if ($scope.remoteExecutionByDefault) {
                $scope.performViaRemoteExecution(false);
            } else {
                $scope.performViaKatelloAgent();
            }
        };

        if ($scope.$stateParams.errataId) {
            loadErratum($scope.$stateParams.errataId);
        }
    }
]);
