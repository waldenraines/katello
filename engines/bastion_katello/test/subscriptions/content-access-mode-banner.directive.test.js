describe('Directive: contentAccessModeBanner', function() {
    var $scope, $compile, element;

    beforeEach(module(
        'Bastion.subscriptions',
        'subscriptions/views/content-access-mode-banner.html',
        'components/views/bst-alert.html'
    ));

    beforeEach(module(function($provide) {
        $provide.value('contentAccessMode', 'org_environment');
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $scope = _$rootScope_;
    }));

    it("set content access mode on scope", function() {
        element = '<div content-access-mode-banner></div>';
        element = $compile(element)($scope);
        $scope.$digest();
        expect($scope.contentAccessMode.toEqual("org_environment"));
    });
});
