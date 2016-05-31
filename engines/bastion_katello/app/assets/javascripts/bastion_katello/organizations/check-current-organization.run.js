(function () {

    /**
     * @ngdoc run
     * @name Bastion.run:CheckCurrentOrganization
     *
     * @description
     *   Checks whether a page requires a current organization to be set and if it does
     *   redirects the user to the Katello 403 page to instruct them to select an organization to proceed.
     */
    function CheckCurrentOrganization($rootScope, $state, CurrentOrganization, FencedPages) {

        $rootScope.$on('$stateChangeStart', function (event, toState) {
            if (CurrentOrganization === "" && FencedPages.isFenced(toState)) {
                event.preventDefault();
                console.log(toState);
                console.log($state.href(toState, {}, {absolute: true}));
                $rootScope.transitionTo('organizations.select', {toState: $state.href('^' + toState.name, {}, {absolute: true})});

            }
        });

    }

    angular
        .module('Bastion.organizations')
        .run(CheckCurrentOrganization);

    CheckCurrentOrganization.$inject = ['$rootScope', '$state', 'CurrentOrganization', 'FencedPages'];

})();
