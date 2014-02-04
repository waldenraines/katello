/**
 * Copyright 2013 Red Hat, Inc.
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
 * @ngdoc directive
 * @name Bastion.widgets.directive:title
 *
 * @requires PageTitle
 *
 * @description
 *   Provides a way to set the title of the page.
 */
angular.module('Bastion.widgets').directive('pageTitle', ['PageTitle', function (PageTitle) {
    return {
        scope: {
            model: '=',
            modelName: '@model'
        },
        compile: function (element, attrs) {
            var title = attrs.pageTitle;

            return function (scope) {
                scope[scope.modelName] = scope.model;
                if (scope.model && scope.model.hasOwnProperty('$promise')) {
                    scope.model.$promise.then(function () {
                        PageTitle.setTitle(title, scope);
                    });
                } else {
                    PageTitle.setTitle(title, scope);
                }
            };
        }
    };
}]);
