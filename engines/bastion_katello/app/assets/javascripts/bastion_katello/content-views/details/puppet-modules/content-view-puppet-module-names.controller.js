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
 * @name  Bastion.content-views.controller:ContentViewPuppetModulesController
 *
 * @requires $scope
 * @requires $location
 * @requires Nutupane
 * @requires ContentView
 *
 * @description
 *   Provides functionality to the puppet modules name list.
 */
angular.module('Bastion.content-views').controller('ContentViewPuppetModuleNamesController',
    ['$scope', '$location', 'Nutupane', 'ContentView', function ($scope, $location, Nutupane, ContentView) {
        var nutupane, params = {
            id: $scope.$stateParams.contentViewId,
            'paged':            true,
            'search':           $location.search().search || ""
        };

        nutupane = new Nutupane(ContentView, params, 'availablePuppetModuleNames');

        $scope.detailsTable = nutupane.table;

        $scope.selectVersion = function (moduleName) {
            $scope.transitionTo('content-views.details.puppet-modules.versions',
                {
                    contentViewId: $scope.$stateParams.contentViewId,
                    moduleName: moduleName
                }
            );
        };

    }]
);
