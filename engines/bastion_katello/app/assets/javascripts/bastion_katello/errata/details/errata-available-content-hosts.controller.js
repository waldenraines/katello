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
 * @name  Bastion.errata.controller:ErrataAvailableContentHostsController
 *
 * @requires $scope
 * @requires Nutupane
 * @requires ContentHost
 *
 * @description
 *   Provides the functionality for the host collection details action pane.
 */
angular.module('Bastion.errata').controller('ErrataAvailableContentHostsController',
    ['$scope', 'translate', 'Nutupane', 'ContentHost',
    function ($scope, translate, Nutupane, ContentHost) {
        var nutupane = new Nutupane(ContentHost, {erratum_id: $scope.$stateParams.errataId,
            erratum_restrict_available: true});
        nutupane.table.closeItem = function () {};
        $scope.nutupane = nutupane;
        $scope.detailsTable = nutupane.table;
    }
]);