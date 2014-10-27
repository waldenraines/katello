/**
 * Copyright 2014 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
 */

/**
 * @ngdoc object
 * @name  Bastion.errata.controller:ErrataContentHostsController
 *
 * @requires $scope
 * @requires translate
 * @requires Nutupane
 * @requires Erratum
 * @requires ContentHostsHelper
 * @requires ContentHostBulkAction
 * @requires CurrentOrganization
 *
 * @description
 *   Provides the functionality for the host collection details action pane.
 */
angular.module('Bastion.errata').controller('ErrataContentHostsController',
    ['$scope', 'translate', 'Nutupane', 'Erratum', 'ContentHostsHelper', 'ContentHostBulkAction', 'CurrentOrganization',
    function ($scope, translate, Nutupane, Erratum, ContentHostsHelper, ContentHostBulkAction, CurrentOrganization) {
        var nutupane = new Nutupane(Erratum, {id: $scope.$stateParams.errataId}, 'applicableContentHosts');
        nutupane.table.closeItem = function () {};

        $scope.detailsTable = nutupane.table;
        $scope.detailsTable.getStatusColor = ContentHostsHelper.getStatusColor;
        $scope.detailsTable.getProvisioningStatusColor = ContentHostsHelper.getProvisioningStatusColor;

        $scope.successMessages = [];
        $scope.errorMessages = [];

        $scope.applyErrata = function () {
            var params = nutupane.getAllSelectedResults(),
                success, error;

            params['content_type'] = 'errata';
            params.content = [$scope.errata['errata_id']];
            params['organization_id'] = CurrentOrganization;

            success = function () {
                $scope.successMessages = [translate("Successfully scheduled installation of errata")];
                nutupane.refresh();
            };

            error = function (data) {
                $scope.errorMessages = data.errors;
            };

            ContentHostBulkAction.installContent(params, success, error);
        };
    }
]);
